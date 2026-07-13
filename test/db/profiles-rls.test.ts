import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { migratorSql, appSql, asContext, truncateAll, closeDb } from "../helpers/db";

/**
 * RLS on the Phase 2 tables (organization + *_profile): owner (current_user_id),
 * admins who manage users, or the auth context. Everything else fails closed.
 */

const USER_A = "55555555-5555-4555-8555-5555555555a1";
const USER_B = "55555555-5555-4555-8555-5555555555b2";
const ORG_A = "66666666-6666-4666-8666-6666666666a1";

beforeAll(async () => {
  await truncateAll();
  // org.created_by → app_user and app_user.organization_id → org are circular,
  // so create the org first without a creator, then backfill after the users.
  await migratorSql`
    INSERT INTO organization (id, name, sector)
    VALUES (${ORG_A}, 'Zero9 Farms', 'Agriculture & Horticulture')`;
  for (const [id, email, org] of [
    [USER_A, "a@ex.com", ORG_A],
    [USER_B, "b@ex.com", null],
  ] as const) {
    await migratorSql`
      INSERT INTO app_user (id, email, full_name, persona, status, organization_id)
      VALUES (${id}, ${email}, 'Name', 'entrepreneur', 'pending', ${org})`;
    await migratorSql`
      INSERT INTO entrepreneur_profile (user_id, business_name)
      VALUES (${id}, ${"Biz " + email})`;
  }
  await migratorSql`UPDATE organization SET created_by = ${USER_A} WHERE id = ${ORG_A}`;
});

afterAll(closeDb);

describe("profiles/org fail closed with no context", () => {
  test("no rows visible without a GUC context", async () => {
    expect((await appSql`SELECT 1 FROM organization`).length).toBe(0);
    expect((await appSql`SELECT 1 FROM entrepreneur_profile`).length).toBe(0);
  });
});

describe("member context (current_user_id)", () => {
  test("sees only its own profile", async () => {
    const rows = await asContext(
      { "app.current_user_id": USER_A },
      (tx) => tx`SELECT user_id FROM entrepreneur_profile`,
    );
    expect(rows.map((r) => r.user_id)).toEqual([USER_A]);
  });

  test("sees its own organisation (as creator / linked member)", async () => {
    const rows = await asContext(
      { "app.current_user_id": USER_A },
      (tx) => tx`SELECT id FROM organization`,
    );
    expect(rows.map((r) => r.id)).toEqual([ORG_A]);
  });

  test("user B (no org, different profile) cannot see A's org or profile", async () => {
    const orgs = await asContext({ "app.current_user_id": USER_B }, (tx) => tx`SELECT id FROM organization`);
    expect(orgs.length).toBe(0);
    const profs = await asContext({ "app.current_user_id": USER_B }, (tx) => tx`SELECT user_id FROM entrepreneur_profile`);
    expect(profs.map((r) => r.user_id)).toEqual([USER_B]);
  });
});

describe("admin + auth-op contexts", () => {
  test("an admin who manages users sees all profiles", async () => {
    const rows = await asContext(
      { "app.current_admin_id": "77777777-7777-4777-8777-777777777777", "app.current_admin_role": "super_admin" },
      (tx) => tx`SELECT user_id FROM entrepreneur_profile`,
    );
    expect(rows.length).toBe(2);
  });

  test("an auditor (no user:manage) sees no profiles", async () => {
    const rows = await asContext(
      { "app.current_admin_id": "88888888-8888-4888-8888-888888888888", "app.current_admin_role": "auditor" },
      (tx) => tx`SELECT user_id FROM entrepreneur_profile`,
    );
    expect(rows.length).toBe(0);
  });

  test("auth-op context may insert a profile (application intake)", async () => {
    const res = await asContext(
      { "app.auth_op": "1" },
      (tx) => tx`INSERT INTO entrepreneur_profile (user_id, business_name)
                 VALUES (${USER_B}, 'updated') ON CONFLICT (user_id) DO NOTHING`,
    );
    // USER_B already has a profile → conflict → 0, but the INSERT was permitted
    // by RLS (no policy violation thrown).
    expect(res.count).toBe(0);
  });
});
