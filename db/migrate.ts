/**
 * Minimal SQL migration runner. Applies db/migrations/*.sql in filename order,
 * once each, recording progress in schema_migrations. Each migration runs in
 * its own transaction.
 *
 * Run with:  npm run db:migrate   (node --env-file=.env.local db/migrate.ts)
 *
 * Connects as the MIGRATOR (table owner / superuser) via DATABASE_URL_MIGRATOR —
 * never as prime_app, which must stay a least-privilege login for the app.
 * In dev it also creates the prime_app / prime_audit roles if missing so a
 * fresh database (local brew Postgres or docker-compose) bootstraps in one
 * command. In production, create those roles yourself with real passwords.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const url = process.env.DATABASE_URL_MIGRATOR ?? process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL_MIGRATOR (or DATABASE_URL) first.");
  process.exit(1);
}

const sql = postgres(url, { max: 1, onnotice: () => {} });

async function ensureDevRoles(): Promise<void> {
  if (process.env.NODE_ENV === "production") return;
  await sql.unsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'prime_app') THEN
        CREATE ROLE prime_app LOGIN PASSWORD 'prime_app_dev_password';
      END IF;
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'prime_audit') THEN
        CREATE ROLE prime_audit NOLOGIN;
      END IF;
    END
    $$;
  `);
}

async function main(): Promise<void> {
  await ensureDevRoles();

  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename   text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const dir = path.join(import.meta.dirname, "migrations");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  const applied = new Set(
    (await sql`SELECT filename FROM schema_migrations`).map((r) => r.filename as string),
  );

  let ran = 0;
  for (const file of files) {
    if (applied.has(file)) continue;
    const body = await readFile(path.join(dir, file), "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(body);
      await tx`INSERT INTO schema_migrations (filename) VALUES (${file})`;
    });
    console.log(`applied ${file}`);
    ran++;
  }
  console.log(ran === 0 ? "up to date" : `done (${ran} applied)`);
}

try {
  await main();
} finally {
  await sql.end();
}
