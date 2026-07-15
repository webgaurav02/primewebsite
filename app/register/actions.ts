"use server";

import * as Sentry from "@sentry/nextjs";
import { cookies, headers } from "next/headers";
import { registerUser } from "@/lib/dal/auth";
import {
  USER_SESSION_COOKIE_NAME,
  USER_SESSION_COOKIE_OPTIONS,
} from "@/lib/auth/user-cookie";
import { slidingWindow } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/client-ip";
import { presignAvatarUpload, type PresignResult } from "@/lib/storage";
import { log, maskEmail, errInfo } from "@/lib/observability/log";

/** Pull only NON-PII context out of the raw register payload for logging. */
function registerContext(data: unknown): { registrantType: unknown; hasPhoto: boolean; email: unknown } {
  const d = (data ?? {}) as Record<string, unknown>;
  return { registrantType: d.registrantType, hasPhoto: !!d.photoKey, email: d.email };
}

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
    log.warn("avatar_presign.rate_limited", {});
    return { ok: false, error: `Too many attempts. Try again in ${rl.retryAfterSeconds}s.` };
  }

  try {
    const res = await presignAvatarUpload(input.contentType, input.size);
    if (!res.ok) log.info("avatar_presign.rejected", { contentType: input.contentType, size: input.size, error: res.error });
    return res;
  } catch (err) {
    // Presign is pure signing (no network), so a throw here means a real config
    // problem (missing/invalid R2 creds) — surface it loudly.
    log.error("avatar_presign.failed", { contentType: input.contentType, ...errInfo(err) });
    Sentry.captureException(err, { tags: { flow: "avatar_presign" } });
    return { ok: false, error: "Couldn't start the upload. Please try again." };
  }
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
  const started = Date.now();
  const ctx = registerContext(data);
  const h = await headers();
  const ip = clientIp(h);

  const rl = slidingWindow(`register:${ip ?? "shared"}`, 5, 15 * 60 * 1000);
  if (!rl.ok) {
    log.warn("register.rate_limited", { email: maskEmail(ctx.email) });
    return {
      ok: false,
      fieldErrors: { email: [`Too many attempts. Try again in ${rl.retryAfterSeconds}s.`] },
    };
  }

  try {
    const res = await registerUser(data, { ip, userAgent: h.get("user-agent") });
    if (!res.ok) {
      log.info("register.rejected", {
        email: maskEmail(ctx.email),
        registrantType: ctx.registrantType,
        fields: Object.keys(res.fieldErrors),
        ms: Date.now() - started,
      });
      return { ok: false, fieldErrors: res.fieldErrors };
    }

    // New account only: set the session cookie server-side. Duplicates get no
    // cookie (and an out-of-band "you already have an account" email) — the
    // RESPONSE is identical either way.
    if (res.session) {
      (await cookies()).set(USER_SESSION_COOKIE_NAME, res.session.token, {
        ...USER_SESSION_COOKIE_OPTIONS,
        maxAge: res.session.maxAge,
      });
    }
    log.info("register.ok", {
      email: maskEmail(ctx.email),
      registrantType: ctx.registrantType,
      hasPhoto: ctx.hasPhoto,
      newAccount: !!res.session, // false ⇒ duplicate email (uniform response)
      ms: Date.now() - started,
    });
    return { ok: true };
  } catch (err) {
    // An UNEXPECTED throw (DB down, RLS misconfig, encryption key missing, email
    // enqueue failing, …). Log it with context for the Azure Log Stream, report
    // it to Sentry, and return a graceful error so the action never rejects and
    // hangs the form. This is the signal for "why is register failing in prod".
    log.error("register.failed", {
      email: maskEmail(ctx.email),
      registrantType: ctx.registrantType,
      hasPhoto: ctx.hasPhoto,
      ms: Date.now() - started,
      ...errInfo(err),
    });
    Sentry.captureException(err, {
      tags: { flow: "register" },
      extra: { registrantType: ctx.registrantType, hasPhoto: ctx.hasPhoto },
    });
    return {
      ok: false,
      fieldErrors: { form: ["We couldn't create your account right now. Please try again in a moment."] },
    };
  }
}
