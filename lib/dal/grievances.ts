import "server-only";
// Exposed in the react-server layer because experimental.taint is on (next.config.ts).
import { experimental_taintObjectReference as taintObjectReference } from "react";
import { requireAdmin } from "@/lib/auth/session";
import {
  assertCan,
  assertRegion,
  can,
  type AdminUser,
  type Region,
} from "@/lib/auth/rbac";
import { recordAudit } from "@/lib/audit/log";
import { withAdminContext, withUserContext, getSql } from "@/lib/db/client";
import { requireUser } from "@/lib/auth/user-session";
import { decryptPII, blindIndex } from "@/lib/crypto/pii";
import { isAckOverdue, isResolveOverdue } from "@/lib/grievance/sla";
import { emitTimelineEvent, emitNotification } from "@/lib/dal/events";
import type { GrievanceStatus, GrievanceCategory } from "@/lib/grievance/types";
import {
  listFiltersSchema,
  updateStatusSchema,
  trackSchema,
  assignSchema,
  escalateSchema,
  type ListFilters,
  type UpdateStatusInput,
} from "@/lib/validation/grievance";

/**
 * Data Access Layer for grievances. This module is the authorization boundary.
 *
 * Every exported function:
 *   1. resolves the caller (requireAdmin) — authentication,
 *   2. checks permission + per-resource region scope — authorization (IDOR guard),
 *   3. runs its queries inside withAdminContext, which SET LOCALs the verified
 *      identity so Postgres RLS enforces the same scoping a second time,
 *   4. returns a minimal DTO (never the raw row) — complainant PII is stored
 *      encrypted and is only DECRYPTED for callers holding "grievance:read_pii";
 *      everyone else gets "[redacted]" without plaintext ever materializing, and
 *   5. records an audit entry for sensitive reads and all mutations, inside the
 *      same transaction as the mutation it describes.
 *
 * `import "server-only"` guarantees this never ends up in a client bundle.
 */

