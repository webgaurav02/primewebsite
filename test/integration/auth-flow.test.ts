import {
  describe,
  test,
  expect,
  beforeEach,
  afterAll,
  vi,
} from "vitest";
import {
  registerUser,
  verifyEmailToken,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
} from "@/lib/dal/auth";
import { getSql } from "@/lib/db/client";
import { hashSessionToken } from "@/lib/auth/tokens";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";

/**
 * End-to-end auth lifecycle through the real DAL against the test database
 * (prime_app + RLS + Postgres). Verification / reset links travel by "email";
 * the dev console transport logs them, so a console spy recovers the raw token
 * exactly as a user clicking the emailed link would present it.
 */

let logs: string[] = [];
const meta = { ip: "127.0.0.1", userAgent: "vitest" };
const PW = "correct-horse-8";

function tokenFor(pathname: string): string {
  const re = new RegExp(`${pathname}\\?token=([A-Za-z0-9_-]+)`);
  for (let i = logs.length - 1; i >= 0; i--) {
    const m = logs[i].match(re);
    if (m) return m[1];
  }
  throw new Error(`no ${pathname} token found in email output`);
}

const validRegistration = (email: string) => ({
  fullName: "Kyrsoibor Nongrum",
  email,
  password: PW,
  confirmPassword: PW,
  persona: "entrepreneur",
  gender: "male",
  dateOfBirth: "1994-03-11",
  mobile: "9876500011",
  preferredLanguage: "Khasi",
  district: "East Khasi Hills",
  howHeard: "PRIME event or workshop",
  consent: true,
});

async function registerAndVerify(email: string): Promise<void> {
  expect(await registerUser(validRegistration(email))).toEqual({ ok: true });
  expect(await verifyEmailToken(tokenFor("/verify-email"))).toEqual({ ok: true });
}

beforeEach(async () => {
  await truncateAll();
  logs = [];
  vi.spyOn(console, "log").mockImplementation((...a: unknown[]) => {
    logs.push(a.map(String).join(" "));
  });
});

afterAll(async () => {
  vi.restoreAllMocks();
  await getSql().end();
  await closeDb();
});

