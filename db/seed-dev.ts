/**
 * Development seed data. Idempotent — safe to re-run.
 *
 * Run with:  npm run db:seed   (node --env-file=.env.local db/seed-dev.ts)
 *
 * Connects as the MIGRATOR (superuser in dev — RLS is bypassed, which is what
 * lets us seed rows in states the public INSERT policy would refuse).
 *
 * Seeds:
 *   - the five dev admin accounts matching app/admin/login/actions.ts presets
 *     (super admin, auditor, one grievance officer per region) + their regions
 *   - the three sample grievances the old in-memory dev store shipped with,
 *     complainant PII encrypted with PII_ENCRYPTION_KEY
 *   - ticket_sequence rows continuing the seeded ticket numbers
 *
 * PII format mirrors lib/crypto/pii.ts (iv(12) || tag(16) || ciphertext,
 * AES-256-GCM) — inlined here because this script runs under plain Node
 * without the "@/" path alias. Keep the two implementations in sync.
 *
 * Every seeded admin also gets a scrypt credential (DEV password below) so you
 * can exercise the real email+password login locally, and admin@primemeghalaya.com
 * is seeded as a super_admin. For a production bootstrap admin use db/seed-admin.ts.
 */
import crypto from "node:crypto";
import { promisify } from "node:util";
import postgres from "postgres";

const url = process.env.DATABASE_URL_MIGRATOR ?? process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL_MIGRATOR (or DATABASE_URL) first.");
  process.exit(1);
}
const keyB64 = process.env.PII_ENCRYPTION_KEY;
if (!keyB64 || Buffer.from(keyB64, "base64").length !== 32) {
  console.error("PII_ENCRYPTION_KEY must be set to a base64 32-byte key.");
  process.exit(1);
}
const KEY = Buffer.from(keyB64, "base64");

function encryptPII(plaintext: string): Buffer {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ct]);
}

// ── scrypt password hash (mirror of lib/auth/password.ts) ─────────────────────
const scrypt = promisify(crypto.scrypt) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: crypto.ScryptOptions,
) => Promise<Buffer>;

