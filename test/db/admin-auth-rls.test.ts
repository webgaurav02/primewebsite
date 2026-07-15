import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { migratorSql, appSql, asContext, truncateAll, closeDb } from "../helpers/db";

/**
 * The admin credential / session tables (0020) are reachable ONLY in the
 * admin-auth context (app.admin_auth_op='1') that lib/dal/admin-auth.ts opens —
 * with one deliberate exception: a super_admin console context may WRITE
 * admin_credential (the set-password path), so createAdmin + initial password is
 * atomic. Sessions stay locked to the auth context alone. admin_user reads are
 * additionally allowed under admin_auth_op so the login/session join works with
 * no admin GUC set.
 */

const SUPER = "cc000000-0000-4000-8000-0000000000a1";
const OFFICER = "cc000000-0000-4000-8000-0000000000b2";

beforeAll(async () => {
  await truncateAll();
  await migratorSql`
    INSERT INTO admin_user (id, email, name, role)
    VALUES (${SUPER}, 'super-rls@x', 'Super', 'super_admin'),
           (${OFFICER}, 'officer-rls@x', 'Officer', 'grievance_officer')
  `;
  await migratorSql`
    INSERT INTO admin_credential (admin_id, password_hash) VALUES (${SUPER}, 'scrypt$x')
  `;
  await migratorSql`
    INSERT INTO admin_session (token_hash, admin_id, expires_at)
    VALUES ('hash-super', ${SUPER}, now() + interval '1 day')
  `;
});

afterAll(closeDb);

describe("admin auth tables — fail closed by default", () => {
  test("no context sees no credentials, sessions, or admins", async () => {
    expect((await appSql`SELECT 1 FROM admin_credential`).length).toBe(0);
    expect((await appSql`SELECT 1 FROM admin_session`).length).toBe(0);
    expect((await appSql`SELECT 1 FROM admin_user`).length).toBe(0);
  });
});

describe("admin-auth-op context (the admin-auth DAL)", () => {
  test("reads credentials + sessions + admin_user for the login/session join", async () => {
    const creds = await asContext({ "app.admin_auth_op": "1" }, (tx) => tx`SELECT admin_id FROM admin_credential`);
    expect(creds.length).toBe(1);
    const sessions = await asContext({ "app.admin_auth_op": "1" }, (tx) => tx`SELECT admin_id FROM admin_session`);
    expect(sessions.length).toBe(1);
    const admins = await asContext({ "app.admin_auth_op": "1" }, (tx) => tx`SELECT id FROM admin_user`);
    expect(admins.length).toBe(2);
  });

  test("can mint a session", async () => {
    const res = await asContext(
      { "app.admin_auth_op": "1" },
      (tx) => tx`INSERT INTO admin_session (token_hash, admin_id, expires_at)
                 VALUES ('minted', ${SUPER}, now() + interval '1 day')`,
    );
    expect(res.count).toBe(1);
  });
});

describe("super_admin console context", () => {
  test("may write admin_credential (set-password path)", async () => {
    const upd = await asContext(
      { "app.current_admin_id": SUPER, "app.current_admin_role": "super_admin" },
      (tx) => tx`UPDATE admin_credential SET failed_attempts = 0 WHERE admin_id = ${SUPER}`,
    );
    expect(upd.count).toBe(1);
  });

  test("CANNOT read or mint sessions (locked to the auth context)", async () => {
    const seen = await asContext(
      { "app.current_admin_id": SUPER, "app.current_admin_role": "super_admin" },
      (tx) => tx`SELECT admin_id FROM admin_session`,
    );
    expect(seen.length).toBe(0);

    await expect(
      asContext(
        { "app.current_admin_id": SUPER, "app.current_admin_role": "super_admin" },
        (tx) => tx`INSERT INTO admin_session (token_hash, admin_id, expires_at)
                   VALUES ('nope', ${SUPER}, now() + interval '1 day')`,
      ),
    ).rejects.toThrow();
  });
});

describe("grievance_officer context", () => {
  test("cannot touch admin credentials", async () => {
    const upd = await asContext(
      { "app.current_admin_id": OFFICER, "app.current_admin_role": "grievance_officer" },
      (tx) => tx`UPDATE admin_credential SET failed_attempts = 9 WHERE admin_id = ${SUPER}`,
    );
    expect(upd.count).toBe(0); // row invisible → no update, no leak

    await expect(
      asContext(
        { "app.current_admin_id": OFFICER, "app.current_admin_role": "grievance_officer" },
        (tx) => tx`INSERT INTO admin_credential (admin_id, password_hash) VALUES (${OFFICER}, 'scrypt$y')`,
      ),
    ).rejects.toThrow();
  });
});
