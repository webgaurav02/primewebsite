import { describe, test, expect, beforeEach, afterAll, vi } from "vitest";

/**
 * The admin users surface reads self-serve registration data: the list carries
 * registrant type, and the detail view surfaces the full identity (incl.
 * decrypted mobile) plus the conditional business + impact block.
 */

const SUPER = { id: "aa000000-0000-4000-8000-0000000000e1", email: "super@x", name: "Super", role: "super_admin" as const, regions: null };

vi.mock("@/lib/auth/session", () => ({
  requireAdmin: async () => SUPER,
  getCurrentAdmin: async () => SUPER,
}));

import { registerUser } from "@/lib/dal/auth";
import { listUsers, getUserDetail, getUserBreakdown } from "@/lib/dal/users";
import { getSql } from "@/lib/db/client";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";

const meta = { ip: "10.0.0.9", userAgent: "vitest" };
const PW = "correct-horse-8";

const base = (email: string, over: Record<string, unknown> = {}) => ({
  registrantType: "student", fullName: "Detail Person", email, password: PW, confirmPassword: PW,
  gender: "female", dateOfBirth: "1992-02-02", mobile: "9876511111",
  preferredLanguage: "English", district: "East Khasi Hills", howHeard: "Social media", consent: true, ...over,
});

async function idFor(email: string): Promise<string> {
  const [u] = await migratorSql`SELECT id FROM app_user WHERE email=${email}`;
  return u.id as string;
}

beforeEach(async () => {
  await truncateAll();
});
afterAll(async () => {
  await getSql().end();
  await closeDb();
});

describe("admin user list", () => {
  test("carries registrant type", async () => {
    await registerUser(base("mentor@x.com", { registrantType: "mentor" }), meta);
    const { rows } = await listUsers();
    const row = rows.find((r) => r.email === "mentor@x.com");
    expect(row?.registrantType).toBe("mentor");
  });

  test("filters by registrant type and district; total reflects the filter", async () => {
    await registerUser(base("mentor2@x.com", { registrantType: "mentor" }), meta);
    await registerUser(base("stud2@x.com", { registrantType: "student", district: "West Garo Hills" }), meta);

    const mentors = await listUsers({ registrantType: "mentor" });
    expect(mentors.total).toBe(1);
    expect(mentors.rows[0].email).toBe("mentor2@x.com");

    const garo = await listUsers({ district: "West Garo Hills" });
    expect(garo.total).toBe(1);
    expect(garo.rows[0].email).toBe("stud2@x.com");
  });

  test("paginates with a stable total", async () => {
    await registerUser(base("a@x.com"), meta);
    await registerUser(base("b@x.com"), meta);
    await registerUser(base("c@x.com"), meta);

    const page1 = await listUsers({ limit: 2, offset: 0 });
    const page2 = await listUsers({ limit: 2, offset: 2 });
    expect(page1.rows.length).toBe(2);
    expect(page2.rows.length).toBe(1);
    expect(page1.total).toBe(3);
    expect(page2.total).toBe(3);
  });

  test("breakdown counts registrants by type", async () => {
    await registerUser(base("m1@x.com", { registrantType: "mentor" }), meta);
    await registerUser(base("s1@x.com"), meta);
    await registerUser(base("s2@x.com"), meta);

    const b = await getUserBreakdown();
    expect(b.total).toBe(3);
    expect(b.byType.find((t) => t.registrantType === "student")?.count).toBe(2);
    expect(b.byType.find((t) => t.registrantType === "mentor")?.count).toBe(1);
  });
});

describe("admin user detail", () => {
  test("surfaces identity + decrypted mobile; no business block for a student", async () => {
    await registerUser(base("stud@x.com"), meta);
    const d = await getUserDetail(await idFor("stud@x.com"));
    expect(d).not.toBeNull();
    expect(d!.registrantType).toBe("student");
    expect(d!.mobile).toBe("9876511111"); // decrypted for the admin
    expect(d!.preferredLanguage).toBe("English");
    expect(d!.dateOfBirth).toBe("1992-02-02");
    expect(d!.business).toBeNull();
  });

  test("surfaces the conditional business + impact block for an existing-business entrepreneur", async () => {
    await registerUser(
      base("founder@x.com", {
        registrantType: "entrepreneur_existing", businessName: "Detail Farms",
        sector: "agriculture-horticulture", entityType: "Pvt. Ltd", stage: "In Revenue",
        description: "We grow greens.", products: "Lettuce", turnover: "1000000",
      }),
      meta,
    );
    const d = await getUserDetail(await idFor("founder@x.com"));
    expect(d!.business).not.toBeNull();
    expect(d!.business!.businessName).toBe("Detail Farms");
    expect(d!.business!.turnover).toBe(1000000);
    expect(d!.business!.sector).toMatch(/Agriculture/);
  });

  test("returns null for a non-existent id", async () => {
    expect(await getUserDetail("aa000000-0000-4000-8000-0000000000ff")).toBeNull();
  });
});
