import { describe, test, expect, beforeEach, afterAll } from "vitest";
import { migratorSql, appSql, asContext, truncateAll, closeDb } from "../helpers/db";

/**
 * Migration 0019 opened admin_user / admin_region to writes, but ONLY for a
 * super_admin GUC context — defence-in-depth behind the DAL's assertCan. Reads
 * stay open (the grievance region-scoping policies join these tables). The audit
 * log stays readable only to super_admin / auditor.
 */

const SUPER = "aa000000-0000-4000-8000-000000000001";
const OFFICER = "aa000000-0000-4000-8000-000000000002";

const superCtx = { "app.current_admin_id": SUPER, "app.current_admin_role": "super_admin" };
const officerCtx = { "app.current_admin_id": OFFICER, "app.current_admin_role": "grievance_officer" };
const auditorCtx = { "app.current_admin_id": SUPER, "app.current_admin_role": "auditor" };

beforeEach(async () => {
  await truncateAll();
  await migratorSql`INSERT INTO admin_user (id, email, name, role) VALUES
    (${SUPER}, 'super@x', 'Super', 'super_admin'),
    (${OFFICER}, 'officer@x', 'Officer', 'grievance_officer')`;
  await migratorSql`INSERT INTO admin_region (admin_id, region) VALUES (${OFFICER}, 'garo')`;
});
afterAll(closeDb);

describe("admin_user / admin_region RLS", () => {
  test("a super_admin context may create an admin + regions", async () => {
    const id = await asContext(superCtx, async (tx) => {
      const [row] = await tx`
        INSERT INTO admin_user (email, name, role) VALUES ('new@x', 'New', 'grievance_officer')
        RETURNING id`;
      await tx`INSERT INTO admin_region (admin_id, region) VALUES (${row.id}, 'ri_bhoi')`;
      return row.id as string;
    });
    const [check] = await migratorSql`SELECT role FROM admin_user WHERE id = ${id}`;
    expect(check.role).toBe("grievance_officer");
  });

  test("a grievance_officer context cannot INSERT an admin", async () => {
    await expect(
      asContext(officerCtx, (tx) =>
        tx`INSERT INTO admin_user (email, name, role) VALUES ('sneaky@x', 'Sneaky', 'super_admin')`,
      ),
    ).rejects.toThrow(/row-level security/i);
  });

  test("a grievance_officer context cannot UPDATE an admin (0 rows, silently filtered)", async () => {
    await asContext(officerCtx, (tx) =>
      tx`UPDATE admin_user SET name = 'Hacked' WHERE id = ${SUPER}`,
    );
    const [row] = await migratorSql`SELECT name FROM admin_user WHERE id = ${SUPER}`;
    expect(row.name).toBe("Super"); // unchanged
  });

  test("admin_region stays readable to a non-super context (region scoping depends on it)", async () => {
    const rows = await asContext(officerCtx, (tx) => tx`SELECT region FROM admin_region`);
    expect(rows.map((r) => r.region)).toContain("garo");
  });
});

describe("audit_log read RLS", () => {
  beforeEach(async () => {
    await appSql`SELECT record_audit('u1', 'u1@x', 'x.test', 'app_user', 'r1', '{}'::jsonb, NULL)`;
  });

  test("super_admin and auditor can read the log", async () => {
    const [s] = await asContext(superCtx, (tx) => tx`SELECT count(*)::int AS n FROM audit_log`);
    const [a] = await asContext(auditorCtx, (tx) => tx`SELECT count(*)::int AS n FROM audit_log`);
    expect(s.n).toBeGreaterThanOrEqual(1);
    expect(a.n).toBeGreaterThanOrEqual(1);
  });

  test("a grievance_officer sees no audit rows", async () => {
    const [o] = await asContext(officerCtx, (tx) => tx`SELECT count(*)::int AS n FROM audit_log`);
    expect(o.n).toBe(0);
  });
});
