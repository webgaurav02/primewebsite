import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { migratorSql, appSql, asContext, truncateAll, closeDb } from "../helpers/db";

/**
 * The credential / session / email-token tables are reachable ONLY in the auth
 * context (app.auth_op='1'), the single context lib/dal/auth.ts opens. Any other
 * code path — including an authenticated member — is denied. app_user itself is
 * scoped to the owner (or an admin who manages users).
 */

const USER_A = "44444444-4444-4444-8444-4444444444a1";
const USER_B = "44444444-4444-4444-8444-4444444444b2";

beforeAll(async () => {
  await truncateAll();
  for (const [id, email] of [
    [USER_A, "a@example.com"],
    [USER_B, "b@example.com"],
  ] as const) {
    await migratorSql`
      INSERT INTO app_user (id, email, full_name, persona, status, email_verified_at)
      VALUES (${id}, ${email}, 'Full Name', 'entrepreneur', 'active', now())
    `;
    await migratorSql`
      INSERT INTO user_credential (user_id, password_hash) VALUES (${id}, 'scrypt$x')
    `;
    await migratorSql`
      INSERT INTO user_session (token_hash, user_id, expires_at)
      VALUES (${"hash-" + id}, ${id}, now() + interval '1 day')
    `;
  }
});

afterAll(closeDb);

describe("auth tables — fail closed by default", () => {
  test("no context sees nothing", async () => {
    expect((await appSql`SELECT 1 FROM app_user`).length).toBe(0);
    expect((await appSql`SELECT 1 FROM user_credential`).length).toBe(0);
    expect((await appSql`SELECT 1 FROM user_session`).length).toBe(0);
  });
});

describe("auth-op context (the auth DAL)", () => {
  test("can read credentials for login lookup", async () => {
    const rows = await asContext({ "app.auth_op": "1" }, (tx) => tx`SELECT user_id FROM user_credential`);
    expect(rows.length).toBe(2);
  });
});

describe("member context (current_user_id)", () => {
  test("sees only its own app_user row", async () => {
    const rows = await asContext(
      { "app.current_user_id": USER_A },
      (tx) => tx`SELECT id FROM app_user`,
    );
    expect(rows.map((r) => r.id)).toEqual([USER_A]);
  });

  test("cannot read ANY credential (not even its own)", async () => {
    const rows = await asContext(
      { "app.current_user_id": USER_A },
      (tx) => tx`SELECT user_id FROM user_credential`,
    );
    expect(rows.length).toBe(0);
  });

  test("can see and revoke only its own sessions", async () => {
    const seen = await asContext(
      { "app.current_user_id": USER_A },
      (tx) => tx`SELECT user_id FROM user_session`,
    );
    expect(seen.map((r) => r.user_id)).toEqual([USER_A]);

    const del = await asContext(
      { "app.current_user_id": USER_A },
      (tx) => tx`DELETE FROM user_session WHERE user_id = ${USER_B}`,
    );
    expect(del.count).toBe(0); // cannot delete another user's session
  });
});
