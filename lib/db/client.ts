import "server-only";
import postgres from "postgres";
import type { AdminUser } from "@/lib/auth/rbac";

/**
 * The single Postgres entry point for the app. Only the DAL (lib/dal/*) may
 * import this — that module boundary is what makes the DAL the authorization
 * boundary.
 *
 * Connects as `prime_app` (least-privilege, non-owner) so Row-Level Security
 * actually applies. RLS policies read two per-transaction settings; the
 * with*Context helpers below are the ONLY sanctioned way to run queries:
 *
 *   withAdminContext(admin, fn)  — sets app.current_admin_id / _role from the
 *                                  SERVER-VERIFIED session, transaction-scoped
 *                                  (set_config(..., true) ≡ SET LOCAL, but
 *                                  parameterizable), then runs fn(tx).
 *   withPublicContext(fn)        — a transaction with NO admin GUCs: the
 *                                  unauthenticated intake / public read paths.
 *                                  Policies written for this context only ever
 *                                  allow narrowly-scoped writes (e.g. INSERT
 *                                  status='submitted').
 *
 * Queries outside a context helper see no GUCs and RLS fails closed.
 */

/** Either the root client or a transaction handle — what DAL helpers accept. */
export type Db = postgres.Sql | postgres.TransactionSql;

// Survive Next dev HMR without leaking connection pools.
const globalForDb = globalThis as unknown as { __primeSql?: postgres.Sql };

export function getSql(): postgres.Sql {
  if (!globalForDb.__primeSql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Add it to .env.local (see .env.example).",
      );
    }
    globalForDb.__primeSql = postgres(url, {
      max: 10,
      idle_timeout: 30,
      connect_timeout: 10,
      onnotice: () => {},
    });
  }
  return globalForDb.__primeSql;
}

/**
 * Module-lifetime object used as the anchor for React taint APIs (values must
 * be tainted against something that outlives them).
 */
export const dbLifetime: Record<string, never> = {};

export async function withAdminContext<T>(
  admin: AdminUser,
  fn: (tx: postgres.TransactionSql) => Promise<T>,
): Promise<T> {
  const sql = getSql();
  const result = await sql.begin(async (tx) => {
    await tx`SELECT set_config('app.current_admin_id', ${admin.id}, true),
                    set_config('app.current_admin_role', ${admin.role}, true)`;
    return await fn(tx);
  });
  return result as T;
}

export async function withPublicContext<T>(
  fn: (tx: postgres.TransactionSql) => Promise<T>,
): Promise<T> {
  const sql = getSql();
  const result = await sql.begin(async (tx) => await fn(tx));
  return result as T;
}

/**
 * Context for an authenticated PUBLIC user (entrepreneur / mentor / investor).
 * Sets app.current_user_id so RLS scopes rows to the caller (own profile, own
 * org, own PRIME ID request, etc.). Used by the member-facing DALs.
 */
export async function withUserContext<T>(
  userId: string,
  fn: (tx: postgres.TransactionSql) => Promise<T>,
): Promise<T> {
  const sql = getSql();
  const result = await sql.begin(async (tx) => {
    await tx`SELECT set_config('app.current_user_id', ${userId}, true)`;
    return await fn(tx);
  });
  return result as T;
}

/**
 * Context for a deliberate pre-authentication operation (register / login /
 * verify-email / reset). Sets app.auth_op = '1' — the ONLY context in which
 * RLS lets a query touch the credential / session / email-token tables. Only
 * lib/dal/auth.ts and lib/auth/user-session.ts open this context.
 */
export async function withAuthContext<T>(
  fn: (tx: postgres.TransactionSql) => Promise<T>,
): Promise<T> {
  const sql = getSql();
  const result = await sql.begin(async (tx) => {
    await tx`SELECT set_config('app.auth_op', '1', true)`;
    return await fn(tx);
  });
  return result as T;
}

/**
 * Context for a deliberate ADMIN pre-auth / credential operation (admin login /
 * logout / session-verify / set-password). Sets app.admin_auth_op = '1' — the
 * admin counterpart to withAuthContext. It is the ONLY context in which RLS lets
 * a query touch the admin_credential / admin_session tables (0020). Only
 * lib/dal/admin-auth.ts and lib/auth/session.ts open this context; the console's
 * password writes use the super_admin context (withAdminContext) instead.
 */
export async function withAdminAuthContext<T>(
  fn: (tx: postgres.TransactionSql) => Promise<T>,
): Promise<T> {
  const sql = getSql();
  const result = await sql.begin(async (tx) => {
    await tx`SELECT set_config('app.admin_auth_op', '1', true)`;
    return await fn(tx);
  });
  return result as T;
}

/**
 * Context for a system/background operation with no human actor — the email
 * outbox worker and scheduled jobs. Sets app.system_op = '1', which RLS uses to
 * gate the email_outbox queue. Only lib/email opens this context.
 */
export async function withSystemContext<T>(
  fn: (tx: postgres.TransactionSql) => Promise<T>,
): Promise<T> {
  const sql = getSql();
  const result = await sql.begin(async (tx) => {
    await tx`SELECT set_config('app.system_op', '1', true)`;
    return await fn(tx);
  });
  return result as T;
}
