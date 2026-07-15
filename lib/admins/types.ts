/**
 * Pure types + validation for the admin-directory console (Phase A1). No
 * server-only, no I/O — safe to unit-test and to import from client chrome.
 *
 * NOTE: this manages the admin DIRECTORY (who is an admin, their role, region
 * scope, and active flag). Sign-in is email + password (lib/dal/admin-auth.ts):
 * a `password` on create, or `setAdminPassword` later, grants login. Leaving the
 * password blank provisions a directory-only record (region scoping, grievance
 * assignment, audit identity) that can be given a password afterwards.
 */

import { z } from "zod";
import { REGIONS, type Region, type Role } from "@/lib/auth/rbac";

export const ADMIN_ROLE_OPTIONS: { value: Role; label: string; blurb: string }[] = [
  {
    value: "super_admin",
    label: "Super Admin",
    blurb: "Full access to every module, all regions, and admin management.",
  },
  {
    value: "grievance_officer",
    label: "Grievance Officer",
    blurb: "Manages users, programs, PRIME IDs and the grievances of their region(s).",
  },
  {
    value: "auditor",
    label: "Auditor",
    blurb: "Read-only oversight of grievances and the audit log. No PII, no writes.",
  },
];

export const ADMIN_ROLE_LABELS: Record<Role, string> = Object.fromEntries(
  ADMIN_ROLE_OPTIONS.map((r) => [r.value, r.label]),
) as Record<Role, string>;

export const REGION_LABELS: Record<Region, string> = {
  khasi_jaintia: "Khasi / Jaintia Hills",
  garo: "Garo Hills",
  ri_bhoi: "Ri-Bhoi",
};

export const REGION_OPTIONS: { value: Region; label: string }[] = REGIONS.map(
  (r) => ({ value: r, label: REGION_LABELS[r] }),
);

/** Only grievance officers carry explicit regions; the others are all-region. */
export function roleOwnsRegions(role: Role): boolean {
  return role === "grievance_officer";
}

/** Normalise regions against the role — officers keep theirs, others get none. */
export function normaliseRegions(role: Role, regions: Region[]): Region[] {
  return roleOwnsRegions(role) ? [...new Set(regions)] : [];
}

const roleSchema = z.enum(["super_admin", "grievance_officer", "auditor"]);
const regionsSchema = z
  .array(z.enum(REGIONS as [Region, ...Region[]]))
  .default([]);

/** A required admin password (set/reset from the console). */
const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(200, "That password is too long.");

/** Optional initial password on create — empty means "no sign-in yet". */
const optionalPasswordSchema = z
  .string()
  .max(200, "That password is too long.")
  .refine((v) => v.length === 0 || v.length >= 8, "Use at least 8 characters.")
  .optional()
  .default("");

const officerNeedsRegion = (val: { role: Role; regions: Region[] }) =>
  !roleOwnsRegions(val.role) || val.regions.length > 0;
const officerRegionIssue = {
  message: "A grievance officer needs at least one region.",
  path: ["regions"],
};

export const createAdminSchema = z
  .object({
    email: z.email("Enter a valid email.").max(254),
    name: z.string().trim().min(2, "Name is required.").max(120),
    role: roleSchema,
    regions: regionsSchema,
    // Optional: sets an initial sign-in password. Empty = directory record only.
    password: optionalPasswordSchema,
  })
  .refine(officerNeedsRegion, officerRegionIssue);

export const updateAdminSchema = z
  .object({
    adminId: z.string().uuid(),
    name: z.string().trim().min(2, "Name is required.").max(120),
    role: roleSchema,
    regions: regionsSchema,
  })
  .refine(officerNeedsRegion, officerRegionIssue);

export const setAdminActiveSchema = z.object({
  adminId: z.string().uuid(),
  isActive: z.boolean(),
});

export const setAdminPasswordSchema = z.object({
  adminId: z.string().uuid(),
  password: passwordSchema,
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
