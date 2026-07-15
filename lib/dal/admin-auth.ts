import "server-only";
import { withAdminAuthContext } from "@/lib/db/client";
import {
  verifyPassword,
  getDummyPasswordHash,
} from "@/lib/auth/password";
import { newToken, hashSessionToken } from "@/lib/auth/tokens";
import { SESSION_COOKIE_OPTIONS } from "@/lib/auth/cookie";
import { recordAudit } from "@/lib/audit/log";
import { loginSchema } from "@/lib/validation/auth";
import type { AdminUser, Region, Role } from "@/lib/auth/rbac";

/**
 * Admin authentication DAL — the admin counterpart to the public auth DAL
 * (lib/dal/auth.ts). It is the only module that runs in withAdminAuthContext, so
 * it is the only path RLS lets near the admin_credential / admin_session tables
 * (0020_admin_auth). Actions stay thin: they hand raw input in and set/clear the
 * admin session cookie from the token returned here.
 *
 * Admins authenticate with email + password (scrypt), sessions are opaque random
 * tokens stored only as SHA-256(token), with the same lockout / timing-safety /
 * audit posture as the public side.
 */

const SESSION_MAX_AGE = SESSION_COOKIE_OPTIONS.maxAge; // seconds (8h)
const MAX_FAILED = 5;
const LOCK_MS = 15 * 60 * 1000;

// ── Login ─────────────────────────────────────────────────────────────────────

export type AdminLoginResult =
  | { ok: true; token: string; maxAge: number }
  | { ok: false; error: "invalid" | "locked" | "disabled" };

export async function adminLogin(
  raw: unknown,
  meta: { ip: string | null; userAgent: string | null },
): Promise<AdminLoginResult> {
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const email = parsed.data.email.toLowerCase();
  const { password } = parsed.data;

  return withAdminAuthContext(async (tx) => {
    const [row] = await tx<
      {
        id: string;
        email: string;
        name: string;
        role: Role;
        isActive: boolean;
        passwordHash: string | null;
        failedAttempts: number | null;
        lockedUntil: Date | null;
      }[]
    >`
      SELECT a.id, a.email, a.name, a.role, a.is_active AS "isActive",
             c.password_hash AS "passwordHash",
             c.failed_attempts AS "failedAttempts",
             c.locked_until AS "lockedUntil"
      FROM admin_user a
      LEFT JOIN admin_credential c ON c.admin_id = a.id
      WHERE lower(a.email) = ${email}
    `;

    // Unknown email (or an admin provisioned without a password): still spend
    // time against a dummy hash so the response isn't measurably faster.
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
        UPDATE admin_credential
        SET failed_attempts = ${attempts},
            locked_until = ${lock ? new Date(Date.now() + LOCK_MS) : null},
            updated_at = now()
        WHERE admin_id = ${row.id}
      `;
      await recordAudit(
        {
          actor: { kind: "system", id: row.id, email: row.email },
          action: "admin.login_failed",
          resourceType: "admin_user",
          resourceId: row.id,
          metadata: { attempts, locked: lock },
        },
        tx,
      );
      return { ok: false, error: lock ? "locked" : "invalid" };
    }

    // Correct password — a disabled account still cannot get a session (only the
    // holder of the right password ever learns it is disabled).
    if (!row.isActive) return { ok: false, error: "disabled" };

    await tx`
      UPDATE admin_credential
      SET failed_attempts = 0, locked_until = NULL, updated_at = now()
      WHERE admin_id = ${row.id}
    `;
    const { token, hash } = newToken();
    await tx`
      INSERT INTO admin_session (token_hash, admin_id, expires_at, user_agent, ip)
      VALUES (${hash}, ${row.id}, now() + ${`${SESSION_MAX_AGE} seconds`}::interval,
              ${meta.userAgent}, ${meta.ip})
    `;
    await recordAudit(
      {
        actor: { kind: "system", id: row.id, email: row.email },
        action: "admin.login",
        resourceType: "admin_user",
        resourceId: row.id,
      },
      tx,
    );

    return { ok: true, token, maxAge: SESSION_MAX_AGE };
  });
}

export async function adminLogout(token: string): Promise<void> {
  if (!token) return;
  const hash = hashSessionToken(token);
  await withAdminAuthContext(async (tx) => {
    await tx`DELETE FROM admin_session WHERE token_hash = ${hash}`;
  });
}

// ── Session verification (used by the session seam, every admin request) ──────

/**
 * Resolve an admin from a session cookie token. Returns null for a missing /
 * expired session or a disabled admin. Loads region scope the same way the DTO
 * expects it: officers carry their admin_region rows, everyone else is null
 * (all-region). Mirrors getCurrentUser() on the public side.
 */
export async function getAdminBySession(token: string): Promise<AdminUser | null> {
  if (!token) return null;
  const tokenHash = hashSessionToken(token);

  return withAdminAuthContext(async (tx) => {
    const [row] = await tx<
      {
        id: string;
        email: string;
        name: string;
        role: Role;
        isActive: boolean;
      }[]
    >`
      SELECT a.id, a.email, a.name, a.role, a.is_active AS "isActive"
      FROM admin_session s
      JOIN admin_user a ON a.id = s.admin_id
      WHERE s.token_hash = ${tokenHash}
        AND s.expires_at > now()
    `;
    if (!row || !row.isActive) return null;

    let regions: Region[] | null = null;
    if (row.role === "grievance_officer") {
      const rs = await tx<{ region: Region }[]>`
        SELECT region FROM admin_region WHERE admin_id = ${row.id}
      `;
      regions = rs.map((r) => r.region);
    }

    // Best-effort last-seen touch (ignored if it races).
    await tx`UPDATE admin_session SET last_seen_at = now() WHERE token_hash = ${tokenHash}`;

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      regions,
    };
  });
}

// ── Dev-only quick sessions (the "assume a role" buttons) ─────────────────────

/**
 * Mint a real admin_session for an already-seeded preset admin, WITHOUT a
 * password, so the local "assume a role" buttons keep working against the real
 * session path. Hard-refuses in production. The preset admin_user row must exist
 * (db/seed-dev.ts seeds it) — otherwise the FK insert fails.
 */
export async function devCreateAdminSession(
  adminId: string,
): Promise<{ token: string; maxAge: number }> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("devCreateAdminSession is disabled in production");
  }
  const { token, hash } = newToken();
  await withAdminAuthContext(async (tx) => {
    await tx`
      INSERT INTO admin_session (token_hash, admin_id, expires_at)
      VALUES (${hash}, ${adminId}, now() + ${`${SESSION_MAX_AGE} seconds`}::interval)
    `;
  });
  return { token, maxAge: SESSION_MAX_AGE };
}
