import { describe, test, expect } from "vitest";
import {
  can,
  canAccessRegion,
  assertCan,
  assertRegion,
  AuthorizationError,
  type AdminUser,
} from "@/lib/auth/rbac";

const superAdmin: AdminUser = {
  id: "s",
  email: "s@x",
  name: "Super",
  role: "super_admin",
  regions: null,
};
const officer: AdminUser = {
  id: "o",
  email: "o@x",
  name: "Officer",
  role: "grievance_officer",
  regions: ["garo"],
};
const auditor: AdminUser = {
  id: "a",
  email: "a@x",
  name: "Auditor",
  role: "auditor",
  regions: null,
};

describe("RBAC permission matrix", () => {
  test("super_admin has every management permission", () => {
    for (const p of [
      "grievance:read_pii",
      "grievance:delete",
      "admin:manage",
      "prime_id:review",
      "user:manage",
      "org:manage",
      "program:manage",
      "mentorship:manage",
      "document:verify",
      "event:publish",
      "import:run",
    ] as const) {
      expect(can(superAdmin, p)).toBe(true);
    }
  });

  test("grievance_officer can operate but not manage admins/delete/import", () => {
    expect(can(officer, "grievance:update_status")).toBe(true);
    expect(can(officer, "prime_id:review")).toBe(true);
    expect(can(officer, "document:verify")).toBe(true);
    expect(can(officer, "admin:manage")).toBe(false);
    expect(can(officer, "grievance:delete")).toBe(false);
    expect(can(officer, "import:run")).toBe(false);
  });

  test("auditor is read-only and PII-blind", () => {
    expect(can(auditor, "grievance:read")).toBe(true);
    expect(can(auditor, "audit:read")).toBe(true);
    expect(can(auditor, "grievance:read_pii")).toBe(false);
    expect(can(auditor, "grievance:update_status")).toBe(false);
    expect(can(auditor, "user:manage")).toBe(false);
  });
});

describe("region scoping (IDOR guard)", () => {
  test("null regions means all-region access", () => {
    expect(canAccessRegion(superAdmin, "garo")).toBe(true);
    expect(canAccessRegion(superAdmin, "khasi_jaintia")).toBe(true);
  });

  test("scoped officer only reaches owned regions", () => {
    expect(canAccessRegion(officer, "garo")).toBe(true);
    expect(canAccessRegion(officer, "khasi_jaintia")).toBe(false);
    expect(canAccessRegion(officer, "ri_bhoi")).toBe(false);
  });

  test("assertRegion throws AuthorizationError out of scope", () => {
    expect(() => assertRegion(officer, "garo")).not.toThrow();
    expect(() => assertRegion(officer, "ri_bhoi")).toThrow(AuthorizationError);
  });

  test("assertCan throws when the permission is absent", () => {
    expect(() => assertCan(auditor, "grievance:read")).not.toThrow();
    expect(() => assertCan(auditor, "grievance:update_status")).toThrow(
      AuthorizationError,
    );
  });
});
