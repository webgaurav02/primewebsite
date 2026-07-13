import "server-only";
import { z } from "zod";
import { withAuthContext } from "@/lib/db/client";
import { encryptPII } from "@/lib/crypto/pii";
import {
  hashPassword,
  verifyPassword,
  getDummyPasswordHash,
} from "@/lib/auth/password";
import { newToken, hashSessionToken } from "@/lib/auth/tokens";
import { USER_SESSION_MAX_AGE } from "@/lib/auth/user-cookie";
import { recordAudit } from "@/lib/audit/log";
import { sendEmail, appBaseUrl } from "@/lib/email";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";

/**
 * Authentication Data Access Layer — the boundary for every pre-session
 * operation (register / verify / login / reset / logout). It is the ONLY module
 * that runs in withAuthContext, so it is the only path RLS lets near the
 * credential / session / email-token tables.
 *
 * Actions stay thin: they hand raw input in, and set/clear the session cookie
 * from the token this module returns (cookies can only be written from an
 * action / route handler, never from a plain function).
 */

type FieldErrors = Record<string, string[]>;

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const RESET_TTL_MS = 60 * 60 * 1000; // 1h
const MAX_FAILED = 5;
const LOCK_MS = 15 * 60 * 1000;

function flatten(err: z.ZodError): FieldErrors {
  return z.flattenError(err).fieldErrors as FieldErrors;
}

// ── Registration ──────────────────────────────────────────────────────────────

export type RegisterResult =
  | { ok: true }
  | { ok: false; fieldErrors: FieldErrors };

export async function registerUser(raw: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, fieldErrors: flatten(parsed.error) };
  const d = parsed.data;

  const passwordHash = await hashPassword(d.password);
  const mobileEnc = encryptPII(d.mobile);

  const outcome = await withAuthContext(async (tx) => {
    const existing = await tx`SELECT 1 FROM app_user WHERE email = ${d.email}`;
    if (existing.length > 0) return { duplicate: true as const };

    const [user] = await tx<{ id: string }[]>`
      INSERT INTO app_user
        (email, full_name, persona, gender, date_of_birth, mobile_enc,
         preferred_language, district, how_heard, status, source)
      VALUES
        (${d.email}, ${d.fullName}, ${d.persona}, ${d.gender}, ${d.dateOfBirth},
         ${mobileEnc}, ${d.preferredLanguage}, ${d.district}, ${d.howHeard},
         'pending', 'public')
      RETURNING id
    `;

    await tx`
      INSERT INTO user_credential (user_id, password_hash)
      VALUES (${user.id}, ${passwordHash})
    `;

    const { token, hash } = newToken();
    await tx`
      INSERT INTO user_email_token (token_hash, user_id, kind, expires_at)
      VALUES (${hash}, ${user.id}, 'verify', now() + ${`${VERIFY_TTL_MS} milliseconds`}::interval)
    `;

    await recordAudit(
      {
        actor: { kind: "system", id: user.id, email: d.email },
        action: "user.register",
        resourceType: "app_user",
        resourceId: user.id,
        metadata: { persona: d.persona },
      },
      tx,
    );

    return { duplicate: false as const, verifyToken: token, name: d.fullName };
  });

  if (outcome.duplicate) {
    return {
      ok: false,
      fieldErrors: { email: ["That email is already registered. Try signing in."] },
    };
  }

  await sendVerificationEmail(d.email, outcome.name, outcome.verifyToken);
  return { ok: true };
}

// ── Email verification ──────────────────────────────────────────────────────

export async function verifyEmailToken(token: string): Promise<{ ok: boolean }> {
  if (!token) return { ok: false };
  const hash = hashSessionToken(token);

  return withAuthContext(async (tx) => {
    const [row] = await tx<{ userId: string }[]>`
      UPDATE user_email_token
      SET consumed_at = now()
      WHERE token_hash = ${hash}
        AND kind = 'verify'
        AND consumed_at IS NULL
        AND expires_at > now()
      RETURNING user_id AS "userId"
    `;
    if (!row) return { ok: false };

    await tx`
      UPDATE app_user
      SET email_verified_at = COALESCE(email_verified_at, now()), updated_at = now()
      WHERE id = ${row.userId}
    `;

    await recordAudit(
      {
        actor: { kind: "system", id: row.userId, email: "" },
        action: "user.verify_email",
        resourceType: "app_user",
        resourceId: row.userId,
      },
      tx,
    );

    return { ok: true };
  });
}

