"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminLogin, devCreateAdminSession } from "@/lib/dal/admin-auth";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth/cookie";
import { REGIONS, type Region, type Role } from "@/lib/auth/rbac";
import { slidingWindow } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/client-ip";

export type AdminSignInResult = { ok: true } | { ok: false; error: string };

/**
 * Admin email + password sign-in. Verifies credentials in the admin-auth DAL,
 * sets the session cookie on success (path "/admin", 8h, httpOnly, strict), and
 * returns a friendly error otherwise. The client redirects to /admin on ok.
 * Mirrors app/login/actions.ts (the member counterpart).
 */
export async function adminSignInAction(input: {
  email: string;
  password: string;
}): Promise<AdminSignInResult> {
  const h = await headers();
  const ip = clientIp(h);

  const rl = slidingWindow(`admin-login:${ip ?? "shared"}`, 10, 10 * 60 * 1000);
  if (!rl.ok) {
    return { ok: false, error: `Too many attempts. Try again in ${rl.retryAfterSeconds}s.` };
  }

  const res = await adminLogin(
    { email: input.email, password: input.password },
    { ip, userAgent: h.get("user-agent") },
  );

  if (!res.ok) {
    const messages: Record<typeof res.error, string> = {
      invalid: "Invalid email or password.",
      locked: "Too many failed attempts. Try again in a few minutes.",
      disabled: "This admin account is disabled. Contact a super admin.",
    };
    return { ok: false, error: messages[res.error] };
  }

  (await cookies()).set(SESSION_COOKIE_NAME, res.token, {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: res.maxAge,
  });
  return { ok: true };
}

/**
 * DEV-ONLY quick login. Mints a REAL admin_session for a seeded preset admin so
 * you can assume a role/region locally to exercise RBAC, the DAL, and the audit
 * trail without typing a password. It hard-refuses in production.
 *
 * The preset ids are FIXED UUIDs matching the admin_user rows created by
 * db/seed-dev.ts — run `npm run db:seed` first so the rows (and the FK target)
 * exist. The role/region come from the seeded row, not this token.
 */
const SUPER_ADMIN = { id: "11111111-1111-4111-8111-111111111111" };
const AUDITOR = { id: "22222222-2222-4222-8222-222222222222" };
const OFFICERS: Record<Region, { id: string }> = {
  khasi_jaintia: { id: "33333333-3333-4333-8333-333333333301" },
  garo: { id: "33333333-3333-4333-8333-333333333302" },
  ri_bhoi: { id: "33333333-3333-4333-8333-333333333303" },
};

export async function devLoginAction(formData: FormData) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Dev login is disabled in production");
  }

  const role = String(formData.get("role")) as Role;
  const regionRaw = String(formData.get("region") ?? "");
  const region: Region = (REGIONS as string[]).includes(regionRaw)
    ? (regionRaw as Region)
    : "garo";

  const preset =
    role === "grievance_officer"
      ? OFFICERS[region]
      : role === "auditor"
        ? AUDITOR
        : SUPER_ADMIN;

  const session = await devCreateAdminSession(preset.id);
  (await cookies()).set(SESSION_COOKIE_NAME, session.token, {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: session.maxAge,
  });

  redirect("/admin");
}
