import { describe, test, expect, beforeEach, afterAll, vi } from "vitest";

/**
 * Mentorship: admin pairing, session logging permissions, and the auto-issued
 * 5-hour (300-minute) certificate — all through the real DAL + RLS.
 */

const MENTOR = {
  id: "80000000-0000-4000-8000-0000000000a1",
  email: "mentor@example.com", fullName: "Mentor One",
  persona: "mentor" as const, status: "active" as const, emailVerified: true, district: null,
};
const MENTEE = {
  id: "80000000-0000-4000-8000-0000000000b2",
  email: "mentee@example.com", fullName: "Mentee One",
  persona: "entrepreneur" as const, status: "active" as const, emailVerified: true, district: null,
};
const OUTSIDER = { ...MENTEE, id: "80000000-0000-4000-8000-0000000000c3", email: "out@example.com", fullName: "Outsider" };
const SUPER = { id: "80000000-0000-4000-8000-0000000000e9", email: "super@x", name: "Super", role: "super_admin" as const, regions: null };

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
  assignMentor,
  logSession,
  getMyMentorship,
  listAssignments,
} from "@/lib/dal/mentorship";
import { getSql } from "@/lib/db/client";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";

async function assignmentId(): Promise<string> {
  const [a] = await migratorSql`SELECT id FROM mentorship_assignment WHERE mentor_id = ${MENTOR.id} AND status = 'active'`;
  return a.id as string;
}

beforeEach(async () => {
  await truncateAll();
  state.admin = SUPER;
  for (const u of [MENTOR, MENTEE, OUTSIDER]) {
    await migratorSql`INSERT INTO app_user (id, email, full_name, persona, status)
      VALUES (${u.id}, ${u.email}, ${u.fullName}, ${u.persona}, 'active')`;
  }
  await migratorSql`INSERT INTO admin_user (id, email, name, role)
    VALUES (${SUPER.id}, ${SUPER.email}, ${SUPER.name}, 'super_admin')`;
});

afterAll(async () => {
  vi.restoreAllMocks();
  await getSql().end();
  await closeDb();
});

describe("admin pairing", () => {
  test("assign links mentor↔mentee and both can see it", async () => {
    const res = await assignMentor({ mentorId: MENTOR.id, menteeId: MENTEE.id });
    expect(res.ok).toBe(true);

    state.user = MENTOR;
    const mentorView = await getMyMentorship();
    expect(mentorView.asMentor.map((a) => a.menteeName)).toEqual(["Mentee One"]);

    state.user = MENTEE;
    const menteeView = await getMyMentorship();
    expect(menteeView.asMentee.map((a) => a.mentorName)).toEqual(["Mentor One"]);
  });

  test("a mentee can't have two active mentors", async () => {
    await migratorSql`INSERT INTO app_user (id, email, full_name, persona, status)
      VALUES ('80000000-0000-4000-8000-0000000000a2', 'mentor2@x', 'Mentor Two', 'mentor', 'active')`;
    expect((await assignMentor({ mentorId: MENTOR.id, menteeId: MENTEE.id })).ok).toBe(true);
    const dup = await assignMentor({ mentorId: "80000000-0000-4000-8000-0000000000a2", menteeId: MENTEE.id });
    expect(dup.ok).toBe(false);
  });

  test("the mentor must actually be a registered mentor", async () => {
    const res = await assignMentor({ mentorId: MENTEE.id, menteeId: OUTSIDER.id });
    expect(res.ok).toBe(false);
  });
});

describe("session logging", () => {
  test("only the assigned mentor may log; the mentee may not", async () => {
    await assignMentor({ mentorId: MENTOR.id, menteeId: MENTEE.id });
    const id = await assignmentId();

    state.user = MENTEE;
    const asMentee = await logSession({ assignmentId: id, durationMinutes: 60, mode: "virtual", occurredAt: "", notes: "" });
    expect(asMentee.ok).toBe(false); // mentee isn't the assignment's mentor

    state.user = MENTOR;
    const asMentor = await logSession({ assignmentId: id, durationMinutes: 60, mode: "virtual", occurredAt: "", notes: "" });
    expect(asMentor.ok).toBe(true);
  });
});

describe("5-hour certificate", () => {
  test("issues exactly when logged minutes cross 300", async () => {
    await assignMentor({ mentorId: MENTOR.id, menteeId: MENTEE.id });
    const id = await assignmentId();
    state.user = MENTOR;

    const first = await logSession({ assignmentId: id, durationMinutes: 200, mode: "virtual", occurredAt: "", notes: "" });
    expect(first.ok && first.certificateIssued).toBe(false); // total 200 < 300
    expect((await getMyMentorship()).certificate).toBeNull();

    const second = await logSession({ assignmentId: id, durationMinutes: 100, mode: "in_person", occurredAt: "", notes: "" });
    expect(second.ok && second.certificateIssued).toBe(true); // total 300 ≥ 300
    if (second.ok) expect(second.serial).toMatch(/^PRIME-MENTOR-\d{4}-0001$/);

    const view = await getMyMentorship();
    expect(view.certificate?.totalMinutes).toBe(300);

    // A further session does not issue a second certificate.
    const third = await logSession({ assignmentId: id, durationMinutes: 60, mode: "phone", occurredAt: "", notes: "" });
    expect(third.ok && third.certificateIssued).toBe(false);
  });
});

describe("admin overview", () => {
  test("lists assignments with logged totals", async () => {
    await assignMentor({ mentorId: MENTOR.id, menteeId: MENTEE.id });
    const id = await assignmentId();
    state.user = MENTOR;
    await logSession({ assignmentId: id, durationMinutes: 90, mode: "virtual", occurredAt: "", notes: "First" });

    const rows = await listAssignments();
    expect(rows.length).toBe(1);
    expect(rows[0].mentorName).toBe("Mentor One");
    expect(rows[0].totalMinutes).toBe(90);
    expect(rows[0].sessionCount).toBe(1);
  });
});
