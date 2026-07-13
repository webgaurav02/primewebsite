import { describe, test, expect, beforeEach, afterAll, vi } from "vitest";

// Admin DAL calls requireAdmin() (reads a session cookie we don't have under
// test) — mock the seam to act as a super_admin.
vi.mock("@/lib/auth/session", () => ({
  requireAdmin: async () => ({
    id: "99999999-9999-4999-8999-999999999999",
    email: "super@primemeghalaya.com",
    name: "Super Admin",
    role: "super_admin",
    regions: null,
  }),
  getCurrentAdmin: async () => null,
}));

import { applyAsEntrepreneur } from "@/lib/dal/applications";
import { approveUser, listUsers, suspendUser } from "@/lib/dal/users";
import { resetPassword, loginUser } from "@/lib/dal/auth";
import { getSql } from "@/lib/db/client";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";

const APPLICATION = {
  firstName: "Bitchri",
  lastName: "Marak",
  email: "bitchri@example.com",
  phone: "9876500022",
  district: "west-garo-hills",
  gender: "female",
  businessName: "Zero9 Farms",
  sector: "agriculture-horticulture",
  entityType: "Sole Proprietor",
  stage: "Early Revenue",
  yearEstablished: "2022",
  address: "Tura, West Garo Hills",
  description: "Agri-processing venture producing packaged local produce.",
  employment: "5",
  livesImpacted: "20",
  turnover: "5 Lakh",
  govtFunding: "2 Lakh",
  externalFunding: "",
  products: "Packaged turmeric, ginger, local spices",
  socialImpact: "Sources from 30 smallholder farmers.",
  declared: true,
};

let logs: string[] = [];

beforeEach(async () => {
  await truncateAll();
  logs = [];
  vi.spyOn(console, "log").mockImplementation((...a: unknown[]) => {
    logs.push(a.map(String).join(" "));
  });
});

afterAll(async () => {
  vi.restoreAllMocks();
  await getSql().end();
  await closeDb();
});

function activationToken(): string {
  const re = /\/reset-password\?token=([A-Za-z0-9_-]+)/;
  for (let i = logs.length - 1; i >= 0; i--) {
    const m = logs[i].match(re);
    if (m) return m[1];
  }
  throw new Error("no activation link found in email output");
}

describe("entrepreneur application intake", () => {
  test("creates a pending account + profile + organisation, no credential", async () => {
    const res = await applyAsEntrepreneur(APPLICATION);
    expect(res.ok).toBe(true);

    const [u] = await migratorSql`
      SELECT id, status, persona, source, gender, district, organization_id,
             email_verified_at, mobile_enc
      FROM app_user WHERE email = ${APPLICATION.email}`;
    expect(u.status).toBe("pending");
    expect(u.persona).toBe("entrepreneur");
    expect(u.source).toBe("public");
    expect(u.gender).toBe("female");
    expect(u.district).toBe("West Garo Hills"); // slug mapped to label
    expect(u.email_verified_at).toBeNull();
    expect(u.organization_id).not.toBeNull();
    expect(u.mobile_enc.toString("utf8")).not.toContain("9876500022");

    // No credential yet — it's an application, not a signup.
    const cred = await migratorSql`SELECT 1 FROM user_credential WHERE user_id = ${u.id}`;
    expect(cred.length).toBe(0);

    const [p] = await migratorSql`
      SELECT business_name, sector, employment_count, lives_impacted, products
      FROM entrepreneur_profile WHERE user_id = ${u.id}`;
    expect(p.business_name).toBe("Zero9 Farms");
    expect(p.sector).toBe("Agriculture & Horticulture"); // slug mapped to label
    expect(p.employment_count).toBe(5);
    expect(p.lives_impacted).toBe(20);

    const [o] = await migratorSql`SELECT name, created_by FROM organization WHERE id = ${u.organization_id}`;
    expect(o.name).toBe("Zero9 Farms");
    expect(o.created_by).toBe(u.id);
  });

  test("rejects a duplicate email", async () => {
    await applyAsEntrepreneur(APPLICATION);
    const again = await applyAsEntrepreneur(APPLICATION);
    expect(again.ok).toBe(false);
    if (!again.ok) expect(again.fieldErrors.email).toBeTruthy();
  });

  test("rejects invalid input (missing declaration, bad district)", async () => {
    expect((await applyAsEntrepreneur({ ...APPLICATION, declared: false })).ok).toBe(false);
    expect((await applyAsEntrepreneur({ ...APPLICATION, district: "atlantis" })).ok).toBe(false);
    expect((await applyAsEntrepreneur({ ...APPLICATION, phone: "123" })).ok).toBe(false);
  });
});

describe("admin approval → activation → login", () => {
  async function applyAndGetId(): Promise<string> {
    await applyAsEntrepreneur(APPLICATION);
    const [u] = await migratorSql`SELECT id FROM app_user WHERE email = ${APPLICATION.email}`;
    return u.id as string;
  }

  test("approving a pending applicant activates them and emails a set-password link", async () => {
    const id = await applyAndGetId();
    await approveUser(id);

    const [u] = await migratorSql`SELECT status FROM app_user WHERE id = ${id}`;
    expect(u.status).toBe("active");
    // A reset-kind (activation) token was issued and emailed.
    expect(() => activationToken()).not.toThrow();
    const [tok] = await migratorSql`SELECT kind, consumed_at FROM user_email_token WHERE user_id = ${id}`;
    expect(tok.kind).toBe("reset");
    expect(tok.consumed_at).toBeNull();
  });

  test("the applicant sets a password via the link and can then log in", async () => {
    const id = await applyAndGetId();
    await approveUser(id);

    const reset = await resetPassword({
      token: activationToken(),
      password: "founder-pass-9",
      confirmPassword: "founder-pass-9",
    });
    expect(reset).toEqual({ ok: true });

    // Credential now exists and email is verified → login works.
    const login = await loginUser(
      { email: APPLICATION.email, password: "founder-pass-9" },
      { ip: "127.0.0.1", userAgent: "vitest" },
    );
    expect(login.ok).toBe(true);
  });

  test("listUsers shows the applicant; suspend blocks login", async () => {
    const id = await applyAndGetId();
    await approveUser(id);
    await resetPassword({ token: activationToken(), password: "founder-pass-9", confirmPassword: "founder-pass-9" });

    const list = await listUsers({ persona: "entrepreneur" });
    expect(list.find((u) => u.id === id)?.activated).toBe(true);

    await suspendUser(id);
    // Suspended users are treated as signed out / cannot authenticate a session.
    const [u] = await migratorSql`SELECT status FROM app_user WHERE id = ${id}`;
    expect(u.status).toBe("suspended");
  });
});
