"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createDevSessionToken } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth/cookie";
import { REGIONS, type Region, type Role } from "@/lib/auth/rbac";

/**
 * DEV-ONLY login. Lets you assume a role/region locally to exercise RBAC, the
 * DAL, and the audit trail without a real identity provider. It hard-refuses in
 * production. Replace the whole login route with the Better Auth passkey flow
 * (see docs/admin-security.md §Auth) before going live.
 *
 * The preset ids are FIXED UUIDs matching the admin_user rows created by
 * db/seed-dev.ts — they must exist in the database, because grievance rows
 * reference them (assigned_to FK) and RLS region policies join admin_region
 * by these ids.
 */

const SUPER_ADMIN = {
  id: "11111111-1111-4111-8111-111111111111",
  email: "super@primemeghalaya.com",
  name: "Super Admin",
};
const AUDITOR = {
  id: "22222222-2222-4222-8222-222222222222",
  email: "auditor@primemeghalaya.com",
  name: "Auditor",
};
/** One seeded officer per region so RLS region scoping is real in dev. */
const OFFICERS: Record<Region, { id: string; email: string; name: string }> = {
  khasi_jaintia: {
    id: "33333333-3333-4333-8333-333333333301",
    email: "officer.kj@primemeghalaya.com",
    name: "Grievance Officer (Khasi-Jaintia)",
  },
  garo: {
    id: "33333333-3333-4333-8333-333333333302",
    email: "officer.gh@primemeghalaya.com",
    name: "Grievance Officer (Garo)",
  },
  ri_bhoi: {
    id: "33333333-3333-4333-8333-333333333303",
    email: "officer.rb@primemeghalaya.com",
    name: "Grievance Officer (Ri-Bhoi)",
  },
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

  let preset: { id: string; email: string; name: string };
  let regions: Region[] | null;
  switch (role) {
    case "grievance_officer":
      preset = OFFICERS[region];
      regions = [region];
      break;
    case "auditor":
      preset = AUDITOR;
      regions = null;
      break;
    default:
      preset = SUPER_ADMIN;
      regions = null;
      break;
  }

  const token = createDevSessionToken({
    sub: preset.id,
    email: preset.email,
    name: preset.name,
    role: role === "grievance_officer" || role === "auditor" ? role : "super_admin",
    regions,
  });
  (await cookies()).set(SESSION_COOKIE_NAME, token.value, token.options);

  redirect("/admin");
}
