/**
 * Pure session-cookie constants. NO `server-only`, NO Node APIs here on purpose:
 * this module is imported by `proxy.ts` (which runs as a network-boundary proxy)
 * as well as by the server-only Data Access Layer. Keep it dependency-free.
 *
 * Holds the opaque admin session token minted by lib/dal/admin-auth.ts (only its
 * SHA-256 hash is stored in admin_session). Distinct from the member cookie
 * (lib/auth/user-cookie.ts): admin-scoped path, short 8h life, sameSite strict.
 */
export const SESSION_COOKIE_NAME = "prime_admin_session";

/** Hardened cookie attributes for any admin session/auth cookie we set ourselves. */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/admin",
  // Short-lived: re-auth often. Absolute lifetime in seconds (8h).
  maxAge: 60 * 60 * 8,
};