async function hashPassword(pw: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const dk = await scrypt(pw, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt$32768$8$1$${salt.toString("base64")}$${dk.toString("base64")}`;
}

// Shared dev sign-in password for every seeded admin. Override via env.
const DEV_ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD ?? "prime-admin-dev";

const sql = postgres(url, { max: 1, onnotice: () => {} });

const ADMINS = [
  {
    id: "a1111111-1111-4111-8111-111111111111",
    email: "admin@primemeghalaya.com",
    name: "PRIME Administrator",
    role: "super_admin",
    regions: [] as string[],
  },
  {
    id: "11111111-1111-4111-8111-111111111111",
    email: "super@primemeghalaya.com",
    name: "Super Admin",
    role: "super_admin",
    regions: [] as string[],
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    email: "auditor@primemeghalaya.com",
    name: "Auditor",
    role: "auditor",
    regions: [],
  },
  {
    id: "33333333-3333-4333-8333-333333333301",
    email: "officer.kj@primemeghalaya.com",
    name: "Grievance Officer (Khasi-Jaintia)",
    role: "grievance_officer",
    regions: ["khasi_jaintia"],
  },
  {
    id: "33333333-3333-4333-8333-333333333302",
    email: "officer.gh@primemeghalaya.com",
    name: "Grievance Officer (Garo)",
    role: "grievance_officer",
    regions: ["garo"],
  },
  {
    id: "33333333-3333-4333-8333-333333333303",
    email: "officer.rb@primemeghalaya.com",
    name: "Grievance Officer (Ri-Bhoi)",
    role: "grievance_officer",
    regions: ["ri_bhoi"],
  },
];

const GRIEVANCES = [
  {
    id: "aaaaaaaa-0000-4000-8000-000000001001",
    ticketRef: "PRM-KJ-0001",
    region: "khasi_jaintia",
    subject: "Incubation stipend delayed",
    description: "Stipend for Q1 not disbursed to incubated startup.",
    status: "under_review",
    name: "Wanphrang Kharlukhi",
    email: "wanphrang@example.com",
    phone: "+91 90000 00001",
    assignedTo: null as string | null,
    createdAt: "2026-05-20T09:12:00.000Z",
    updatedAt: "2026-05-22T11:30:00.000Z",
  },
  {
    id: "aaaaaaaa-0000-4000-8000-000000001002",
    ticketRef: "PRM-GH-0002",
    region: "garo",
    subject: "Hub access card not issued",
    description:
      "Requested access to Tura hub workspace; no response for 2 weeks.",
    status: "submitted",
    name: "Silseng Sangma",
    email: "silseng@example.com",
    phone: "+91 90000 00002",
    assignedTo: null,
    createdAt: "2026-06-01T07:45:00.000Z",
    updatedAt: "2026-06-01T07:45:00.000Z",
  },
  {
    id: "aaaaaaaa-0000-4000-8000-000000001003",
    ticketRef: "PRM-RB-0003",
    region: "ri_bhoi",
    subject: "Mentor allocation request",
    description: "Need a mentor in agri-tech for the Nongpoh cohort.",
    status: "in_progress",
    name: "Banri Marwein",
    email: "banri@example.com",
    phone: "+91 90000 00003",
    assignedTo: "33333333-3333-4333-8333-333333333303",
    createdAt: "2026-05-10T13:00:00.000Z",
    updatedAt: "2026-06-03T10:15:00.000Z",
  },
];

// Per-region sequences continue from the seeded refs (KJ-0001, GH-0002, RB-0003).
const TICKET_SEQUENCES: Record<string, number> = {
  khasi_jaintia: 1,
  garo: 2,
  ri_bhoi: 3,
};

async function main(): Promise<void> {
  // One hash reused across dev admins (same password) — dev convenience only.
  const devPasswordHash = await hashPassword(DEV_ADMIN_PASSWORD);

  for (const a of ADMINS) {
    await sql`
      INSERT INTO admin_user (id, email, name, role)
      VALUES (${a.id}, ${a.email}, ${a.name}, ${a.role})
      ON CONFLICT (id) DO NOTHING
    `;
    for (const region of a.regions) {
      await sql`
        INSERT INTO admin_region (admin_id, region)
        VALUES (${a.id}, ${region})
        ON CONFLICT DO NOTHING
      `;
    }
    await sql`
      INSERT INTO admin_credential (admin_id, password_hash)
      VALUES (${a.id}, ${devPasswordHash})
      ON CONFLICT (admin_id) DO NOTHING
    `;
  }

  for (const g of GRIEVANCES) {
    await sql`
      INSERT INTO grievance
        (id, ticket_ref, region, subject, description, status,
         complainant_name_enc, complainant_email_enc, complainant_phone_enc,
         assigned_to, created_at, updated_at)
      VALUES
        (${g.id}, ${g.ticketRef}, ${g.region}, ${g.subject}, ${g.description},
         ${g.status}, ${encryptPII(g.name)}, ${encryptPII(g.email)},
         ${encryptPII(g.phone)}, ${g.assignedTo}, ${g.createdAt}, ${g.updatedAt})
      ON CONFLICT (id) DO NOTHING
    `;
  }

  for (const [region, lastValue] of Object.entries(TICKET_SEQUENCES)) {
    await sql`
      INSERT INTO ticket_sequence (region, last_value)
      VALUES (${region}, ${lastValue})
      ON CONFLICT (region) DO NOTHING
    `;
  }

  console.log(
    `seeded: ${ADMINS.length} admins, ${GRIEVANCES.length} grievances, ` +
      `${Object.keys(TICKET_SEQUENCES).length} ticket sequences`,
  );
  console.log(
    `admin login: admin@primemeghalaya.com / ${DEV_ADMIN_PASSWORD} (dev password — override with ADMIN_SEED_PASSWORD)`,
  );
}

try {
  await main();
} finally {
  await sql.end();
}
