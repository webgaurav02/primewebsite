import "server-only";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { assertCan } from "@/lib/auth/rbac";
import { requireUser } from "@/lib/auth/user-session";
import { withAdminContext, withUserContext } from "@/lib/db/client";
import { recordAudit } from "@/lib/audit/log";
import { emitTimelineEvent, emitNotification } from "@/lib/dal/events";
import {
  applyToProgramSchema,
  reviewApplicationSchema,
  createCycleSchema,
  cycleStatusSchema,
} from "@/lib/validation/program";
import type { ApplicationStatus, CycleStatus } from "@/lib/programs/types";
import { WITHDRAWABLE } from "@/lib/programs/types";

/**
 * Programs DAL. Members browse open cycles and apply (one application per cycle);
 * managing admins run cycles and decide applications. Every decision lands on the
 * applicant's timeline + notifications, and every access is audited.
 */

type FieldErrors = Record<string, string[]>;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type Result = { ok: true } | { ok: false; error: string; fieldErrors?: FieldErrors };

// ── Member: browse open programs + my application per cycle ────────────────────

export interface MemberCycle {
  id: string;
  label: string;
  opensAt: string | null;
  closesAt: string | null;
  myApplicationId: string | null;
  myStatus: ApplicationStatus | null;
}
export interface MemberProgram {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cycles: MemberCycle[];
}

export async function listOpenPrograms(): Promise<MemberProgram[]> {
  const user = await requireUser();
  return withUserContext(user.id, async (tx) => {
    const rows = await tx<
      {
        programId: string; slug: string; name: string; description: string | null;
        cycleId: string; label: string; opensAt: Date | null; closesAt: Date | null;
        myApplicationId: string | null; myStatus: ApplicationStatus | null;
      }[]
    >`
      SELECT p.id AS "programId", p.slug, p.name, p.description,
             c.id AS "cycleId", c.label, c.opens_at AS "opensAt", c.closes_at AS "closesAt",
             a.id AS "myApplicationId", a.status AS "myStatus"
      FROM program p
      JOIN program_cycle c ON c.program_id = p.id AND c.status = 'open'
      LEFT JOIN program_application a
        ON a.cycle_id = c.id AND a.user_id = ${user.id}
      WHERE p.is_active
      ORDER BY p.name, c.created_at DESC`;

    const byProgram = new Map<string, MemberProgram>();
    for (const r of rows) {
      let prog = byProgram.get(r.programId);
      if (!prog) {
        prog = { id: r.programId, slug: r.slug, name: r.name, description: r.description, cycles: [] };
        byProgram.set(r.programId, prog);
      }
      prog.cycles.push({
        id: r.cycleId,
        label: r.label,
        opensAt: r.opensAt ? r.opensAt.toISOString() : null,
        closesAt: r.closesAt ? r.closesAt.toISOString() : null,
        myApplicationId: r.myApplicationId,
        myStatus: r.myStatus,
      });
    }
    return [...byProgram.values()];
  });
}

// ── Member: my applications ───────────────────────────────────────────────────

export interface MyApplication {
  id: string;
  programName: string;
  cycleLabel: string;
  status: ApplicationStatus;
  decisionNote: string | null;
  submittedAt: string | null;
}

export async function getMyApplications(): Promise<MyApplication[]> {
  const user = await requireUser();
  return withUserContext(user.id, async (tx) => {
    const rows = await tx<
      {
        id: string; programName: string; cycleLabel: string; status: ApplicationStatus;
        decisionNote: string | null; submittedAt: Date | null;
      }[]
    >`
      SELECT a.id, p.name AS "programName", c.label AS "cycleLabel", a.status,
             a.decision_note AS "decisionNote", a.submitted_at AS "submittedAt"
      FROM program_application a
      JOIN program_cycle c ON c.id = a.cycle_id
      JOIN program p ON p.id = c.program_id
      WHERE a.user_id = ${user.id}
      ORDER BY a.created_at DESC`;
    return rows.map((r) => ({
      ...r,
      submittedAt: r.submittedAt ? r.submittedAt.toISOString() : null,
    }));
  });
}

// ── Member: apply ─────────────────────────────────────────────────────────────

