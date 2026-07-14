import "server-only";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { assertCan } from "@/lib/auth/rbac";
import { requireUser } from "@/lib/auth/user-session";
import { withAdminContext, withUserContext } from "@/lib/db/client";
import { recordAudit } from "@/lib/audit/log";
import { emitTimelineEvent, emitNotification } from "@/lib/dal/events";
import { assignMentorSchema, logSessionSchema } from "@/lib/validation/mentorship";
import { allocateCertificateSerial } from "@/lib/mentorship/certificate";
import { CERTIFICATE_THRESHOLD_MINUTES } from "@/lib/mentorship/types";
import type { MentorshipMode, MentorshipStatus } from "@/lib/mentorship/types";

/**
 * Mentorship DAL. Admins pair mentors↔mentees; mentors log sessions against
 * their active assignments. Crossing 5 logged hours auto-issues the mentor
 * certificate (inside the same transaction as the session that crosses it).
 */

type FieldErrors = Record<string, string[]>;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ── Member view ───────────────────────────────────────────────────────────────

export interface SessionItem {
  id: string;
  occurredAt: string;
  durationMinutes: number;
  mode: MentorshipMode;
  notes: string | null;
}
export interface MentorAssignmentView {
  assignmentId: string;
  menteeName: string;
  status: MentorshipStatus;
  sessions: SessionItem[];
}
export interface MenteeAssignmentView {
  assignmentId: string;
  mentorName: string;
  status: MentorshipStatus;
  sessions: SessionItem[];
}
export interface MyMentorship {
  asMentor: MentorAssignmentView[];
  asMentee: MenteeAssignmentView[];
  totalMinutesAsMentor: number;
  certificate: { serial: string; totalMinutes: number; issuedAt: string } | null;
  thresholdMinutes: number;
}

export async function getMyMentorship(): Promise<MyMentorship> {
  const user = await requireUser();
  return withUserContext(user.id, async (tx) => {
    const assignments = await tx<
      {
        id: string; mentorId: string; menteeId: string; status: MentorshipStatus;
        mentorName: string; menteeName: string;
      }[]
    >`
      SELECT a.id, a.mentor_id AS "mentorId", a.mentee_id AS "menteeId", a.status,
             m.full_name AS "mentorName", e.full_name AS "menteeName"
      FROM mentorship_assignment a
      JOIN app_user m ON m.id = a.mentor_id
      JOIN app_user e ON e.id = a.mentee_id
      WHERE a.mentor_id = ${user.id} OR a.mentee_id = ${user.id}
      ORDER BY a.created_at DESC`;

    const sessions = assignments.length
      ? await tx<
          { id: string; assignmentId: string; occurredAt: Date; durationMinutes: number; mode: MentorshipMode; notes: string | null }[]
        >`
          SELECT id, assignment_id AS "assignmentId", occurred_at AS "occurredAt",
                 duration_minutes AS "durationMinutes", mode, notes
          FROM mentorship_session
          WHERE assignment_id IN ${tx(assignments.map((a) => a.id))}
          ORDER BY occurred_at DESC`
      : [];

    const [cert] = await tx<{ serial: string; totalMinutes: number; issuedAt: Date }[]>`
      SELECT serial, total_minutes AS "totalMinutes", issued_at AS "issuedAt"
      FROM mentor_certificate WHERE mentor_id = ${user.id}`;

    const sessionsFor = (assignmentId: string): SessionItem[] =>
      sessions
        .filter((s) => s.assignmentId === assignmentId)
        .map((s) => ({
          id: s.id,
          occurredAt: s.occurredAt.toISOString(),
          durationMinutes: s.durationMinutes,
          mode: s.mode,
          notes: s.notes,
        }));

    const asMentor = assignments
      .filter((a) => a.mentorId === user.id)
      .map((a) => ({ assignmentId: a.id, menteeName: a.menteeName, status: a.status, sessions: sessionsFor(a.id) }));
    const asMentee = assignments
      .filter((a) => a.menteeId === user.id)
      .map((a) => ({ assignmentId: a.id, mentorName: a.mentorName, status: a.status, sessions: sessionsFor(a.id) }));

    const totalMinutesAsMentor = asMentor
      .flatMap((a) => a.sessions)
      .reduce((sum, s) => sum + s.durationMinutes, 0);

    return {
      asMentor,
      asMentee,
      totalMinutesAsMentor,
      certificate: cert
        ? { serial: cert.serial, totalMinutes: cert.totalMinutes, issuedAt: cert.issuedAt.toISOString() }
        : null,
      thresholdMinutes: CERTIFICATE_THRESHOLD_MINUTES,
    };
  });
}

