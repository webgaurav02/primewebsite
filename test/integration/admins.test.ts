import { describe, test, expect, beforeEach, afterAll, vi } from "vitest";

/**
 * Admin-directory DAL: validation, region normalisation, audit, and the
 * lock-out guardrails (can't strip / disable the last active super admin, can't
 * demote or disable yourself). Runs against real Postgres as prime_app with a
 * super_admin session stub.
 */

const VIEWER = {
  id: "bb000000-0000-4000-8000-000000000001",
  email: "viewer@x",
  name: "Viewer",
  role: "super_admin" as const,
  regions: null,
};

vi.mock("@/lib/auth/session", () => ({
  requireAdmin: async () => VIEWER,
  getCurrentAdmin: async () => VIEWER,
}));

import { createAdmin, updateAdmin, setAdminActive, listAdmins } from "@/lib/dal/admins";
import { getSql } from "@/lib/db/client";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";

async function idByEmail(email: string): Promise<string> {
  const [r] = await migratorSql`SELECT id FROM admin_user WHERE email = ${email}`;
  return r.id as string;
}
async function find(email: string) {
  return (await listAdmins()).find((a) => a.email === email);
}
async function seedViewerRow() {
  await migratorSql`INSERT INTO admin_user (id, email, name, role)
    VALUES (${VIEWER.id}, 'viewer@x', 'Viewer', 'super_admin')`;
}

beforeEach(truncateAll);
afterAll(async () => {
  await getSql().end();
  await closeDb();
});

describe("createAdmin", () => {
  test("creates an officer with regions", async () => {
    const res = await createAdmin({ email: "OFF@x.com", name: "Ofa Cer", role: "grievance_officer", regions: ["garo", "ri_bhoi"] });
    expect(res.ok).toBe(true);
    const a = await find("off@x.com"); // stored lowercased
    expect(a?.role).toBe("grievance_officer");
    expect([...(a?.regions ?? [])].sort()).toEqual(["garo", "ri_bhoi"]);
  });

  test("rejects a duplicate email (case-insensitive)", async () => {
    await createAdmin({ email: "dup@x.com", name: "First One", role: "auditor", regions: [] });
    const res = await createAdmin({ email: "DUP@x.com", name: "Second One", role: "auditor", regions: [] });
    expect(res.ok).toBe(false);
    expect(res.ok === false && res.fieldErrors?.email).toBeTruthy();
  });

  test("rejects an officer with no region", async () => {
    const res = await createAdmin({ email: "noreg@x.com", name: "No Region", role: "grievance_officer", regions: [] });
    expect(res.ok).toBe(false);
    expect(res.ok === false && res.fieldErrors?.regions).toBeTruthy();
  });

  test("drops regions for a non-officer role", async () => {
    await createAdmin({ email: "sup2@x.com", name: "Super Two", role: "super_admin", regions: ["garo"] });
    expect((await find("sup2@x.com"))?.regions).toEqual([]);
  });
});

describe("guardrails", () => {
  test("cannot demote the last active super admin", async () => {
    await createAdmin({ email: "solo@x.com", name: "Solo Super", role: "super_admin", regions: [] });
    const id = await idByEmail("solo@x.com");
    const res = await updateAdmin({ adminId: id, name: "Solo Super", role: "auditor", regions: [] });
    expect(res.ok).toBe(false);
    expect(res.ok === false && res.error).toMatch(/last active super admin/i);
  });

  test("demotes a super admin when another active super remains", async () => {
    await createAdmin({ email: "s1@x.com", name: "Super One", role: "super_admin", regions: [] });
    await createAdmin({ email: "s2@x.com", name: "Super Two", role: "super_admin", regions: [] });
    const id1 = await idByEmail("s1@x.com");
    const res = await updateAdmin({ adminId: id1, name: "Super One", role: "grievance_officer", regions: ["garo"] });
    expect(res.ok).toBe(true);
    const a = await find("s1@x.com");
    expect(a?.role).toBe("grievance_officer");
    expect(a?.regions).toEqual(["garo"]);
  });

  test("cannot change own role", async () => {
    await seedViewerRow();
    const res = await updateAdmin({ adminId: VIEWER.id, name: "Viewer", role: "auditor", regions: [] });
    expect(res.ok).toBe(false);
    expect(res.ok === false && res.error).toMatch(/own role/i);
  });

  test("cannot disable own account", async () => {
    await seedViewerRow();
    const res = await setAdminActive({ adminId: VIEWER.id, isActive: false });
    expect(res.ok).toBe(false);
    expect(res.ok === false && res.error).toMatch(/own account/i);
  });

  test("cannot disable the last active super admin", async () => {
    await createAdmin({ email: "last@x.com", name: "Last Super", role: "super_admin", regions: [] });
    const id = await idByEmail("last@x.com");
    const res = await setAdminActive({ adminId: id, isActive: false });
    expect(res.ok).toBe(false);
    expect(res.ok === false && res.error).toMatch(/last active super admin/i);
  });
});

describe("enable / disable + audit", () => {
  test("disables then re-enables an officer, writing audit entries", async () => {
    await createAdmin({ email: "temp@x.com", name: "Temp Officer", role: "grievance_officer", regions: ["garo"] });
    const id = await idByEmail("temp@x.com");

    expect((await setAdminActive({ adminId: id, isActive: false })).ok).toBe(true);
    expect((await find("temp@x.com"))?.isActive).toBe(false);

    expect((await setAdminActive({ adminId: id, isActive: true })).ok).toBe(true);
    expect((await find("temp@x.com"))?.isActive).toBe(true);

    const [{ n }] = await migratorSql`
      SELECT count(*)::int AS n FROM audit_log
      WHERE action IN ('admin.create', 'admin.deactivate', 'admin.reactivate')`;
    expect(n).toBeGreaterThanOrEqual(3);
  });
});
