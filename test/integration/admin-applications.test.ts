import { describe, test, expect, beforeEach, afterAll, vi } from "vitest";

/**
 * Admin application management: the "who registered for what" surface.
 * Covers listApplications filters (status / program / user / q) + pagination,
 * the per-status + per-program stats, the application detail (answers +
 * review info), and the per-user application list for the user-detail page.
 */

const ALICE = {
  id: "80000000-0000-4000-8000-0000000000a1",
  email: "alice@example.com",
  fullName: "Alice Kharkongor",
  persona: "entrepreneur" as const,
  status: "active" as const,
  emailVerified: true,
  district: "East Khasi Hills",
};
const BOB = { ...ALICE, id: "80000000-0000-4000-8000-0000000000b2", email: "bob@example.com", fullName: "Bob Marak", district: "West Garo Hills" };
const SUPER = { id: "80000000-0000-4000-8000-0000000000e9", email: "super@x", name: "Super", role: "super_admin" as const, regions: null };
const OFFICER = { id: "80000000-0000-4000-8000-0000000000f0", email: "officer@x", name: "Officer", role: "grievance_officer" as const, regions: null };

const state = vi.hoisted(() => ({ user: null as unknown, admin: null as unknown }));
vi.mock("@/lib/auth/user-session", () => ({
  requireUser: async () => state.user,
  getCurrentUser: async () => state.user,
}));
vi.mock("@/lib/auth/session", () => ({
  requireAdmin: async () => state.admin,
  getCurrentAdmin: async () => state.admin,
}));

import {
  applyToProgram,
  listApplications,
  getApplicationStats,
  getApplicationDetail,
  listUserApplications,
  reviewApplication,
} from "@/lib/dal/programs";
import { getSql } from "@/lib/db/client";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";

let incubationCycleId = "";
let elevateCycleId = "";
let incubationProgramId = "";

beforeEach(async () => {
  await truncateAll();
  state.user = ALICE;
  state.admin = SUPER;
  for (const u of [ALICE, BOB]) {
    await migratorSql`
      INSERT INTO app_user (id, email, full_name, persona, registrant_type, district, status)
      VALUES (${u.id}, ${u.email}, ${u.fullName}, 'entrepreneur', 'aspiring_entrepreneur',
              ${u.district}, 'active')`;
  }
  await migratorSql`INSERT INTO admin_user (id, email, name, role)
    VALUES (${SUPER.id}, ${SUPER.email}, ${SUPER.name}, 'super_admin')`;
  await migratorSql`INSERT INTO admin_user (id, email, name, role)
    VALUES (${OFFICER.id}, ${OFFICER.email}, ${OFFICER.name}, 'grievance_officer')`;

  const [inc] = await migratorSql`SELECT id FROM program WHERE slug = 'incubation'`;
  const [ele] = await migratorSql`SELECT id FROM program WHERE slug = 'cm-elevate'`;
  incubationProgramId = inc.id;
  const [c1] = await migratorSql`
    INSERT INTO program_cycle (program_id, label, status) VALUES (${inc.id}, '2026 Cohort', 'open') RETURNING id`;
  const [c2] = await migratorSql`
    INSERT INTO program_cycle (program_id, label, status) VALUES (${ele.id}, '2026 Intake', 'open') RETURNING id`;
  incubationCycleId = c1.id;
  elevateCycleId = c2.id;
});

afterAll(async () => {
  vi.restoreAllMocks();
  await getSql().end();
  await closeDb();
});

const answers = { summary: "A rural agri-tech venture in the Khasi hills.", objective: "Seed funding and mentorship." };

/** Alice applies to both programs; Bob applies to incubation only. */
async function seedApplications() {
  state.user = ALICE;
  await applyToProgram({ cycleId: incubationCycleId, ...answers });
  await applyToProgram({ cycleId: elevateCycleId, ...answers });
  state.user = BOB;
  await applyToProgram({ cycleId: incubationCycleId, ...answers });
}