// ── Member: log a session ─────────────────────────────────────────────────────

export type LogResult =
  | { ok: true; certificateIssued: boolean; serial?: string }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

export async function logSession(raw: unknown): Promise<LogResult> {
  const user = await requireUser();
  const parsed = logSessionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the form.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as FieldErrors,
    };
  }
  const d = parsed.data;
  const occurredAt = d.occurredAt && !Number.isNaN(Date.parse(d.occurredAt)) ? d.occurredAt : null;

  return withUserContext(user.id, async (tx) => {
    // The assignment must be mine (as mentor) and active.
    const [a] = await tx<{ id: string; menteeName: string }[]>`
      SELECT a.id, e.full_name AS "menteeName"
      FROM mentorship_assignment a
      JOIN app_user e ON e.id = a.mentee_id
      WHERE a.id = ${d.assignmentId} AND a.mentor_id = ${user.id} AND a.status = 'active'`;
    if (!a) return { ok: false, error: "Active assignment not found." };

    await tx`
      INSERT INTO mentorship_session
        (assignment_id, occurred_at, duration_minutes, mode, notes, logged_by)
      VALUES
        (${d.assignmentId}, coalesce(${occurredAt}::timestamptz, now()), ${d.durationMinutes},
         ${d.mode}, ${d.notes || null}, ${user.id})`;

    await emitTimelineEvent(tx, {
      userId: user.id,
      type: "mentorship.session_logged",
      title: "Mentorship session logged",
      body: `${d.durationMinutes} min with ${a.menteeName}.`,
    });
    await recordAudit(
      { actor: { kind: "system", id: user.id, email: user.email },
        action: "mentorship.log_session", resourceType: "mentorship_session",
        metadata: { assignmentId: d.assignmentId, durationMinutes: d.durationMinutes } },
      tx,
    );

    // Total logged minutes across all of this mentor's assignments.
    const [{ total }] = await tx<{ total: number }[]>`
      SELECT coalesce(sum(s.duration_minutes), 0)::int AS total
      FROM mentorship_session s
      JOIN mentorship_assignment a2 ON a2.id = s.assignment_id
      WHERE a2.mentor_id = ${user.id}`;

    // Auto-issue the certificate the first time they cross the threshold.
    if (total >= CERTIFICATE_THRESHOLD_MINUTES) {
      const [existing] = await tx`SELECT 1 FROM mentor_certificate WHERE mentor_id = ${user.id}`;
      if (!existing) {
        const year = Number(new Date().toISOString().slice(0, 4));
        const serial = await allocateCertificateSerial(tx, year);
        await tx`
          INSERT INTO mentor_certificate (mentor_id, total_minutes, serial)
          VALUES (${user.id}, ${total}, ${serial})`;
        await emitTimelineEvent(tx, {
          userId: user.id,
          type: "mentorship.certificate_issued",
          title: "Mentorship certificate earned",
          body: `You've logged 5+ hours of mentorship. Certificate ${serial} issued.`,
          metadata: { serial },
        });
        await emitNotification(tx, {
          userId: user.id,
          type: "mentorship.certificate_issued",
          title: "You earned your mentorship certificate",
          body: `Certificate ${serial} for 5+ hours of mentorship is available in your account.`,
          link: "/account/mentorship",
        });
        return { ok: true, certificateIssued: true, serial };
      }
    }
    return { ok: true, certificateIssued: false };
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export interface AssignmentRow {
  id: string;
  mentorName: string;
  menteeName: string;
  status: MentorshipStatus;
  totalMinutes: number;
  sessionCount: number;
  startedAt: string;
}

export async function listAssignments(): Promise<AssignmentRow[]> {
  const admin = await requireAdmin();
  assertCan(admin, "mentorship:manage");
  return withAdminContext(admin, async (tx) => {
    const rows = await tx<
      (Omit<AssignmentRow, "startedAt"> & { startedAt: Date })[]
    >`
      SELECT a.id, m.full_name AS "mentorName", e.full_name AS "menteeName", a.status,
             coalesce(sum(s.duration_minutes), 0)::int AS "totalMinutes",
             count(s.id)::int AS "sessionCount", a.started_at AS "startedAt"
      FROM mentorship_assignment a
      JOIN app_user m ON m.id = a.mentor_id
      JOIN app_user e ON e.id = a.mentee_id
      LEFT JOIN mentorship_session s ON s.assignment_id = a.id
      GROUP BY a.id, m.full_name, e.full_name
      ORDER BY a.created_at DESC`;
    return rows.map((r) => ({ ...r, startedAt: r.startedAt.toISOString() }));
  });
}

export interface PersonOption { id: string; name: string }

export async function listMentorMenteeOptions(): Promise<{ mentors: PersonOption[]; mentees: PersonOption[] }> {
  const admin = await requireAdmin();
  assertCan(admin, "mentorship:manage");
  return withAdminContext(admin, async (tx) => {
    const mentors = await tx<PersonOption[]>`
      SELECT id, full_name AS name FROM app_user
      WHERE persona = 'mentor' AND status = 'active' ORDER BY full_name`;
    const mentees = await tx<PersonOption[]>`
      SELECT id, full_name AS name FROM app_user
      WHERE persona = 'entrepreneur' AND status = 'active' ORDER BY full_name`;
    return { mentors, mentees };
  });
}

export async function assignMentor(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  assertCan(admin, "mentorship:manage");
  const parsed = assignMentorSchema.safeParse(raw);
  if (!parsed.success) {
    const first = z.flattenError(parsed.error).fieldErrors;
    return { ok: false, error: Object.values(first)[0]?.[0] ?? "Invalid selection." };
  }
  const { mentorId, menteeId } = parsed.data;

  return withAdminContext(admin, async (tx) => {
    const [mentor] = await tx<{ persona: string; fullName: string }[]>`
      SELECT persona, full_name AS "fullName" FROM app_user WHERE id = ${mentorId}`;
    const [mentee] = await tx<{ fullName: string }[]>`
      SELECT full_name AS "fullName" FROM app_user WHERE id = ${menteeId}`;
    if (!mentor || !mentee) return { ok: false, error: "Mentor or mentee not found." };
    if (mentor.persona !== "mentor") return { ok: false, error: "The mentor must be a registered mentor." };

    const [active] = await tx`
      SELECT 1 FROM mentorship_assignment WHERE mentee_id = ${menteeId} AND status = 'active'`;
    if (active) return { ok: false, error: "That mentee already has an active mentor." };

    await tx`
      INSERT INTO mentorship_assignment (mentor_id, mentee_id, assigned_by, status)
      VALUES (${mentorId}, ${menteeId}, ${admin.id}, 'active')`;
    await recordAudit(
      { actor: admin, action: "mentorship.assign", resourceType: "mentorship_assignment",
        metadata: { mentorId, menteeId } },
      tx,
    );
    // Notify both parties.
    await emitTimelineEvent(tx, {
      userId: mentorId, type: "mentorship.assigned",
      title: "New mentee assigned", body: `You are now mentoring ${mentee.fullName}.`,
    });
    await emitNotification(tx, {
      userId: mentorId, type: "mentorship.assigned", title: "New mentee assigned",
      body: `You are now mentoring ${mentee.fullName}. Log sessions from your account.`,
      link: "/account/mentorship",
    });
    await emitTimelineEvent(tx, {
      userId: menteeId, type: "mentorship.assigned",
      title: "Mentor assigned", body: `${mentor.fullName} is now your PRIME mentor.`,
    });
    await emitNotification(tx, {
      userId: menteeId, type: "mentorship.assigned", title: "You have a mentor",
      body: `${mentor.fullName} is now your PRIME mentor.`, link: "/account/mentorship",
    });
    return { ok: true };
  });
}

export async function endAssignment(assignmentId: string): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  assertCan(admin, "mentorship:manage");
  if (!UUID_RE.test(assignmentId)) return { ok: false, error: "Assignment not found." };
  return withAdminContext(admin, async (tx) => {
    const [a] = await tx<{ status: MentorshipStatus }[]>`
      SELECT status FROM mentorship_assignment WHERE id = ${assignmentId} FOR UPDATE`;
    if (!a) return { ok: false, error: "Assignment not found." };
    if (a.status === "ended") return { ok: false, error: "Already ended." };
    await tx`
      UPDATE mentorship_assignment SET status = 'ended', ended_at = now()
      WHERE id = ${assignmentId}`;
    await recordAudit(
      { actor: admin, action: "mentorship.end", resourceType: "mentorship_assignment", resourceId: assignmentId },
      tx,
    );
    return { ok: true };
  });
}
