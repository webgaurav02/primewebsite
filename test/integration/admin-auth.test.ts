import { describe, test, expect, beforeEach, afterAll } from "vitest";
import { adminLogin, adminLogout, getAdminBySession } from "@/lib/dal/admin-auth";
import { hashPassword } from "@/lib/auth/password";
import { hashSessionToken } from "@/lib/auth/tokens";
import { getSql } from "@/lib/db/client";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";

/**
 * Admin email/password auth through the real DAL (prime_app + RLS + Postgres),
 * the admin counterpart to auth-flow.test.ts. Credentials are seeded as the
 * migrator (RLS bypassed); everything else exercises the exact code path the
 * running app uses.
 */

const meta = { ip: "127.0.0.1", userAgent: "vitest" };
const PW = "admin-correct-8";
const ADMIN = "admin@primemeghalaya.com";

const SUPER = "dd000000-0000-4000-8000-0000000000a1";
const OFFICER = "dd000000-0000-4000-8000-0000000000b2";
const DISABLED = "dd000000-0000-4000-8000-0000000000c3";

async function seedAdmin(
  id: string,
  email: string,
  role: string,
  opts: { active?: boolean; regions?: string[]; password?: string } = {},
): Promise<void> {
  await migratorSql`
    INSERT INTO admin_user (id, email, name, role, is_active)
    VALUES (${id}, ${email}, ${email}, ${role}, ${opts.active ?? true})
  `;
  for (const region of opts.regions ?? []) {
    await migratorSql`INSERT INTO admin_region (admin_id, region) VALUES (${id}, ${region})`;
  }
  const hash = await hashPassword(opts.password ?? PW);
  await migratorSql`INSERT INTO admin_credential (admin_id, password_hash) VALUES (${id}, ${hash})`;
}

beforeEach(async () => {
  await truncateAll();
  await seedAdmin(SUPER, ADMIN, "super_admin");
  await seedAdmin(OFFICER, "officer@x.com", "grievance_officer", { regions: ["garo", "ri_bhoi"] });
  await seedAdmin(DISABLED, "disabled@x.com", "auditor", { active: false });
});

afterAll(async () => {
  await getSql().end();
  await closeDb();
});

describe("adminLogin", () => {
  test("signs in and stores the session only as a hash", async () => {
    const res = await adminLogin({ email: ADMIN, password: PW }, meta);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const [s] = await migratorSql`
      SELECT admin_id FROM admin_session WHERE token_hash = ${hashSessionToken(res.token)}`;
    expect(s.admin_id).toBe(SUPER);
  });

  test("email match is case-insensitive", async () => {
    expect((await adminLogin({ email: "ADMIN@PrimeMeghalaya.com", password: PW }, meta)).ok).toBe(true);
  });

  test("wrong password and unknown email are both a generic 'invalid'", async () => {
    expect(await adminLogin({ email: ADMIN, password: "wrong" }, meta)).toEqual({ ok: false, error: "invalid" });
    expect(await adminLogin({ email: "ghost@x.com", password: "whatever" }, meta)).toEqual({ ok: false, error: "invalid" });
  });

  test("five failures lock the account, even for the right password", async () => {
    for (let i = 0; i < 4; i++) {
      expect(await adminLogin({ email: ADMIN, password: "wrong" }, meta)).toEqual({ ok: false, error: "invalid" });
    }
    expect(await adminLogin({ email: ADMIN, password: "wrong" }, meta)).toEqual({ ok: false, error: "locked" });
    expect(await adminLogin({ email: ADMIN, password: PW }, meta)).toEqual({ ok: false, error: "locked" });
  });

  test("a disabled admin with the correct password cannot get a session", async () => {
    expect(await adminLogin({ email: "disabled@x.com", password: PW }, meta)).toEqual({ ok: false, error: "disabled" });
    const rows = await migratorSql`SELECT 1 FROM admin_session WHERE admin_id = ${DISABLED}`;
    expect(rows.length).toBe(0);
  });
});

describe("getAdminBySession", () => {
  test("resolves the AdminUser DTO with officer region scope", async () => {
    const res = await adminLogin({ email: "officer@x.com", password: PW }, meta);
    if (!res.ok) throw new Error("login failed");
    const admin = await getAdminBySession(res.token);
    expect(admin?.role).toBe("grievance_officer");
    expect([...(admin?.regions ?? [])].sort()).toEqual(["garo", "ri_bhoi"]);
  });

  test("a super_admin carries null (all-region) scope", async () => {
    const res = await adminLogin({ email: ADMIN, password: PW }, meta);
    if (!res.ok) throw new Error("login failed");
    expect((await getAdminBySession(res.token))?.regions).toBeNull();
  });

  test("garbage token and a since-disabled admin both resolve to null", async () => {
    expect(await getAdminBySession("not-a-real-token")).toBeNull();
    const res = await adminLogin({ email: ADMIN, password: PW }, meta);
    if (!res.ok) throw new Error("login failed");
    await migratorSql`UPDATE admin_user SET is_active = false WHERE id = ${SUPER}`;
    expect(await getAdminBySession(res.token)).toBeNull();
  });
});

describe("adminLogout", () => {
  test("deletes that session", async () => {
    const res = await adminLogin({ email: ADMIN, password: PW }, meta);
    if (!res.ok) throw new Error("login failed");
    await adminLogout(res.token);
    const rows = await migratorSql`SELECT 1 FROM admin_session WHERE token_hash = ${hashSessionToken(res.token)}`;
    expect(rows.length).toBe(0);
  });
});
