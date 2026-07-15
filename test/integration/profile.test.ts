import { describe, test, expect, beforeEach, afterAll, vi } from "vitest";

/**
 * Self-serve profile editing through the real DAL + Postgres RLS. A member edits
 * their own identity + business; a member with no business can add one (owner
 * INSERT policies from 0018); RLS keeps edits scoped to the caller's own rows.
 */

const MEMBER = {
  id: "80000000-0000-4000-8000-0000000000a1",
  email: "member@example.com",
  fullName: "Bah Niaw",
  persona: null as null,
  registrantType: "student" as const,
  status: "active" as const,
  emailVerified: true,
  district: "East Khasi Hills",
};
const OTHER = { ...MEMBER, id: "80000000-0000-4000-8000-0000000000b2", email: "other@example.com", fullName: "Other Member" };

const state = vi.hoisted(() => ({ user: null as unknown }));
vi.mock("@/lib/auth/user-session", () => ({
  requireUser: async () => state.user,
  getCurrentUser: async () => state.user,
}));

import { getMyEditableProfile, updateMyProfile, getMyProfile } from "@/lib/dal/profile";
import { getSql } from "@/lib/db/client";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";
import { decryptPII } from "@/lib/crypto/pii";

const identity = {
  fullName: "Bah Niaw",
  mobile: "9876500011",
  gender: "male",
  preferredLanguage: "English",
  district: "East Khasi Hills",
};
const business = {
  businessName: "Khasi Weaves",
  sector: "handicrafts",
  entityType: "LLP",
  stage: "In Revenue",
  description: "Handloom weaving cooperative.",
  products: "Stoles, shawls",
  turnover: "500000",
  govtFunding: "200000",
  externalFunding: "0",
  employment: "5",
  livesImpacted: "40",
};

beforeEach(async () => {
  await truncateAll();
  state.user = MEMBER;
  for (const u of [MEMBER, OTHER]) {
    await migratorSql`INSERT INTO app_user (id, email, full_name, registrant_type, status, source)
      VALUES (${u.id}, ${u.email}, ${u.fullName}, 'student', 'active', 'public')`;
  }
});

afterAll(async () => {
  vi.restoreAllMocks();
  await getSql().end();
  await closeDb();
});

describe("identity editing", () => {
  test("updates name, mobile (encrypted), language and district", async () => {
    const res = await updateMyProfile({ ...identity, fullName: "Bah Nianglang", mobile: "9876500099", district: "Ri-Bhoi" });
    expect(res.ok).toBe(true);

    const [u] = await migratorSql`SELECT full_name, district, mobile_enc FROM app_user WHERE id = ${MEMBER.id}`;
    expect(u.full_name).toBe("Bah Nianglang");
    expect(u.district).toBe("Ri-Bhoi");
    expect(decryptPII(u.mobile_enc)).toBe("9876500099");

    const editable = await getMyEditableProfile();
    expect(editable.fullName).toBe("Bah Nianglang");
    expect(editable.mobile).toBe("9876500099");
  });
});

describe("adding a business (no prior profile)", () => {
  test("creates the entrepreneur_profile + organisation, linked, financials as numbers", async () => {
    const res = await updateMyProfile({ ...identity, ...business });
    expect(res.ok).toBe(true);

    const [prof] = await migratorSql`
      SELECT business_name, sector, turnover, govt_funding, lives_impacted
      FROM entrepreneur_profile WHERE user_id = ${MEMBER.id}`;
    expect(prof.business_name).toBe("Khasi Weaves");
    expect(prof.sector).toBe("Handicrafts");        // stored as the label
    expect(Number(prof.turnover)).toBe(500000);      // bigint whole rupees
    expect(Number(prof.govt_funding)).toBe(200000);
    expect(prof.lives_impacted).toBe(40);

    const [u] = await migratorSql`SELECT organization_id FROM app_user WHERE id = ${MEMBER.id}`;
    expect(u.organization_id).not.toBeNull();
    const [org] = await migratorSql`SELECT name, created_by, turnover FROM organization WHERE id = ${u.organization_id}`;
    expect(org.name).toBe("Khasi Weaves");
    expect(org.created_by).toBe(MEMBER.id);
    expect(Number(org.turnover)).toBe(500000);

    // The dashboard read reflects it, sector reverse-mapped to a key for the editor.
    const editable = await getMyEditableProfile();
    expect(editable.business?.sector).toBe("handicrafts");
    const dash = await getMyProfile();
    expect(dash.business?.turnover).toBe(500000);
  });
});

describe("updating an existing business", () => {
  test("changes financials in place (no duplicate rows)", async () => {
    await updateMyProfile({ ...identity, ...business });
    const res = await updateMyProfile({ ...identity, ...business, turnover: "750000", employment: "8" });
    expect(res.ok).toBe(true);

    const rows = await migratorSql`SELECT turnover, employment_count FROM entrepreneur_profile WHERE user_id = ${MEMBER.id}`;
    expect(rows.length).toBe(1);
    expect(Number(rows[0].turnover)).toBe(750000);
    expect(rows[0].employment_count).toBe(8);
  });
});

describe("validation + isolation", () => {
  test("a business name without the required fields is rejected", async () => {
    const res = await updateMyProfile({ ...identity, businessName: "Nameless Co" });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.fieldErrors.sector || res.fieldErrors.entityType || res.fieldErrors.description).toBeTruthy();
    }
  });

  test("editing as one member never touches another member's row", async () => {
    await updateMyProfile({ ...identity, fullName: "Renamed Self" });
    const [other] = await migratorSql`SELECT full_name FROM app_user WHERE id = ${OTHER.id}`;
    expect(other.full_name).toBe("Other Member");
  });
});
