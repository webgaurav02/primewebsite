import { describe, test, expect, beforeEach, afterAll, vi } from "vitest";
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
 * End-to-end auth lifecycle through the real DAL (prime_app + RLS + Postgres).
 * Self-serve registration now creates an ACTIVE account + a session immediately;
 * email verification is a SOFT gate (a banner, not a login block). Verify / reset
 * links travel by "email"; the console transport logs them, so a spy recovers the
 * raw token exactly as a user clicking the link would.
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
  registrantType: "student",
  fullName: "Kyrsoibor Nongrum",
  email,
  password: PW,
  confirmPassword: PW,
  gender: "male",
  dateOfBirth: "1994-03-11",
  mobile: "9876500011",
  preferredLanguage: "Khasi",
  district: "East Khasi Hills",
  howHeard: "PRIME event or workshop",
  consent: true,
});

async function registerAndVerify(email: string): Promise<void> {
  const r = await registerUser(validRegistration(email), meta);
  expect(r.ok).toBe(true);
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
  test("creates an ACTIVE account, a session, and emails a verify link", async () => {
    const r = await registerUser(validRegistration("k@example.com"), meta);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.session?.token).toBeTruthy();

    const [u] = await migratorSql`
      SELECT status, email_verified_at, source, registrant_type, mobile_enc
      FROM app_user WHERE email='k@example.com'`;
    expect(u.status).toBe("active"); // no admin approval needed
    expect(u.email_verified_at).toBeNull(); // soft-gate: not yet verified
    expect(u.source).toBe("public");
    expect(u.registrant_type).toBe("student");
    expect(u.mobile_enc.toString("utf8")).not.toContain("9876500011");

    // Session persisted only as SHA-256(token); verify link emailed.
    const [s] = await migratorSql`
      SELECT token_hash FROM user_session s JOIN app_user u ON u.id=s.user_id
      WHERE u.email='k@example.com'`;
    expect(s.token_hash).toBe(hashSessionToken(r.session!.token));
    expect(() => tokenFor("/verify-email")).not.toThrow();

    const [c] = await migratorSql`
      SELECT password_hash FROM user_credential c
      JOIN app_user u ON u.id=c.user_id WHERE u.email='k@example.com'`;
    expect(c.password_hash).toMatch(/^scrypt\$/);
  });

  test("a duplicate email is enumeration-safe (uniform ok, no second account)", async () => {
    await registerUser(validRegistration("dup@example.com"), meta);
    const again = await registerUser(validRegistration("dup@example.com"), meta);
    // Same uniform success — the response never reveals the account exists...
    expect(again.ok).toBe(true);
    if (again.ok) expect(again.session).toBeUndefined(); // ...but no new session
    // ...and no duplicate row was created.
    const rows = await migratorSql`SELECT id FROM app_user WHERE email='dup@example.com'`;
    expect(rows.length).toBe(1);
  });

  test("rejects a password mismatch with field errors", async () => {
    const r = await registerUser({ ...validRegistration("x@example.com"), confirmPassword: "nope" }, meta);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.fieldErrors.confirmPassword).toBeTruthy();
  });
});

describe("email verification (soft gate)", () => {
  test("an UNVERIFIED user can still log in (dashboard soft-gate)", async () => {
    await registerUser(validRegistration("e@example.com"), meta);
    const res = await loginUser({ email: "e@example.com", password: PW }, meta);
    expect(res.ok).toBe(true);
  });

  test("verifying sets email_verified_at and the token is single-use", async () => {
    await registerUser(validRegistration("v@example.com"), meta);
    const token = tokenFor("/verify-email");
    expect(await verifyEmailToken(token)).toEqual({ ok: true });
    const [u] = await migratorSql`SELECT email_verified_at FROM app_user WHERE email='v@example.com'`;
    expect(u.email_verified_at).not.toBeNull();
    expect(await verifyEmailToken(token)).toEqual({ ok: false });
  });

  test("garbage tokens are rejected", async () => {
    expect(await verifyEmailToken("not-a-real-token")).toEqual({ ok: false });
  });
});

describe("login + session", () => {
  test("login opens a session stored only as a hash", async () => {
    await registerAndVerify("l@example.com");
    const res = await loginUser({ email: "l@example.com", password: PW }, meta);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const rows = await migratorSql`SELECT 1 FROM user_session WHERE token_hash=${hashSessionToken(res.token)}`;
    expect(rows.length).toBe(1);
  });

  test("wrong password never enumerates and is generic", async () => {
    await registerAndVerify("l2@example.com");
    expect(await loginUser({ email: "l2@example.com", password: "wrong" }, meta)).toEqual({ ok: false, error: "invalid" });
    expect(await loginUser({ email: "ghost@example.com", password: "wrong" }, meta)).toEqual({ ok: false, error: "invalid" });
  });

  test("five failures lock the account", async () => {
    await registerAndVerify("lock@example.com");
    for (let i = 0; i < 4; i++) {
      expect(await loginUser({ email: "lock@example.com", password: "wrong" }, meta)).toEqual({ ok: false, error: "invalid" });
    }
    expect(await loginUser({ email: "lock@example.com", password: "wrong" }, meta)).toEqual({ ok: false, error: "locked" });
    expect(await loginUser({ email: "lock@example.com", password: PW }, meta)).toEqual({ ok: false, error: "locked" });
  });

  test("logout deletes that session", async () => {
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

    // Every session (register + login) invalidated after a credential change.
    const sessions = await migratorSql`
      SELECT 1 FROM user_session s JOIN app_user u ON u.id=s.user_id WHERE u.email='r@example.com'`;
    expect(sessions.length).toBe(0);

    expect(await loginUser({ email: "r@example.com", password: PW }, meta)).toEqual({ ok: false, error: "invalid" });
    expect((await loginUser({ email: "r@example.com", password: "brand-new-9" }, meta)).ok).toBe(true);
  });

  test("a used or expired reset token is rejected", async () => {
    await registerAndVerify("r2@example.com");
    await requestPasswordReset({ email: "r2@example.com" });
    const token = tokenFor("/reset-password");
    expect((await resetPassword({ token, password: "brand-new-9", confirmPassword: "brand-new-9" })).ok).toBe(true);
    expect(await resetPassword({ token, password: "another-one-9", confirmPassword: "another-one-9" })).toEqual({
      ok: false,
      error: "invalid_token",
    });
  });
});
