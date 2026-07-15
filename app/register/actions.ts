"use server";

import { cookies, headers } from "next/headers";
import { registerUser } from "@/lib/dal/auth";
import {
  USER_SESSION_COOKIE_NAME,
  USER_SESSION_COOKIE_OPTIONS,
} from "@/lib/auth/user-cookie";
import { slidingWindow } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/client-ip";
import { presignAvatarUpload, type PresignResult } from "@/lib/storage";

/**
 * Mint a short-lived presigned URL so the browser can upload the optional
 * profile photo DIRECTLY to R2, keeping the (up to 5 MB) image out of the
 * registerAction body (Next caps Server Action bodies at 1 MB). The client
 * sends back only the returned object key; registerUser re-validates the bytes.
 * Rate-limited per IP so the URL minting can't be abused.
 */
export async function createAvatarUploadUrlAction(input: {
  contentType: string;
  size: number;
}): Promise<PresignResult> {
  const h = await headers();
  const ip = clientIp(h);

  const rl = slidingWindow(`avatar-presign:${ip ?? "shared"}`, 20, 15 * 60 * 1000);
  if (!rl.ok) {
    return { ok: false, error: `Too many attempts. Try again in ${rl.retryAfterSeconds}s.` };
  }

  return presignAvatarUpload(input.contentType, input.size);
}

/**
 * Self-serve registration. The DAL does validation, PII encryption, DPDP consent,
 * the conditional entrepreneur profile, and enumeration-safe duplicate handling,
 * and returns a session token for a GENUINELY NEW account. This action sets that
 * as an httpOnly cookie SERVER-SIDE and returns a UNIFORM body — it never puts the
 * session (or its presence) in the response, so the client cannot tell a new
 * signup from a duplicate email (see the DAL's enumeration-safety comment).
 */
export type RegisterActionResult =
  | { ok: true }
  | { ok: false; fieldErrors: Record<string, string[]> };

export async function registerAction(data: unknown): Promise<RegisterActionResult> {
  const h = await headers();
  const ip = clientIp(h);

  const rl = slidingWindow(`register:${ip ?? "shared"}`, 5, 15 * 60 * 1000);
  if (!rl.ok) {
    return {
      ok: false,
      fieldErrors: { email: [`Too many attempts. Try again in ${rl.retryAfterSeconds}s.`] },
    };
  }

  const res = await registerUser(data, { ip, userAgent: h.get("user-agent") });
  if (!res.ok) return { ok: false, fieldErrors: res.fieldErrors };

  // New account only: set the session cookie server-side. Duplicates get no cookie
  // (and an out-of-band "you already have an account" email) — the RESPONSE is
  // identical either way.
  if (res.session) {
    (await cookies()).set(USER_SESSION_COOKIE_NAME, res.session.token, {
      ...USER_SESSION_COOKIE_OPTIONS,
      maxAge: res.session.maxAge,
    });
  }
  return { ok: true };
}
