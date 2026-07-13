/**
 * Pure session-cookie constants. NO `server-only`, NO Node APIs here on purpose:
 * this module is imported by `proxy.ts` (which runs as a network-boundary proxy)
 * as well as by the server-only Data Access Layer. Keep it dependency-free.
 *
 * When Better Auth is wired, set SESSION_COOKIE_NAME to its session cookie
 * (default: "better-auth.session_token", or "__Secure-..." when prefixed).
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