export async function applyToProgram(raw: unknown): Promise<Result> {
  const user = await requireUser();
  // Soft-gate: verifying email is required before applying to a programme.
  if (!user.emailVerified) {
    return { ok: false, error: "Please verify your email before applying." };
  }
  const parsed = applyToProgramSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the form.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as FieldErrors,
    };
  }
  const d = parsed.data;

  return withUserContext(user.id, async (tx) => {
    const [cycle] = await tx<{ id: string; status: CycleStatus; name: string; label: string }[]>`
      SELECT c.id, c.status, p.name, c.label
      FROM program_cycle c JOIN program p ON p.id = c.program_id
      WHERE c.id = ${d.cycleId}`;
    if (!cycle) return { ok: false, error: "That program cycle was not found." };
    if (cycle.status !== "open") return { ok: false, error: "Applications for this cycle are closed." };

    const [existing] = await tx`
      SELECT 1 FROM program_application WHERE user_id = ${user.id} AND cycle_id = ${d.cycleId}`;
    if (existing) return { ok: false, error: "You have already applied to this cycle." };

    const [me] = await tx<{ organizationId: string | null }[]>`
      SELECT organization_id AS "organizationId" FROM app_user WHERE id = ${user.id}`;

    await tx`
      INSERT INTO program_application
        (user_id, cycle_id, organization_id, status, answers, submitted_at)
      VALUES
        (${user.id}, ${d.cycleId}, ${me?.organizationId ?? null}, 'submitted',
         ${JSON.stringify({ summary: d.summary, objective: d.objective })}::jsonb, now())`;

    await recordAudit(
      { actor: { kind: "system", id: user.id, email: user.email },
        action: "program.apply", resourceType: "program_application", metadata: { cycleId: d.cycleId } },
      tx,
    );
    await emitTimelineEvent(tx, {
      userId: user.id,
      type: "application.submitted",
      title: `Applied to ${cycle.name}`,
      body: `Your application to “${cycle.label}” was submitted.`,
    });
    await emitNotification(tx, {
      userId: user.id,
      type: "application.submitted",
      title: "Application submitted",
      body: `We received your application to ${cycle.name} (${cycle.label}).`,
      link: "/account/programs",
    });
    return { ok: true };
  });
}

// ── Member: withdraw ──────────────────────────────────────────────────────────

export async function withdrawApplication(applicationId: string): Promise<Result> {
  const user = await requireUser();
  if (!UUID_RE.test(applicationId)) return { ok: false, error: "Application not found." };

  return withUserContext(user.id, async (tx) => {
    const [app] = await tx<{ status: ApplicationStatus; name: string }[]>`
      SELECT a.status, p.name
      FROM program_application a
      JOIN program_cycle c ON c.id = a.cycle_id
      JOIN program p ON p.id = c.program_id
      WHERE a.id = ${applicationId} AND a.user_id = ${user.id}
      FOR UPDATE OF a`;
    if (!app) return { ok: false, error: "Application not found." };
    if (!WITHDRAWABLE.includes(app.status)) {
      return { ok: false, error: `You can't withdraw an application that is ${app.status}.` };
    }
    await tx`
      UPDATE program_application SET status = 'withdrawn', updated_at = now()
      WHERE id = ${applicationId}`;
    await recordAudit(
      { actor: { kind: "system", id: user.id, email: user.email },
        action: "program.withdraw", resourceType: "program_application", resourceId: applicationId },
      tx,
    );
    await emitTimelineEvent(tx, {
      userId: user.id, type: "application.withdrawn",
      title: `Withdrew from ${app.name}`, body: null,
    });
    return { ok: true };
  });
}

// ── Admin: cycles ─────────────────────────────────────────────────────────────

export interface AdminCycle {
  id: string;
  programId: string;
  programName: string;
  label: string;
  status: CycleStatus;
  opensAt: string | null;
  closesAt: string | null;
  applicationCount: number;
}

