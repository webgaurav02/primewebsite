import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "./cookie";
import { getAdminBySession } from "@/lib/dal/admin-auth";
import type { AdminUser } from "./rbac";

/**
 * THE admin authentication seam. Everything server-side asks "who is the current
 * admin?" through getCurrentAdmin(). A session cookie holds an opaque random
 * token; only its SHA-256 hash is stored (admin_session), so a DB dump yields no
 * usable cookie. Verification + the AdminUser DTO are built by the admin-auth DAL
 * (lib/dal/admin-auth.ts), the only module allowed near the credential/session
 * tables under RLS.
 *
 * Admins sign in with email + password (see app/admin/login). This is the same
 * hand-rolled model as the public side (lib/auth/user-session.ts).
 */

// `cache` dedupes this within a single request so we verify the session once
// even if many DAL calls ask for the current admin.
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return getAdminBySession(token);
});

/** Use at the top of every admin page/layout. Redirects anonymous users out. */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getCurrentAdmin();
  if (!user) redirect("/admin/login");
  return user;
}
