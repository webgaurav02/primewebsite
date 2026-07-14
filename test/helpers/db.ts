import postgres from "postgres";

/**
 * Two connections to the test database:
 *   migratorSql — superuser/owner (RLS bypassed): used for fixtures, teardown,
 *                 and out-of-band assertions.
 *   appSql      — the prime_app login role (RLS enforced): used to assert the
 *                 exact behavior the running app sees.
 *
 * The app's own DAL (via lib/db/client getSql) also connects as prime_app to
 * DATABASE_URL, so integration tests exercising the DAL hit the same RLS.
 */
const MIGRATOR_URL =
  process.env.DATABASE_URL_MIGRATOR ??
  "postgres://gaurav@localhost:5432/prime_portal_test";
const APP_URL =
  process.env.DATABASE_URL ??
  "postgres://prime_app:prime_app_dev_password@localhost:5432/prime_portal_test";

export const migratorSql = postgres(MIGRATOR_URL, { max: 2, onnotice: () => {} });
export const appSql = postgres(APP_URL, { max: 4, onnotice: () => {} });

/** Every mutable table, child-first, so TRUNCATE ... CASCADE is deterministic. */
const TABLES = [
  "audit_log",
  "grievance_status_history",
  "grievance",
  "ticket_sequence",
  "prime_id_credential",
  "prime_id_request",
  "prime_id_sequence",
  "entrepreneur_profile",
  "mentor_profile",
  "investor_profile",
  "user_email_token",
  "user_session",
  "user_credential",
  "app_user",
  "organization",
  "admin_region",
  "admin_user",
];

/** Wipe all data (as owner, bypassing RLS). Call in beforeEach. */
export async function truncateAll(): Promise<void> {
  await migratorSql.unsafe(
    `TRUNCATE ${TABLES.join(", ")} RESTART IDENTITY CASCADE`,
  );
}

/** Run a callback inside a prime_app transaction with the given GUC context. */
export async function asContext<T>(
  gucs: Record<string, string>,
  fn: (tx: postgres.TransactionSql) => Promise<T>,
): Promise<T> {
  return appSql.begin(async (tx) => {
    for (const [k, v] of Object.entries(gucs)) {
      await tx`SELECT set_config(${k}, ${v}, true)`;
    }
    return fn(tx);
  }) as Promise<T>;
}

export async function closeDb(): Promise<void> {
  await Promise.all([migratorSql.end(), appSql.end()]);
}