export async function listCyclesAdmin(): Promise<AdminCycle[]> {
  const admin = await requireAdmin();
  assertCan(admin, "program:manage");
  return withAdminContext(admin, async (tx) => {
    const rows = await tx<
      {
        id: string; programId: string; programName: string; label: string;
        status: CycleStatus; opensAt: Date | null; closesAt: Date | null; applicationCount: number;
      }[]
    >`
      SELECT c.id, c.program_id AS "programId", p.name AS "programName", c.label, c.status,
             c.opens_at AS "opensAt", c.closes_at AS "closesAt",
             count(a.id)::int AS "applicationCount"
      FROM program_cycle c
      JOIN program p ON p.id = c.program_id
      LEFT JOIN program_application a ON a.cycle_id = c.id
      GROUP BY c.id, p.name
      ORDER BY c.created_at DESC`;
    return rows.map((r) => ({
      ...r,
      opensAt: r.opensAt ? r.opensAt.toISOString() : null,
      closesAt: r.closesAt ? r.closesAt.toISOString() : null,
    }));
  });
}

export interface ProgramOption { id: string; name: string }
export async function listProgramOptions(): Promise<ProgramOption[]> {
  const admin = await requireAdmin();
  assertCan(admin, "program:manage");
  return withAdminContext(admin, (tx) =>
    tx<ProgramOption[]>`SELECT id, name FROM program WHERE is_active ORDER BY name`,
  );
}

export async function createCycle(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  assertCan(admin, "program:manage");
  const parsed = createCycleSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Program and a label (min 3 chars) are required." };
  const d = parsed.data;
  const opensAt = d.opensAt && !Number.isNaN(Date.parse(d.opensAt)) ? d.opensAt : null;
  const closesAt = d.closesAt && !Number.isNaN(Date.parse(d.closesAt)) ? d.closesAt : null;

  return withAdminContext(admin, async (tx) => {
    const [prog] = await tx`SELECT 1 FROM program WHERE id = ${d.programId}`;
    if (!prog) return { ok: false, error: "Program not found." };
    await tx`
      INSERT INTO program_cycle (program_id, label, opens_at, closes_at, status)
      VALUES (${d.programId}, ${d.label}, ${opensAt}, ${closesAt}, 'open')`;
    await recordAudit(
      { actor: admin, action: "program.create_cycle", resourceType: "program_cycle",
        metadata: { programId: d.programId, label: d.label } },
      tx,
    );
    return { ok: true };
  });
}

export async function setCycleStatus(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  assertCan(admin, "program:manage");
  const parsed = cycleStatusSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid request." };
  const { cycleId, status } = parsed.data;
  return withAdminContext(admin, async (tx) => {
    const [c] = await tx`SELECT 1 FROM program_cycle WHERE id = ${cycleId} FOR UPDATE`;
    if (!c) return { ok: false, error: "Cycle not found." };
    await tx`UPDATE program_cycle SET status = ${status} WHERE id = ${cycleId}`;
    await recordAudit(
      { actor: admin, action: "program.set_cycle_status", resourceType: "program_cycle",
        resourceId: cycleId, metadata: { status } },
      tx,
    );
    return { ok: true };
  });
}

// ── Admin: applications ───────────────────────────────────────────────────────

export interface AdminApplication {
  id: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  registrantType: string | null;
  district: string | null;
  programId: string;
  programName: string;
  cycleId: string;
  cycleLabel: string;
  status: ApplicationStatus;
  answers: { summary?: string; objective?: string };
  submittedAt: string | null;
  decisionNote: string | null;
}

/**
 * The driver can hand `answers` jsonb back unparsed (a JSON string) — normalize
 * to the object shape the UI renders. Tolerates bad data with an empty object.
 */
function parseAnswers(a: unknown): { summary?: string; objective?: string } {
  if (typeof a === "string") {
    try {
      return JSON.parse(a) as { summary?: string; objective?: string };
    } catch {
      return {};
    }
  }
  return (a ?? {}) as { summary?: string; objective?: string };
}

export interface ApplicationFilters {
  status?: ApplicationStatus;
  cycleId?: string;
  programId?: string;
  userId?: string;
  /** Applicant name/email search. */
  q?: string;
  limit?: number;
  offset?: number;
}