describe("listApplications — who registered for what", () => {
  test("rows carry the applicant identity (id, email, type, district)", async () => {
    await seedApplications();
    const { rows, total } = await listApplications();
    expect(total).toBe(3);
    const bob = rows.find((r) => r.applicantEmail === "bob@example.com");
    expect(bob?.userId).toBe(BOB.id);
    expect(bob?.registrantType).toBe("aspiring_entrepreneur");
    expect(bob?.district).toBe("West Garo Hills");
    expect(bob?.programName).toMatch(/Incubation/i);
  });

  test("filters by program, by user, and by applicant search", async () => {
    await seedApplications();

    const inc = await listApplications({ programId: incubationProgramId });
    expect(inc.total).toBe(2);
    expect(inc.rows.every((r) => r.programId === incubationProgramId)).toBe(true);

    const alices = await listApplications({ userId: ALICE.id });
    expect(alices.total).toBe(2);
    expect(alices.rows.every((r) => r.userId === ALICE.id)).toBe(true);

    const byName = await listApplications({ q: "marak" });
    expect(byName.total).toBe(1);
    expect(byName.rows[0].applicantName).toBe("Bob Marak");
  });

  test("filters by status and paginates with a stable total", async () => {
    await seedApplications();
    const { rows: [first] } = await listApplications({ userId: ALICE.id });
    await reviewApplication({ applicationId: first.id, status: "shortlisted", note: "" });

    const shortlisted = await listApplications({ status: "shortlisted" });
    expect(shortlisted.total).toBe(1);

    const page1 = await listApplications({ limit: 2, offset: 0 });
    const page2 = await listApplications({ limit: 2, offset: 2 });
    expect(page1.rows.length).toBe(2);
    expect(page2.rows.length).toBe(1);
    expect(page1.total).toBe(3);
    expect(page2.total).toBe(3);
  });

  test("an offset past the last row still reports the true total (stale ?page= URL)", async () => {
    await seedApplications();
    const past = await listApplications({ limit: 50, offset: 100 });
    expect(past.rows.length).toBe(0);
    expect(past.total).toBe(3); // NOT 0 — the pagination UI must not vanish
  });

  test("a grievance_officer (staff, not super_admin) sees applications through RLS", async () => {
    await seedApplications();
    state.admin = OFFICER;
    const { total } = await listApplications();
    expect(total).toBe(3); // admin_is_staff() must keep covering grievance_officer
    const stats = await getApplicationStats();
    expect(stats.total).toBe(3);
  });
});

describe("getApplicationStats", () => {
  test("counts by status and by program", async () => {
    await seedApplications();
    const { rows: [one] } = await listApplications({ userId: ALICE.id, programId: incubationProgramId });
    await reviewApplication({ applicationId: one.id, status: "approved", note: "Welcome!" });

    const stats = await getApplicationStats();
    expect(stats.total).toBe(3);
    expect(stats.byStatus.submitted).toBe(2);
    expect(stats.byStatus.approved).toBe(1);

    const inc = stats.byProgram.find((p) => p.programId === incubationProgramId);
    expect(inc?.total).toBe(2);
    expect(inc?.pending).toBe(1); // Bob's is still submitted; Alice's was approved
  });
});

describe("getApplicationDetail", () => {
  test("carries answers, applicant identity, and the review trail", async () => {
    await seedApplications();
    const { rows: [app] } = await listApplications({ userId: ALICE.id, programId: incubationProgramId });
    await reviewApplication({ applicationId: app.id, status: "shortlisted", note: "Strong fit." });

    const d = await getApplicationDetail(app.id);
    expect(d).not.toBeNull();
    expect(d!.applicantEmail).toBe("alice@example.com");
    expect(d!.answers.summary).toMatch(/agri-tech/);
    expect(d!.status).toBe("shortlisted");
    expect(d!.decisionNote).toBe("Strong fit.");
    expect(d!.reviewedByName).toBe("Super");
    expect(d!.reviewedAt).not.toBeNull();
  });

  test("returns null for an unknown or malformed id", async () => {
    expect(await getApplicationDetail("80000000-0000-4000-8000-0000000000ff")).toBeNull();
    expect(await getApplicationDetail("not-a-uuid")).toBeNull();
  });

  test("a note-less quick status change PRESERVES the saved decision note", async () => {
    await seedApplications();
    const { rows: [app] } = await listApplications({ userId: ALICE.id, programId: incubationProgramId });
    await reviewApplication({ applicationId: app.id, status: "shortlisted", note: "Strong fit." });
    // The list page's quick form posts status only (note "") — must not wipe the note.
    await reviewApplication({ applicationId: app.id, status: "approved", note: "" });

    const d = await getApplicationDetail(app.id);
    expect(d!.status).toBe("approved");
    expect(d!.decisionNote).toBe("Strong fit.");

    // A new non-empty note still overwrites.
    await reviewApplication({ applicationId: app.id, status: "approved", note: "Final: welcome aboard." });
    expect((await getApplicationDetail(app.id))!.decisionNote).toBe("Final: welcome aboard.");
  });
});

describe("listUserApplications", () => {
  test("lists one user's applications for the admin user page", async () => {
    await seedApplications();
    const apps = await listUserApplications(ALICE.id);
    expect(apps.length).toBe(2);
    expect(apps.map((a) => a.programName).sort().join()).toMatch(/Elevate.*Incubation|Incubation.*Elevate/i);

    expect(await listUserApplications(BOB.id)).toHaveLength(1);
    expect(await listUserApplications("not-a-uuid")).toEqual([]);
  });
});
