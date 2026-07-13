/**
 * Role-Based Access Control model for the admin portal.
 *
 * Pure types + a permission lookup. No I/O, no `server-only` — safe to import
 * anywhere on the server. Enforcement happens in the Data Access Layer, which
 * calls `can()` / `assertCan()` before every read or mutation.
 *
 * Regions mirror the three PRIME helpline zones so a grievance officer only ever
 * sees the complaints for the hills they're responsible for (row-level scoping).
 */

export type Region = "khasi_jaintia" | "garo" | "ri_bhoi";

export const REGIONS: Region[] = ["khasi_jaintia", "garo", "ri_bhoi"];

export type Role = "super_admin" | "grievance_officer" | "auditor";

export type Permission =
  | "grievance:read"
  | "grievance:read_pii" // see complainant contact details (not just redacted)
  | "grievance:update_status"
  | "grievance:assign"
  | "grievance:delete"
  | "audit:read"
  | "admin:manage" // create/disable admin accounts, change roles
  | "prime_id:issue" // generate/issue PRIME ID credentials
  | "prime_id:review" // approve/reject PRIME ID requests
  | "user:manage" // manage the unified user database (entrepreneurs/mentors/investors)
  | "org:manage" // manage organisations/ventures
  | "program:manage" // programs, cycles, application decisions
  | "mentorship:manage" // pair mentors↔mentees, issue certificates
  | "document:verify" // verify uploaded KYC/business documents
  | "event:publish" // publish public timeline events / announcements
  | "import:run"; // run the legacy-data importer

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    "grievance:read",
    "grievance:read_pii",
    "grievance:update_status",
    "grievance:assign",
    "grievance:delete",
    "audit:read",
    "admin:manage",
    "prime_id:issue",
    "prime_id:review",
    "user:manage",
    "org:manage",
    "program:manage",
    "mentorship:manage",
    "document:verify",
    "event:publish",
    "import:run",
  ],
  grievance_officer: [
    "grievance:read",
    "grievance:read_pii",
    "grievance:update_status",
    "grievance:assign",
    "prime_id:issue",
    "prime_id:review",
    "user:manage",
    "org:manage",
    "program:manage",
    "mentorship:manage",
    "document:verify",
    "event:publish",
  ],
  // Read-only oversight. Deliberately CANNOT see raw complainant PII or mutate.
  auditor: ["grievance:read", "audit:read"],
};

/**
 * The authenticated admin as the rest of the server code sees them. This is a
 * DTO — never the raw DB row, never tokens. Built by lib/auth/session.ts.
 */
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  /**
   * Regions this admin may act on. `null` means all regions (super_admin /
   * auditor oversight). A scoped officer carries the subset they own.
   */
  regions: Region[] | null;
}

export function can(user: AdminUser, permission: Permission): boolean {
  return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
}

/** Region-level authorization — the IDOR guard for grievance rows. */
export function canAccessRegion(user: AdminUser, region: Region): boolean {
  if (user.regions === null) return true; // all-region oversight
  return user.regions.includes(region);
}

export class AuthorizationError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function assertCan(user: AdminUser, permission: Permission): void {
  if (!can(user, permission)) {
    throw new AuthorizationError(
      `Role "${user.role}" lacks permission "${permission}"`,
    );
  }
}

export function assertRegion(user: AdminUser, region: Region): void {
  if (!canAccessRegion(user, region)) {
    throw new AuthorizationError(
      `Admin not authorized for region "${region}"`,
    );
  }
}
