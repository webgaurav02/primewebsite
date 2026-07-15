/**
 * Bootstrap super-admin seed. Idempotent — safe to re-run.
 *
 * Run with:  npm run db:seed:admin   (node --env-file=.env.local db/seed-admin.ts)
 *
 * Production-safe: creates (or updates) ONE active super_admin with a real
 * password so someone can sign in to /admin. Connects as the MIGRATOR (owner /
 * superuser — RLS bypassed), like db/migrate.ts and db/seed-dev.ts.
 *
 * Env:
 *   ADMIN_SEED_EMAIL     default "admin@primemeghalaya.com"
 *   ADMIN_SEED_NAME      default "PRIME Administrator"
 *   ADMIN_SEED_PASSWORD  REQUIRED (min 8 chars). Never commit it.
 *
 * The scrypt hash format mirrors lib/auth/password.ts (scrypt$N$r$p$salt$dk) —
 * inlined here because this script runs under plain Node without the "@/" alias.
 * Keep the two in sync.
 */
import crypto from "node:crypto";
import { promisify } from "node:util";
import postgres from "postgres";

const url = process.env.DATABASE_URL_MIGRATOR ?? process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL_MIGRATOR (or DATABASE_URL) first.");
  process.exit(1);
}

const email = (process.env.ADMIN_SEED_EMAIL ?? "admin@primemeghalaya.com").toLowerCase();
const name = process.env.ADMIN_SEED_NAME ?? "PRIME Administrator";
const password = process.env.ADMIN_SEED_PASSWORD ?? "";
if (password.length < 8) {
  console.error("ADMIN_SEED_PASSWORD must be set to at least 8 characters.");
  process.exit(1);
}

// ── scrypt (mirror of lib/auth/password.ts) ───────────────────────────────────
const scrypt = promisify(crypto.scrypt) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: crypto.ScryptOptions,
) => Promise<Buffer>;
const N = 32768;
const r = 8;
const p = 1;
const KEYLEN = 64;
const MAXMEM = 64 * 1024 * 1024;

async function hashPassword(pw: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const dk = await scrypt(pw, salt, KEYLEN, { N, r, p, maxmem: MAXMEM });
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${dk.toString("base64")}`;
}

const sql = postgres(url, { max: 1, onnotice: () => {} });

async function main(): Promise<void> {
  const passwordHash = await hashPassword(password);

  const [admin] = await sql<{ id: string }[]>`
    INSERT INTO admin_user (email, name, role, is_active)
    VALUES (${email}, ${name}, 'super_admin', true)
    ON CONFLICT (email)
    DO UPDATE SET name = EXCLUDED.name, role = 'super_admin', is_active = true
    RETURNING id
  `;

  await sql`
    INSERT INTO admin_credential (admin_id, password_hash)
    VALUES (${admin.id}, ${passwordHash})
    ON CONFLICT (admin_id)
    DO UPDATE SET password_hash = EXCLUDED.password_hash,
                  failed_attempts = 0, locked_until = NULL, updated_at = now()
  `;

  console.log(`seeded super_admin ${email} (sign in at /admin/login)`);
}

try {
  await main();
} finally {
  await sql.end();
}
