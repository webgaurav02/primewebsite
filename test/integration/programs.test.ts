import { describe, test, expect, beforeEach, afterAll, vi } from "vitest";

/**
 * Program apply → review lifecycle through the real DAL + Postgres RLS.
 * requireUser / requireAdmin are backed by mutable hoisted state so a single
 * test can act as different people (applicant, another member, admin).
 */

const APPLICANT = {
  id: "70000000-0000-4000-8000-0000000000a1",
  email: "applicant@example.com",
  fullName: "Applicant One",
  persona: "entrepreneur" as const,
  status: "active" as const,
  emailVerified: true,
  district: "East Khasi Hills",
};
const OTHER = { ...APPLICANT, id: "70000000-0000-4000-8000-0000000000b2", email: "other@example.com", fullName: "Other Member" };
const SUPER = { id: "70000000-0000-4000-8000-0000000000e9", email: "super@x", name: "Super", role: "super_admin" as const, regions: null };

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
  withdrawApplication,
  getMyApplications,
  reviewApplication,
  listApplications,
} from "@/lib/dal/programs";
import { getMyNotifications } from "@/lib/dal/events";
import { getSql } from "@/lib/db/client";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";

let openCycleId = "";
let closedCycleId = "";

beforeEach(async () => {
  await truncateAll();
  state.user = APPLICANT;
  state.admin = SUPER;
  for (const u of [APPLICANT, OTHER]) {
    await migratorSql`INSERT INTO app_user (id, email, full_name, persona, status)
      VALUES (${u.id}, ${u.email}, ${u.fullName}, 'entrepreneur', 'active')`;
  }
  await migratorSql`INSERT INTO admin_user (id, email, name, role)
    VALUES (${SUPER.id}, ${SUPER.email}, ${SUPER.name}, 'super_admin')`;

  const [prog] = await migratorSql`SELECT id FROM program WHERE slug = 'incubation'`;
  const [openC] = await migratorSql`
    INSERT INTO program_cycle (program_id, label, status) VALUES (${prog.id}, '2026 Cohort', 'open') RETURNING id`;
  const [closedC] = await migratorSql`
    INSERT INTO program_cycle (program_id, label, status) VALUES (${prog.id}, '2025 Closed', 'closed') RETURNING id`;
  openCycleId = openC.id;
  closedCycleId = closedC.id;
});

afterAll(async () => {
  vi.restoreAllMocks();
  await getSql().end();
  await closeDb();
});

const answers = { summary: "A rural agri-tech venture in the Khasi hills.", objective: "Seed funding and mentorship." };

describe("member applies to a program", () => {
  test("apply → submitted, appears in my applications, notifies me", async () => {
    const res = await applyToProgram({ cycleId: openCycleId, ...answers });
    expect(res.ok).toBe(true);

    const mine = await getMyApplications();
    expect(mine.length).toBe(1);
    expect(mine[0].status).toBe("submitted");
    expect(mine[0].programName).toMatch(/Incubation/);

    const notifs = await getMyNotifications();
    expect(notifs.items.some((n) => n.type === "application.submitted")).toBe(true);
  });

  test("can't apply twice to the same cycle", async () => {
    expect((await applyToProgram({ cycleId: openCycleId, ...answers })).ok).toBe(true);
    const dup = await applyToProgram({ cycleId: openCycleId, ...answers });
    expect(dup.ok).toBe(false);
    if (!dup.ok) expect(dup.error).toMatch(/already applied/i);
  });

  test("can't apply to a closed cycle", async () => {
    const res = await applyToProgram({ cycleId: closedCycleId, ...answers });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toMatch(/closed/i);
  });

  test("validation rejects a too-short summary", async () => {
    const res = await applyToProgram({ cycleId: openCycleId, summary: "too short", objective: answers.objective });
    expect(res.ok).toBe(false);
  });
});

describe("withdraw", () => {
  test("a submitted application can be withdrawn", async () => {
    await applyToProgram({ cycleId: openCycleId, ...answers });
    const [mine] = await getMyApplications();
    const res = await withdrawApplication(mine.id);
    expect(res.ok).toBe(true);
    expect((await getMyApplications())[0].status).toBe("withdrawn");
  });

  test("an approved application cannot be withdrawn", async () => {
    await applyToProgram({ cycleId: openCycleId, ...answers });
    const [mine] = await getMyApplications();
    await reviewApplication({ applicationId: mine.id, status: "approved", note: "" });
    const res = await withdrawApplication(mine.id);
    expect(res.ok).toBe(false);
  });
});

describe("admin review", () => {
  test("reviewing sets status and notifies the applicant", async () => {
    await applyToProgram({ cycleId: openCycleId, ...answers });
    const { rows: [app] } = await listApplications();
    expect(app.applicantName).toBe("Applicant One");
    expect(app.userId).toBe(APPLICANT.id); // applications link back to the user

    const res = await reviewApplication({ applicationId: app.id, status: "shortlisted", note: "Strong fit." });
    expect(res.ok).toBe(true);

    // Applicant sees the decision + a notification.
    expect((await getMyApplications())[0].status).toBe("shortlisted");
    const notifs = await getMyNotifications();
    expect(notifs.items.some((n) => n.type === "application.status_changed")).toBe(true);
  });
});

describe("RLS scoping of applications", () => {
  test("a member sees only their own applications", async () => {
    await applyToProgram({ cycleId: openCycleId, ...answers });

    state.user = OTHER;
    expect((await getMyApplications()).length).toBe(0);

    state.user = APPLICANT;
    expect((await getMyApplications()).length).toBe(1);
  });
});
