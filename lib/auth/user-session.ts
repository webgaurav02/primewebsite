import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { withAuthContext } from "@/lib/db/client";
import { USER_SESSION_COOKIE_NAME } from "./user-cookie";
import { hashSessionToken } from "./tokens";
import type { Persona, UserStatus } from "@/lib/users/types";

/**
 * THE public-user authentication seam — the member counterpart to
 * lib/auth/session.ts. Everything member-facing asks "who is the current user?"
 * through getCurrentUser().
 *
 * A session cookie holds an opaque random token; only its SHA-256 hash is
 * stored, so the lookup is by hash and a DB dump never yields a usable cookie.
 */

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  persona: Persona;
  status: UserStatus;
  emailVerified: boolean;
  district: string | null;
}

// `cache` dedupes this within a single request so the session is verified once.
export const getCurrentUser = cache(async (): Promise<AppUser | null> => {
  const token = (await cookies()).get(USER_SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashSessionToken(token);

  return withAuthContext(async (tx) => {
    const [row] = await tx<
      {
        id: string;
        email: string;
        fullName: string;
        persona: Persona;
        status: UserStatus;
        emailVerifiedAt: Date | null;
        district: string | null;
      }[]
    >`
      SELECT u.id, u.email, u.full_name AS "fullName", u.persona, u.status,
             u.email_verified_at AS "emailVerifiedAt", u.district
      FROM user_session s
      JOIN app_user u ON u.id = s.user_id
      WHERE s.token_hash = ${tokenHash}
        AND s.expires_at > now()
    `;
    if (!row) return null;

    // Suspended accounts cannot act — treat as signed out.
    if (row.status === "suspended") return null;

    // Best-effort last-seen touch (ignored if it races).
    await tx`UPDATE user_session SET last_seen_at = now() WHERE token_hash = ${tokenHash}`;

    return {
      id: row.id,
      email: row.email,
      fullName: row.fullName,
      persona: row.persona,
      status: row.status,
      emailVerified: row.emailVerifiedAt !== null,
      district: row.district,
    };
  });
});

/** Use at the top of every member page/layout. Redirects anonymous users out. */
export async function requireUser(nextPath?: string): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login");
  }
  return user;
}
