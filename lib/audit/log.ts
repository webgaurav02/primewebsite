import "server-only";
import { headers } from "next/headers";
import type { AdminUser } from "@/lib/auth/rbac";
import { getSql, type Db } from "@/lib/db/client";

/**
 * Who performed the action. Usually an authenticated AdminUser, but the public
 * grievance-intake path is unauthenticated, so it logs as a SYSTEM actor. Both
 * shapes expose `id` + `email`, which is all recordAudit needs.
 */
export type AuditActor =
  | AdminUser
  | { kind: "system"; id: string; email: string };

/** The anonymous actor used by the public (unauthenticated) write path. */
export const PUBLIC_SYSTEM_ACTOR = {
  kind: "system" as const,
  id: "public",
  email: "anonymous@public",
};

/**
 * Append-only, tamper-evident audit trail.
 *
 * Why hash-chaining: the dominant threat for a grievance system is an insider
 * altering or deleting records (and their own trail) to bury a complaint. Each
 * entry stores hash = SHA-256(prevHash + canonical(entry)); any edit/deletion
 * of a historical row breaks the chain for every row after it.
 *
 * The chain itself is computed IN THE DATABASE by the SECURITY DEFINER
 * functions record_audit() / verify_audit_chain() (db/migrations/0002):
 *   - audit_log has FORCE RLS and its SELECT policy is role-scoped, so the
 *     unauthenticated intake path could never read the previous hash to extend
 *     the chain app-side. The definer functions (owned by prime_audit) can.
 *   - Both write and verify share one canonicalization, in one place, so they
 *     cannot drift; appends serialize on an advisory lock so the chain never
 *     forks under concurrency.
 *   - prime_app has NO direct INSERT on audit_log — record_audit() is the only
 *     write path, and RLS grants no UPDATE/DELETE to anyone.
 *
 * Production hardening (docs/admin-security.md §Audit): retain ≥ 180 days
 * (CERT-In), ship a copy off-box, run verifyAuditChain() on a schedule.
 */

export interface AuditInput {
  actor: AuditActor;
  action: string; // e.g. "grievance.update_status"
  resourceType: string; // e.g. "grievance"
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Append an audit entry. Pass the surrounding transaction handle when auditing
 * a mutation so the entry commits (or rolls back) atomically with it.
 */
export async function recordAudit(input: AuditInput, db?: Db): Promise<void> {
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const sql = db ?? getSql();
  await sql`SELECT record_audit(
    ${input.actor.id},
    ${input.actor.email},
    ${input.action},
    ${input.resourceType},
    ${input.resourceId ?? null},
    ${JSON.stringify(input.metadata ?? {})}::jsonb,
    ${ip}
  )`;
}

/** Detect tampering: recompute the chain in-database and report the first break. */
export async function verifyAuditChain(
  db?: Db,
): Promise<{ ok: boolean; brokenAtSeq?: number }> {
  const sql = db ?? getSql();
  const [row] = await sql`SELECT ok, broken_at_seq FROM verify_audit_chain()`;
  const ok = Boolean(row?.ok);
  const broken = row?.broken_at_seq;
  return ok || broken == null
    ? { ok }
    : { ok, brokenAtSeq: Number(broken) };
}
