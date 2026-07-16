import "server-only";
import { requireAdmin } from "@/lib/auth/session";
import { assertCan } from "@/lib/auth/rbac";
import { withAdminContext } from "@/lib/db/client";
import { verifyAuditChain } from "@/lib/audit/log";

/**
 * Admin-facing read side of the tamper-evident audit trail.
 *
 * Authorization boundary: requireAdmin → assertCan("audit:read") →
 * withAdminContext (RLS's `audit_read` policy independently re-checks the role
 * GUC is super_admin/auditor). Reads are deliberately NOT themselves audited —
 * paginating the log would otherwise flood the very trail being inspected; only
 * mutations are worth recording.
 *
 * The chain is written and verified in-database (see lib/audit/log.ts and
 * db/migrations/0002). This module never recomputes hashes app-side.
 */

export interface AuditRow {
  seq: number;
  actorId: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadata: Record<string, unknown>;
  ip: string | null;
  at: string;
}

export interface AuditFilters {
  action?: string;
  resourceType?: string;
  actorEmail?: string;
  /** yyyy-mm-dd (inclusive). */
  from?: string;
  /** yyyy-mm-dd (inclusive). */
  to?: string;
  limit?: number;
  offset?: number;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function listAuditLog(
  filters: AuditFilters = {},
): Promise<{ rows: AuditRow[]; total: number }> {
  const viewer = await requireAdmin();
  assertCan(viewer, "audit:read");

  const limit = Math.min(Math.max(filters.limit ?? 50, 1), 10000);
  const offset = Math.max(filters.offset ?? 0, 0);
  const action = filters.action?.trim() || null;
  const resourceType = filters.resourceType?.trim() || null;
  const actorEmail = filters.actorEmail
    ? `%${filters.actorEmail.replace(/[\\%_]/g, (c) => `\\${c}`)}%`
    : null;
  const from = filters.from && DATE_RE.test(filters.from) ? filters.from : null;
  const to = filters.to && DATE_RE.test(filters.to) ? filters.to : null;

  return withAdminContext(viewer, async (tx) => {
    const where = tx`
      WHERE TRUE
        ${action ? tx`AND action = ${action}` : tx``}
        ${resourceType ? tx`AND resource_type = ${resourceType}` : tx``}
        ${actorEmail ? tx`AND actor_email ILIKE ${actorEmail}` : tx``}
        ${from ? tx`AND at >= ${from}::date` : tx``}
        ${to ? tx`AND at < (${to}::date + 1)` : tx``}
    `;

    const rows = await tx<
      (Omit<AuditRow, "at"> & { at: Date })[]
    >`
      SELECT seq, actor_id AS "actorId", actor_email AS "actorEmail", action,
             resource_type AS "resourceType", resource_id AS "resourceId",
             metadata, host(ip) AS ip, at
      FROM audit_log
      ${where}
      ORDER BY seq DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [{ total }] = await tx<{ total: number }[]>`
      SELECT count(*)::int AS total FROM audit_log ${where}
    `;

    return {
      rows: rows.map((r) => ({ ...r, at: r.at.toISOString() })),
      total,
    };
  });
}

/** Distinct action + resource_type values, for the filter dropdowns. */
export async function listAuditFacets(): Promise<{
  actions: string[];
  resourceTypes: string[];
}> {
  const viewer = await requireAdmin();
  assertCan(viewer, "audit:read");

  return withAdminContext(viewer, async (tx) => {
    const actions = await tx<{ action: string }[]>`
      SELECT DISTINCT action FROM audit_log ORDER BY action
    `;
    const resourceTypes = await tx<{ resourceType: string }[]>`
      SELECT DISTINCT resource_type AS "resourceType" FROM audit_log
      ORDER BY resource_type
    `;
    return {
      actions: actions.map((r) => r.action),
      resourceTypes: resourceTypes.map((r) => r.resourceType),
    };
  });
}

/**
 * Re-run the in-database chain verification. Gated on audit:read so only
 * oversight roles can trigger it. `verifyAuditChain` calls a SECURITY DEFINER
 * function, so it works regardless of the RLS row policy.
 */
export async function checkAuditIntegrity(): Promise<{
  ok: boolean;
  brokenAtSeq?: number;
}> {
  const viewer = await requireAdmin();
  assertCan(viewer, "audit:read");
  return verifyAuditChain();
}