interface GrievanceDbRow {
  id: string;
  ticketRef: string;
  region: Region;
  category: GrievanceCategory;
  subject: string;
  description: string;
  status: GrievanceStatus;
  escalationLevel: number;
  userId: string | null;
  complainantNameEnc: Buffer;
  complainantEmailEnc: Buffer;
  complainantPhoneEnc: Buffer;
  assignedToId: string | null;
  slaAckDue: Date | null;
  slaResolveDue: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrievanceDTO {
  id: string;
  ticketRef: string;
  region: Region;
  category: GrievanceCategory;
  subject: string;
  description: string;
  status: GrievanceStatus;
  escalationLevel: number;
  assignedToId: string | null;
  slaAckDue: string | null;
  slaResolveDue: string | null;
  ackOverdue: boolean;
  resolveOverdue: boolean;
  createdAt: string;
  updatedAt: string;
  complainant: {
    name: string;
    email: string;
    phone: string;
    redacted: boolean;
  };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Escape LIKE wildcards in user-supplied search text. */
function escapeLike(q: string): string {
  return q.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/**
 * Shared SELECT list (static SQL, embedded via tx.unsafe — no user input).
 * Aliased to camelCase so rows map 1:1 onto GrievanceDbRow.
 */
const ROW_SELECT = `
  id,
  ticket_ref             AS "ticketRef",
  region,
  category,
  subject,
  description,
  status,
  escalation_level       AS "escalationLevel",
  user_id                AS "userId",
  complainant_name_enc   AS "complainantNameEnc",
  complainant_email_enc  AS "complainantEmailEnc",
  complainant_phone_enc  AS "complainantPhoneEnc",
  assigned_to            AS "assignedToId",
  sla_ack_due            AS "slaAckDue",
  sla_resolve_due        AS "slaResolveDue",
  created_at             AS "createdAt",
  updated_at             AS "updatedAt"
`;

function toDTO(row: GrievanceDbRow, viewer: AdminUser): GrievanceDTO {
  // Raw rows carry PII ciphertext — block them from ever crossing to the client.
  taintObjectReference?.(
    "Do not pass raw grievance rows to the client — return the DTO.",
    row,
  );

  const showPII = can(viewer, "grievance:read_pii");

  return {
    id: row.id,
    ticketRef: row.ticketRef,
    region: row.region,
    category: row.category,
    subject: row.subject,
    description: row.description,
    status: row.status,
    escalationLevel: row.escalationLevel,
    assignedToId: row.assignedToId,
    slaAckDue: row.slaAckDue ? row.slaAckDue.toISOString() : null,
    slaResolveDue: row.slaResolveDue ? row.slaResolveDue.toISOString() : null,
    ackOverdue: isAckOverdue(row.status, row.slaAckDue),
    resolveOverdue: isResolveOverdue(row.status, row.slaResolveDue),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    // Without the permission we never even decrypt — plaintext PII simply does
    // not exist in this process for unauthorized viewers.
    complainant: showPII
      ? {
          name: decryptPII(row.complainantNameEnc),
          email: decryptPII(row.complainantEmailEnc),
          phone: decryptPII(row.complainantPhoneEnc),
          redacted: false,
        }
      : {
          name: "[redacted]",
          email: "[redacted]",
          phone: "[redacted]",
          redacted: true,
        },
  };
}

export async function listGrievances(
  rawFilters: unknown,
): Promise<GrievanceDTO[]> {
  const viewer = await requireAdmin();
  assertCan(viewer, "grievance:read");

  const filters: ListFilters = listFiltersSchema.parse(rawFilters ?? {});
  const q = filters.q ? `%${escapeLike(filters.q)}%` : null;

  return withAdminContext(viewer, async (tx) => {
    // DAL-side region scoping; RLS enforces the same thing underneath.
    const rows = await tx<GrievanceDbRow[]>`
      SELECT ${tx.unsafe(ROW_SELECT)}
      FROM grievance
      WHERE TRUE
        ${viewer.regions === null ? tx`` : tx`AND region = ANY(${viewer.regions}::region[])`}
        ${filters.status ? tx`AND status = ${filters.status}` : tx``}
        ${filters.region ? tx`AND region = ${filters.region}` : tx``}
        ${q ? tx`AND (subject ILIKE ${q} OR ticket_ref ILIKE ${q})` : tx``}
      ORDER BY created_at DESC
    `;

    await recordAudit(
      {
        actor: viewer,
        action: "grievance.list",
        resourceType: "grievance",
        metadata: { count: rows.length, filters },
      },
      tx,
    );

    return rows.map((r) => toDTO(r, viewer));
  });
}

export async function getGrievance(id: string): Promise<GrievanceDTO | null> {
  const viewer = await requireAdmin();
  assertCan(viewer, "grievance:read");

  if (!UUID_RE.test(id)) return null;

  return withAdminContext(viewer, async (tx) => {
    const [row] = await tx<GrievanceDbRow[]>`
      SELECT ${tx.unsafe(ROW_SELECT)} FROM grievance WHERE id = ${id}
    `;
    if (!row) return null;

    // Per-resource authorization — prevents reading another region's complaint
    // by id (RLS would already have hidden it; keep the explicit check anyway).
    assertRegion(viewer, row.region);

    await recordAudit(
      {
        actor: viewer,
        action: "grievance.view",
        resourceType: "grievance",
        resourceId: row.id,
      },
      tx,
    );

    return toDTO(row, viewer);
  });
}

export async function updateGrievanceStatus(
  rawInput: unknown,
): Promise<GrievanceDTO> {
  const viewer = await requireAdmin();
  assertCan(viewer, "grievance:update_status");

  const input: UpdateStatusInput = updateStatusSchema.parse(rawInput);
  if (!UUID_RE.test(input.grievanceId)) throw new Error("Grievance not found");

  return withAdminContext(viewer, async (tx) => {
    const [row] = await tx<GrievanceDbRow[]>`
      SELECT ${tx.unsafe(ROW_SELECT)} FROM grievance
      WHERE id = ${input.grievanceId}
      FOR UPDATE
    `;
    if (!row) throw new Error("Grievance not found");
    assertRegion(viewer, row.region);

    const from = row.status;
    const [updated] = await tx<{ updatedAt: Date }[]>`
      UPDATE grievance
      SET status = ${input.status}, updated_at = now()
      WHERE id = ${input.grievanceId}
      RETURNING updated_at AS "updatedAt"
    `;

    // The history table is the trackable record of every transition.
    await tx`
      INSERT INTO grievance_status_history
        (grievance_id, from_status, to_status, note, changed_by)
      VALUES
        (${input.grievanceId}, ${from}, ${input.status},
         ${input.note ?? null}, ${viewer.id})
    `;

    await recordAudit(
      {
        actor: viewer,
        action: "grievance.update_status",
        resourceType: "grievance",
        resourceId: row.id,
        metadata: { from, to: input.status, note: input.note ?? null },
      },
      tx,
    );

    // Keep the linked complainant informed on their timeline + notifications.
    if (row.userId) {
      await emitTimelineEvent(tx, {
        userId: row.userId,
        type: "grievance.status_changed",
        title: `Grievance ${row.ticketRef} — ${input.status.replace("_", " ")}`,
        body: input.note ?? null,
        metadata: { ticketRef: row.ticketRef, to: input.status },
      });
      await emitNotification(tx, {
        userId: row.userId,
        type: "grievance.status_changed",
        title: `Update on grievance ${row.ticketRef}`,
        body: `Status changed to "${input.status.replace("_", " ")}".`,
        link: "/account/grievances",
      });
    }

    return toDTO(
      { ...row, status: input.status, updatedAt: updated.updatedAt },
      viewer,
    );
  });
}

// ── Assignment ────────────────────────────────────────────────────────────────

export interface AssignableAdmin {
  id: string;
  name: string;
  role: string;
}

/** Officers/admins who can be assigned a grievance in the given region. */
export async function listAssignableAdmins(region: Region): Promise<AssignableAdmin[]> {
  const viewer = await requireAdmin();
  assertCan(viewer, "grievance:assign");
  return withAdminContext(viewer, async (tx) => {
    return tx<AssignableAdmin[]>`
      SELECT DISTINCT a.id, a.name, a.role::text AS role
      FROM admin_user a
      LEFT JOIN admin_region ar ON ar.admin_id = a.id
      WHERE a.is_active
        AND a.role <> 'auditor'
        AND (a.role = 'super_admin' OR ar.region = ${region})
      ORDER BY a.name`;
  });
}

/** Flat list of assignment targets for the admin dropdown (all active officers). */
export async function listAssignmentTargets(): Promise<AssignableAdmin[]> {
  const viewer = await requireAdmin();
  assertCan(viewer, "grievance:assign");
  return withAdminContext(viewer, (tx) => tx<AssignableAdmin[]>`
    SELECT id, name, role::text AS role FROM admin_user
    WHERE is_active AND role <> 'auditor' ORDER BY name`);
}

export async function assignGrievance(rawInput: unknown): Promise<{ ok: boolean; error?: string }> {
  const viewer = await requireAdmin();
  assertCan(viewer, "grievance:assign");
  const parsed = assignSchema.safeParse(rawInput);
  if (!parsed.success) return { ok: false, error: "Invalid assignment." };
  const { grievanceId, assigneeId } = parsed.data;

  return withAdminContext(viewer, async (tx) => {
    const [g] = await tx<{ region: Region }[]>`
      SELECT region FROM grievance WHERE id = ${grievanceId} FOR UPDATE`;
    if (!g) return { ok: false, error: "Grievance not found" };
    assertRegion(viewer, g.region);

    // Assignee must be a real, active, non-auditor admin.
    const [assignee] = await tx`
      SELECT 1 FROM admin_user WHERE id = ${assigneeId} AND is_active AND role <> 'auditor'`;
    if (!assignee) return { ok: false, error: "Invalid assignee" };

    await tx`UPDATE grievance SET assigned_to = ${assigneeId}, updated_at = now() WHERE id = ${grievanceId}`;
    await recordAudit(
      { actor: viewer, action: "grievance.assign", resourceType: "grievance",
        resourceId: grievanceId, metadata: { assigneeId } },
      tx,
    );
    return { ok: true };
  });
}

// ── Escalation (L0 → L3) ──────────────────────────────────────────────────────

export async function escalateGrievance(rawInput: unknown): Promise<{ ok: boolean; error?: string; level?: number }> {
  const viewer = await requireAdmin();
  assertCan(viewer, "grievance:update_status");
  const parsed = escalateSchema.safeParse(rawInput);
  if (!parsed.success) return { ok: false, error: "Invalid request." };
  const { grievanceId } = parsed.data;

  return withAdminContext(viewer, async (tx) => {
    const [g] = await tx<{ region: Region; escalationLevel: number; userId: string | null; ticketRef: string }[]>`
      SELECT region, escalation_level AS "escalationLevel", user_id AS "userId", ticket_ref AS "ticketRef"
      FROM grievance WHERE id = ${grievanceId} FOR UPDATE`;
    if (!g) return { ok: false, error: "Grievance not found" };
    assertRegion(viewer, g.region);
    if (g.escalationLevel >= 3) return { ok: false, error: "Already at the highest level (L3)." };

    const level = g.escalationLevel + 1;
    await tx`UPDATE grievance SET escalation_level = ${level}, updated_at = now() WHERE id = ${grievanceId}`;
    await recordAudit(
      { actor: viewer, action: "grievance.escalate", resourceType: "grievance",
        resourceId: grievanceId, metadata: { level } },
      tx,
    );
    if (g.userId) {
      await emitTimelineEvent(tx, {
        userId: g.userId, type: "grievance.escalated",
        title: `Grievance ${g.ticketRef} escalated to L${level}`,
        metadata: { ticketRef: g.ticketRef, level },
      });
    }
    return { ok: true, level };
  });
}

// ── Member: my grievances ─────────────────────────────────────────────────────

export interface MyGrievance {
  ticketRef: string;
  subject: string;
  status: GrievanceStatus;
  category: GrievanceCategory;
  createdAt: string;
}

export async function getMyGrievances(): Promise<MyGrievance[]> {
  const user = await requireUser();
  return withUserContext(user.id, async (tx) => {
    const rows = await tx<
      { ticketRef: string; subject: string; status: GrievanceStatus; category: GrievanceCategory; createdAt: Date }[]
    >`
      SELECT ticket_ref AS "ticketRef", subject, status, category, created_at AS "createdAt"
      FROM grievance WHERE user_id = ${user.id}
      ORDER BY created_at DESC`;
    return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
  });
}

// ── Public: track by ticket ref + email (enumeration-safe) ────────────────────

export interface TrackResult {
  found: boolean;
  ticketRef?: string;
  status?: GrievanceStatus;
  category?: GrievanceCategory;
  escalationLevel?: number;
  createdAt?: string;
  updatedAt?: string;
  history?: { to: GrievanceStatus; at: string }[];
}

export async function trackGrievance(rawInput: unknown): Promise<TrackResult> {
  const parsed = trackSchema.safeParse(rawInput);
  if (!parsed.success) return { found: false };
  const { ref, email } = parsed.data;

  const [row] = await getSql()<
    {
      ticketRef: string; status: GrievanceStatus; category: GrievanceCategory;
      escalationLevel: number; createdAt: Date; updatedAt: Date;
      history: { to: GrievanceStatus; at: string }[];
    }[]
  >`
    SELECT ticket_ref AS "ticketRef", status, category,
           escalation_level AS "escalationLevel",
           created_at AS "createdAt", updated_at AS "updatedAt", history
    FROM grievance_track(${ref}, ${blindIndex(email)})`;

  if (!row) return { found: false };
  return {
    found: true,
    ticketRef: row.ticketRef,
    status: row.status,
    category: row.category,
    escalationLevel: row.escalationLevel,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    history: row.history,
  };
}