describe("registration", () => {
  test("creates a pending, unverified account and emails a verify link", async () => {
    expect(await registerUser(validRegistration("k@example.com"))).toEqual({ ok: true });

    const [u] = await migratorSql`
      SELECT status, email_verified_at, source, mobile_enc FROM app_user WHERE email='k@example.com'`;
    expect(u.status).toBe("pending");
    expect(u.email_verified_at).toBeNull();
    expect(u.source).toBe("public");
    // Mobile is stored encrypted (bytea), never the raw 10 digits.
    expect(u.mobile_enc.toString("utf8")).not.toContain("9876500011");

    expect(() => tokenFor("/verify-email")).not.toThrow();
    // Password stored only as a scrypt hash.
    const [c] = await migratorSql`
      SELECT password_hash FROM user_credential c
      JOIN app_user u ON u.id=c.user_id WHERE u.email='k@example.com'`;
    expect(c.password_hash).toMatch(/^scrypt\$/);
  });

  test("rejects a duplicate email", async () => {
    await registerUser(validRegistration("dup@example.com"));
    const again = await registerUser(validRegistration("dup@example.com"));
    expect(again.ok).toBe(false);
    if (!again.ok) expect(again.fieldErrors.email).toBeTruthy();
  });

  test("rejects invalid input with field errors", async () => {
    const r = await registerUser({ ...validRegistration("x@example.com"), confirmPassword: "nope" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.fieldErrors.confirmPassword).toBeTruthy();
  });
});

describe("email verification", () => {
  test("cannot log in before verifying", async () => {
    await registerUser(validRegistration("e@example.com"));
    expect(await loginUser({ email: "e@example.com", password: PW }, meta)).toEqual({
      ok: false,
      error: "unverified",
    });
  });

  test("verification activates the account and the token is single-use", async () => {
    await registerUser(validRegistration("e@example.com"));
    const token = tokenFor("/verify-email");
    expect(await verifyEmailToken(token)).toEqual({ ok: true });

    const [u] = await migratorSql`SELECT email_verified_at FROM app_user WHERE email='e@example.com'`;
    expect(u.email_verified_at).not.toBeNull();

    // Re-using the same link fails.
    expect(await verifyEmailToken(token)).toEqual({ ok: false });
  });

  test("garbage tokens are rejected", async () => {
    expect(await verifyEmailToken("not-a-real-token")).toEqual({ ok: false });
  });
});

describe("login + session", () => {
  test("verified login opens a session stored only as a hash", async () => {
    await registerAndVerify("l@example.com");
    const res = await loginUser({ email: "l@example.com", password: PW }, meta);
    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const rows = await migratorSql`
      SELECT s.token_hash FROM user_session s
      JOIN app_user u ON u.id=s.user_id WHERE u.email='l@example.com'`;
    expect(rows.length).toBe(1);
    // What's persisted is SHA-256(token), never the token itself.
    expect(rows[0].token_hash).toBe(hashSessionToken(res.token));
    expect(rows[0].token_hash).not.toBe(res.token);
  });

  test("wrong password never enumerates and is generic", async () => {
    await registerAndVerify("l@example.com");
    expect(await loginUser({ email: "l@example.com", password: "wrong" }, meta)).toEqual({ ok: false, error: "invalid" });
    // Unknown account gives the SAME generic error.
    expect(await loginUser({ email: "ghost@example.com", password: "wrong" }, meta)).toEqual({ ok: false, error: "invalid" });
  });

  test("five failures lock the account", async () => {
    await registerAndVerify("lock@example.com");
    for (let i = 0; i < 4; i++) {
      expect(await loginUser({ email: "lock@example.com", password: "wrong" }, meta)).toEqual({ ok: false, error: "invalid" });
    }
    expect(await loginUser({ email: "lock@example.com", password: "wrong" }, meta)).toEqual({ ok: false, error: "locked" });
    // Even the correct password is refused while locked.
    expect(await loginUser({ email: "lock@example.com", password: PW }, meta)).toEqual({ ok: false, error: "locked" });
  });

  test("logout deletes the session", async () => {
    await registerAndVerify("out@example.com");
    const res = await loginUser({ email: "out@example.com", password: PW }, meta);
    if (!res.ok) throw new Error("login failed");
    await logoutUser(res.token);
    const rows = await migratorSql`SELECT 1 FROM user_session WHERE token_hash=${hashSessionToken(res.token)}`;
    expect(rows.length).toBe(0);
  });
});

describe("password reset", () => {
  test("rotates the password, clears the lock, and invalidates sessions", async () => {
    await registerAndVerify("r@example.com");
    // Open a session and lock the account with bad attempts.
    const first = await loginUser({ email: "r@example.com", password: PW }, meta);
    if (!first.ok) throw new Error("login failed");
    for (let i = 0; i < 5; i++) await loginUser({ email: "r@example.com", password: "wrong" }, meta);

    await requestPasswordReset({ email: "r@example.com" });
    const reset = await resetPassword({
      token: tokenFor("/reset-password"),
      password: "brand-new-9",
      confirmPassword: "brand-new-9",
    });
    expect(reset).toEqual({ ok: true });

    // Old session invalidated.
    const sessions = await migratorSql`
      SELECT 1 FROM user_session s JOIN app_user u ON u.id=s.user_id WHERE u.email='r@example.com'`;
    expect(sessions.length).toBe(0);

    // Old password no longer works; new one does; lock cleared.
    expect(await loginUser({ email: "r@example.com", password: PW }, meta)).toEqual({ ok: false, error: "invalid" });
    expect((await loginUser({ email: "r@example.com", password: "brand-new-9" }, meta)).ok).toBe(true);
  });

  test("reset request for an unknown email is silent (no token, no email)", async () => {
    await requestPasswordReset({ email: "nobody@example.com" });
    const tokens = await migratorSql`SELECT 1 FROM user_email_token`;
    expect(tokens.length).toBe(0);
    expect(() => tokenFor("/reset-password")).toThrow();
  });

  test("a used or expired reset token is rejected", async () => {
    await registerAndVerify("r2@example.com");
    await requestPasswordReset({ email: "r2@example.com" });
    const token = tokenFor("/reset-password");
    expect((await resetPassword({ token, password: "brand-new-9", confirmPassword: "brand-new-9" })).ok).toBe(true);
    // Second use of the same token fails.
    expect(await resetPassword({ token, password: "another-one-9", confirmPassword: "another-one-9" })).toEqual({
      ok: false,
      error: "invalid_token",
    });
  });
});