export async function resendVerification(rawEmail: unknown): Promise<void> {
  const parsed = forgotPasswordSchema.safeParse({ email: rawEmail });
  if (!parsed.success) return; // stay quiet — no enumeration
  const email = parsed.data.email;

  const sendData = await withAuthContext(async (tx) => {
    const [u] = await tx<{ id: string; fullName: string }[]>`
      SELECT id, full_name AS "fullName" FROM app_user
      WHERE email = ${email} AND email_verified_at IS NULL
    `;
    if (!u) return null;
    const { token, hash } = newToken();
    await tx`
      INSERT INTO user_email_token (token_hash, user_id, kind, expires_at)
      VALUES (${hash}, ${u.id}, 'verify', now() + ${`${VERIFY_TTL_MS} milliseconds`}::interval)
    `;
    return { name: u.fullName, token };
  });

  if (sendData) await sendVerificationEmail(email, sendData.name, sendData.token);
}

// ── Login ─────────────────────────────────────────────────────────────────────

export type LoginResult =
  | { ok: true; token: string; maxAge: number }
  | { ok: false; error: "invalid" | "unverified" | "locked" | "suspended" };

export async function loginUser(
  raw: unknown,
  meta: { ip: string | null; userAgent: string | null },
): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { email, password } = parsed.data;

  return withAuthContext(async (tx) => {
    const [row] = await tx<
      {
        id: string;
        status: "pending" | "active" | "suspended";
        emailVerifiedAt: Date | null;
        passwordHash: string | null;
        failedAttempts: number | null;
        lockedUntil: Date | null;
      }[]
    >`
      SELECT u.id, u.status, u.email_verified_at AS "emailVerifiedAt",
             c.password_hash AS "passwordHash",
             c.failed_attempts AS "failedAttempts",
             c.locked_until AS "lockedUntil"
      FROM app_user u
      LEFT JOIN user_credential c ON c.user_id = u.id
      WHERE u.email = ${email}
    `;

    // Unknown email: still spend time verifying against a dummy hash so the
    // response is not measurably faster (timing-based enumeration).
    if (!row || !row.passwordHash) {
      await verifyPassword(password, await getDummyPasswordHash());
      return { ok: false, error: "invalid" };
    }

    if (row.lockedUntil && row.lockedUntil > new Date()) {
      return { ok: false, error: "locked" };
    }

    const good = await verifyPassword(password, row.passwordHash);
    if (!good) {
      const attempts = (row.failedAttempts ?? 0) + 1;
      const lock = attempts >= MAX_FAILED;
      await tx`
        UPDATE user_credential
        SET failed_attempts = ${attempts},
            locked_until = ${lock ? new Date(Date.now() + LOCK_MS) : null}
        WHERE user_id = ${row.id}
      `;
      await recordAudit(
        {
          actor: { kind: "system", id: row.id, email },
          action: "user.login_failed",
          resourceType: "app_user",
          resourceId: row.id,
          metadata: { attempts, locked: lock },
        },
        tx,
      );
      return { ok: false, error: lock ? "locked" : "invalid" };
    }

    if (row.status === "suspended") return { ok: false, error: "suspended" };
    if (!row.emailVerifiedAt) return { ok: false, error: "unverified" };

    // Success — clear the failure counter and open a session.
    await tx`
      UPDATE user_credential
      SET failed_attempts = 0, locked_until = NULL
      WHERE user_id = ${row.id}
    `;
    const { token, hash } = newToken();
    await tx`
      INSERT INTO user_session (token_hash, user_id, expires_at, user_agent, ip)
      VALUES (${hash}, ${row.id}, now() + ${`${USER_SESSION_MAX_AGE} seconds`}::interval,
              ${meta.userAgent}, ${meta.ip})
    `;
    await recordAudit(
      {
        actor: { kind: "system", id: row.id, email },
        action: "user.login",
        resourceType: "app_user",
        resourceId: row.id,
      },
      tx,
    );

    return { ok: true, token, maxAge: USER_SESSION_MAX_AGE };
  });
}

