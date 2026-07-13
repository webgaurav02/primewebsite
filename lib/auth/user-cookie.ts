/**
 * Public-user session cookie constants. NO `server-only`, NO Node APIs — this
 * is imported by `proxy.ts` (network-boundary) as well as the server-only DAL,
 * mirroring lib/auth/cookie.ts. Keep it dependency-free.
 *
 * Distinct from the admin cookie (lib/auth/cookie.ts):
 *   - name differs so an admin session and a member session never collide,
 *   - path is "/" (the member portal spans the whole site, not just /admin),
 *   - sameSite is "lax" so following an email verification / reset link from an
 *     external mail client still presents the cookie on the top-level GET.
 */
export const USER_SESSION_COOKIE_NAME = "prime_user_session";

export const USER_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days (seconds)

export const USER_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: USER_SESSION_MAX_AGE,
};