export async function listApplications(
  filters?: ApplicationFilters,
): Promise<{ rows: AdminApplication[]; total: number }> {
  const admin = await requireAdmin();
  assertCan(admin, "program:manage");
  const q = filters?.q ? `%${filters.q.replace(/[\\%_]/g, (c) => `\\${c}`)}%` : null;
  const limit = Math.min(Math.max(filters?.limit ?? 50, 1), 200);
  const offset = Math.max(filters?.offset ?? 0, 0);

  return withAdminContext(admin, async (tx) => {
    const rows = await tx<
      (Omit<AdminApplication, "submittedAt"> & { submittedAt: Date | null; total: number })[]
    >`
      SELECT a.id, a.user_id AS "userId", u.full_name AS "applicantName",
             u.email AS "applicantEmail", u.registrant_type::text AS "registrantType",
             u.district, p.id AS "programId", p.name AS "programName",
             c.id AS "cycleId", c.label AS "cycleLabel", a.status, a.answers,
             a.submitted_at AS "submittedAt", a.decision_note AS "decisionNote",
             count(*) OVER ()::int AS total
      FROM program_application a
      JOIN app_user u ON u.id = a.user_id
      JOIN program_cycle c ON c.id = a.cycle_id
      JOIN program p ON p.id = c.program_id
      WHERE TRUE
        ${filters?.status ? tx`AND a.status = ${filters.status}` : tx``}
        ${filters?.cycleId && UUID_RE.test(filters.cycleId) ? tx`AND a.cycle_id = ${filters.cycleId}` : tx``}
        ${filters?.programId && UUID_RE.test(filters.programId) ? tx`AND p.id = ${filters.programId}` : tx``}
        ${filters?.userId && UUID_RE.test(filters.userId) ? tx`AND a.user_id = ${filters.userId}` : tx``}
        ${q ? tx`AND (u.full_name ILIKE ${q} OR u.email ILIKE ${q})` : tx``}
      ORDER BY a.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`;
    await recordAudit(
      { actor: admin, action: "program.list_applications", resourceType: "program_application",
        metadata: { count: rows.length } },
      tx,
    );
    const total = rows[0]?.total ?? 0;
    return {
      rows: rows.map(({ total: _t, ...r }) => ({
        ...r,
        answers: parseAnswers(r.answers),
        submittedAt: r.submittedAt ? r.submittedAt.toISOString() : null,
      })),
      total,
    };
  });
}

/**
 * "Who registered for what" at a glance: application counts by status and by
 * program. Pure aggregates (no PII), so — like the dashboard — not audited.
 */
export interface ApplicationStats {
  total: number;
  byStatus: Partial<Record<ApplicationStatus, number>>;
  byProgram: { programId: string; programName: string; total: number; pending: number }[];
}

export async function getApplicationStats(): Promise<ApplicationStats> {
  const admin = await requireAdmin();
  assertCan(admin, "program:manage");
  return withAdminContext(admin, async (tx) => {
    const statusRows = await tx<{ status: ApplicationStatus; count: number }[]>`
      SELECT status, count(*)::int AS count
      FROM program_application GROUP BY status`;
    const programRows = await tx<
      { programId: string; programName: string; total: number; pending: number }[]
    >`
      SELECT p.id AS "programId", p.name AS "programName",
             count(a.id)::int AS total,
             count(a.id) FILTER (WHERE a.status IN ('submitted', 'under_review', 'shortlisted'))::int AS pending
      FROM program_application a
      JOIN program_cycle c ON c.id = a.cycle_id
      JOIN program p ON p.id = c.program_id
      GROUP BY p.id, p.name
      ORDER BY count(a.id) DESC, p.name`;

    const byStatus: Partial<Record<ApplicationStatus, number>> = {};
    let total = 0;
    for (const r of statusRows) {
      byStatus[r.status] = r.count;
      total += r.count;
    }
    return { total, byStatus, byProgram: programRows };
  });
}

export interface AdminApplicationDetail extends AdminApplication {
  organizationName: string | null;
  reviewedAt: string | null;
  reviewedByName: string | null;
  createdAt: string;
}