export async function logoutUser(token: string): Promise<void> {
  if (!token) return;
  const hash = hashSessionToken(token);
  await withAuthContext(async (tx) => {
    await tx`DELETE FROM user_session WHERE token_hash = ${hash}`;
  });
}

// ── Password reset ──────────────────────────────────────────────────────────

/** Always resolves ok — never reveals whether the email exists. */
export async function requestPasswordReset(raw: unknown): Promise<void> {
  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) return;
  const email = parsed.data.email;

  const sendData = await withAuthContext(async (tx) => {
    const [u] = await tx<{ id: string; fullName: string }[]>`
      SELECT id, full_name AS "fullName" FROM app_user WHERE email = ${email}
    `;
    if (!u) return null;
    // Invalidate any outstanding reset tokens for this user.
    await tx`
      UPDATE user_email_token SET consumed_at = now()
      WHERE user_id = ${u.id} AND kind = 'reset' AND consumed_at IS NULL
    `;
    const { token, hash } = newToken();
    await tx`
      INSERT INTO user_email_token (token_hash, user_id, kind, expires_at)
      VALUES (${hash}, ${u.id}, 'reset', now() + ${`${RESET_TTL_MS} milliseconds`}::interval)
    `;
    await recordAudit(
      {
        actor: { kind: "system", id: u.id, email },
        action: "user.reset_requested",
        resourceType: "app_user",
        resourceId: u.id,
      },
      tx,
    );
    return { name: u.fullName, token };
  });

  if (sendData) await sendResetEmail(email, sendData.name, sendData.token);
}

export type ResetResult =
  | { ok: true }
  | { ok: false; fieldErrors?: FieldErrors; error?: "invalid_token" };

export async function resetPassword(raw: unknown): Promise<ResetResult> {
  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, fieldErrors: flatten(parsed.error) };
  const { token, password } = parsed.data;

  const passwordHash = await hashPassword(password);
  const hash = hashSessionToken(token);

  return withAuthContext(async (tx) => {
    const [row] = await tx<{ userId: string }[]>`
      UPDATE user_email_token
      SET consumed_at = now()
      WHERE token_hash = ${hash}
        AND kind = 'reset'
        AND consumed_at IS NULL
        AND expires_at > now()
      RETURNING user_id AS "userId"
    `;
    if (!row) return { ok: false, error: "invalid_token" };

    await tx`
      INSERT INTO user_credential (user_id, password_hash)
      VALUES (${row.userId}, ${passwordHash})
      ON CONFLICT (user_id)
      DO UPDATE SET password_hash = ${passwordHash},
                    failed_attempts = 0, locked_until = NULL, updated_at = now()
    `;
    // Controlling the reset link proves email ownership.
    await tx`
      UPDATE app_user
      SET email_verified_at = COALESCE(email_verified_at, now()), updated_at = now()
      WHERE id = ${row.userId}
    `;
    // Invalidate every existing session after a credential change.
    await tx`DELETE FROM user_session WHERE user_id = ${row.userId}`;

    await recordAudit(
      {
        actor: { kind: "system", id: row.userId, email: "" },
        action: "user.password_reset",
        resourceType: "app_user",
        resourceId: row.userId,
      },
      tx,
    );

    return { ok: true };
  });
}

// ── Email bodies ────────────────────────────────────────────────────────────

async function sendVerificationEmail(
  to: string,
  name: string,
  token: string,
): Promise<void> {
  const url = `${appBaseUrl()}/verify-email?token=${token}`;
  await sendEmail({
    to,
    subject: "Verify your PRIME account",
    text: [
      `Hi ${name.split(" ")[0]},`,
      "",
      "Confirm your email to activate your PRIME account:",
      url,
      "",
      "This link expires in 24 hours. If you didn't create this account, ignore this email.",
    ].join("\n"),
  });
}

async function sendResetEmail(
  to: string,
  name: string,
  token: string,
): Promise<void> {
  const url = `${appBaseUrl()}/reset-password?token=${token}`;
  await sendEmail({
    to,
    subject: "Reset your PRIME password",
    text: [
      `Hi ${name.split(" ")[0]},`,
      "",
      "Reset your PRIME password using the link below:",
      url,
      "",
      "This link expires in 1 hour. If you didn't request this, you can ignore it.",
    ].join("\n"),
  });
}
