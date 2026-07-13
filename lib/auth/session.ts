import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "./cookie";
import type { AdminUser, Region, Role } from "./rbac";

/**
 * THE authentication seam. Everything server-side asks "who is the current
 * admin?" through `getCurrentAdmin()`. Swapping the dev stub below for Better
 * Auth (passkeys + TOTP) is a change localized to THIS file.
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │ PRODUCTION IS FAIL-CLOSED. Until real verification is wired,          │
 *   │ getCurrentAdmin() returns null in production, so /admin denies        │
 *   │ everyone. That is the correct secure default — do not "temporarily"   │
 *   │ loosen it.                                                            │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 * To wire Better Auth (see docs/admin-security.md §Auth):
 *   1. Replace `verifySessionToken` with `auth.api.getSession({ headers })`.
 *   2. Map the Better Auth user + your `admin_user` row -> AdminUser DTO.
 *   3. Point SESSION_COOKIE_NAME (lib/auth/cookie.ts) at Better Auth's cookie.
 *   4. Delete the dev-stub block.
 */

// `cache` dedupes this within a single request so we verify the session once
// even if many DAL calls ask for the current user.
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
});

/** Use at the top of every admin page/layout. Redirects anonymous users out. */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getCurrentAdmin();
  if (!user) redirect("/admin/login");
  return user;
}

async function verifySessionToken(token: string): Promise<AdminUser | null> {
  if (process.env.NODE_ENV === "production") {
    // TODO(auth): wire Better Auth here. Fail closed until then.
    return null;
  }
  // ── DEV STUB ONLY — never reached in production ──────────────────────────
  return verifyDevSession(token);
}

/* ===========================================================================
 * DEV STUB. Lets you exercise RBAC / DAL / audit locally without a real IdP.
 * HMAC-signed so you still test signature handling, but only ever honored when
 * NODE_ENV !== "production". Delete this whole block once Better Auth is wired.
 * ========================================================================= */

const DEV_SECRET = process.env.ADMIN_DEV_SECRET ?? "dev-only-insecure-secret";

interface DevPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
  regions: Region[] | null;
  exp: number; // unix seconds
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payloadB64: string): string {
  return crypto
    .createHmac("sha256", DEV_SECRET)
    .update(payloadB64)
    .digest("base64url");
}

/** Mint a dev session token. Called only by the dev-login server action. */
export function createDevSessionToken(
  user: Omit<DevPayload, "exp">,
): { value: string; options: typeof SESSION_COOKIE_OPTIONS } {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Dev sessions are disabled in production");
  }
  const exp = Math.floor(Date.now() / 1000) + SESSION_COOKIE_OPTIONS.maxAge;
  const payloadB64 = b64url(JSON.stringify({ ...user, exp }));
  return {
    value: `${payloadB64}.${sign(payloadB64)}`,
    options: SESSION_COOKIE_OPTIONS,
  };
}

function verifyDevSession(token: string): AdminUser | null {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;

  const expected = sign(payloadB64);
  // Constant-time comparison to avoid signature-timing leaks.
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  let payload: DevPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
  } catch {
    return null;
  }
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    regions: payload.regions,
  };
}