export async function getApplicationDetail(id: string): Promise<AdminApplicationDetail | null> {
  const admin = await requireAdmin();
  assertCan(admin, "program:manage");
  if (!UUID_RE.test(id)) return null;

  return withAdminContext(admin, async (tx) => {
    const [row] = await tx<
      (Omit<AdminApplicationDetail, "submittedAt" | "reviewedAt" | "createdAt"> & {
        submittedAt: Date | null; reviewedAt: Date | null; createdAt: Date;
      })[]
    >`
      SELECT a.id, a.user_id AS "userId", u.full_name AS "applicantName",
             u.email AS "applicantEmail", u.registrant_type::text AS "registrantType",
             u.district, p.id AS "programId", p.name AS "programName",
             c.id AS "cycleId", c.label AS "cycleLabel", a.status, a.answers,
             a.submitted_at AS "submittedAt", a.decision_note AS "decisionNote",
             o.name AS "organizationName", a.reviewed_at AS "reviewedAt",
             r.name AS "reviewedByName", a.created_at AS "createdAt"
      FROM program_application a
      JOIN app_user u ON u.id = a.user_id
      JOIN program_cycle c ON c.id = a.cycle_id
      JOIN program p ON p.id = c.program_id
      LEFT JOIN organization o ON o.id = a.organization_id
      LEFT JOIN admin_user r ON r.id = a.reviewed_by
      WHERE a.id = ${id}`;
    if (!row) return null;

    await recordAudit(
      { actor: admin, action: "program.view_application", resourceType: "program_application",
        resourceId: id },
      tx,
    );
    return {
      ...row,
      answers: parseAnswers(row.answers),
      submittedAt: row.submittedAt ? row.submittedAt.toISOString() : null,
      reviewedAt: row.reviewedAt ? row.reviewedAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
    };
  });
}

/**
 * A user's applications for the admin user-detail page ("what did this person
 * register for"). The page's getUserDetail call already audits `user.view` —
 * a second audit line for the same view would be noise, so none here.
 */
export interface UserApplication {
  id: string;
  programName: string;
  cycleLabel: string;
  status: ApplicationStatus;
  submittedAt: string | null;
  decisionNote: string | null;
}

export async function listUserApplications(userId: string): Promise<UserApplication[]> {
  const admin = await requireAdmin();
  assertCan(admin, "program:manage");
  if (!UUID_RE.test(userId)) return [];

  return withAdminContext(admin, async (tx) => {
    const rows = await tx<
      (Omit<UserApplication, "submittedAt"> & { submittedAt: Date | null })[]
    >`
      SELECT a.id, p.name AS "programName", c.label AS "cycleLabel", a.status,
             a.submitted_at AS "submittedAt", a.decision_note AS "decisionNote"
      FROM program_application a
      JOIN program_cycle c ON c.id = a.cycle_id
      JOIN program p ON p.id = c.program_id
      WHERE a.user_id = ${userId}
      ORDER BY a.created_at DESC`;
    return rows.map((r) => ({
      ...r,
      submittedAt: r.submittedAt ? r.submittedAt.toISOString() : null,
    }));
  });
}

export async function reviewApplication(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  assertCan(admin, "program:manage");
  const parsed = reviewApplicationSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Pick a valid decision." };
  const { applicationId, status, note } = parsed.data;

  return withAdminContext(admin, async (tx) => {
    const [app] = await tx<{ userId: string; status: ApplicationStatus; programName: string }[]>`
      SELECT a.user_id AS "userId", a.status, p.name AS "programName"
      FROM program_application a
      JOIN program_cycle c ON c.id = a.cycle_id
      JOIN program p ON p.id = c.program_id
      WHERE a.id = ${applicationId}
      FOR UPDATE OF a`;
    if (!app) return { ok: false, error: "Application not found." };
    if (app.status === "withdrawn") return { ok: false, error: "That application was withdrawn." };

    await tx`
      UPDATE program_application
      SET status = ${status}, decision_note = ${note || null},
          reviewed_by = ${admin.id}, reviewed_at = now(), updated_at = now()
      WHERE id = ${applicationId}`;
    await recordAudit(
      { actor: admin, action: "program.review", resourceType: "program_application",
        resourceId: applicationId, metadata: { status } },
      tx,
    );
    await emitTimelineEvent(tx, {
      userId: app.userId,
      type: "application.status_changed",
      title: `${app.programName} application updated`,
      body: `Status: ${status.replace("_", " ")}.${note ? ` ${note}` : ""}`,
    });
    await emitNotification(tx, {
      userId: app.userId,
      type: "application.status_changed",
      title: `${app.programName}: ${status.replace("_", " ")}`,
      body: note || `Your application status changed to ${status.replace("_", " ")}.`,
      link: "/account/programs",
    });
    return { ok: true };
  });
}
