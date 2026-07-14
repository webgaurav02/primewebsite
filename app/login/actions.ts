"use server";

import { cookies, headers } from "next/headers";
import { loginUser } from "@/lib/dal/auth";
import {
  USER_SESSION_COOKIE_NAME,
  USER_SESSION_COOKIE_OPTIONS,
} from "@/lib/auth/user-cookie";
import { slidingWindow } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/client-ip";

export type SignInResult = { ok: true } | { ok: false; error: string };

/**
 * Imperative sign-in for the existing login form. Verifies credentials in the
 * DAL, sets the session cookie on success, and returns a friendly error
 * otherwise. The client redirects to /dashboard on ok.
 */
export async function signInAction(input: {
  email: string;
  password: string;
}): Promise<SignInResult> {
  const h = await headers();
  const ip = clientIp(h);

  const rl = slidingWindow(`login:${ip ?? "shared"}`, 10, 10 * 60 * 1000);
  if (!rl.ok) {
    return { ok: false, error: `Too many attempts. Try again in ${rl.retryAfterSeconds}s.` };
  }

  const res = await loginUser(
    { email: input.email, password: input.password },
    { ip, userAgent: h.get("user-agent") },
  );

  if (!res.ok) {
    const messages: Record<typeof res.error, string> = {
      invalid: "Invalid email or password.",
      locked: "Too many failed attempts. Try again later, or reset your password.",
      suspended: "This account is suspended. Please contact PRIME support.",
    };
    return { ok: false, error: messages[res.error] };
  }

  (await cookies()).set(USER_SESSION_COOKIE_NAME, res.token, {
    ...USER_SESSION_COOKIE_OPTIONS,
    maxAge: res.maxAge,
  });
  return { ok: true };
}
