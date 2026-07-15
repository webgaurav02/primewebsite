import { describe, test, expect, beforeEach, afterAll, vi } from "vitest";

const USER = {
  id: "99990000-0000-4000-8000-0000000000d1",
  email: "complainant@example.com",
  fullName: "Complainant One",
  persona: "entrepreneur" as const,
  status: "active" as const,
  emailVerified: true,
  district: "East Khasi Hills",
};
const SUPER = { id: "99990000-0000-4000-8000-0000000000e2", email: "super@x", name: "Super", role: "super_admin" as const, regions: null };
const OFFICER_ID = "99990000-0000-4000-8000-0000000000f3";

vi.mock("@/lib/auth/user-session", () => ({ requireUser: async () => USER, getCurrentUser: async () => USER }));
vi.mock("@/lib/auth/session", () => ({ requireAdmin: async () => SUPER, getCurrentAdmin: async () => SUPER }));
// Bypass R2: exercise the DB attachment path (RLS + DAL) without object storage.
vi.mock("@/lib/storage", () => ({
  uploadUserFile: async (prefix: string, id: string) => ({
    ok: true, key: `${prefix}/${id}/file.png`, mime: "image/png", size: 1234,
  }),
  getFileBytes: async () => Buffer.from("PNGDATA"),
}));

import { createPublicGrievance } from "@/lib/dal/grievance-intake";
import {
  trackGrievance,
  getMyGrievances,
  updateGrievanceStatus,
  assignGrievance,
  escalateGrievance,
  listGrievances,
  getGrievanceAttachmentFileAdmin,
} from "@/lib/dal/grievances";
import { getMyNotifications } from "@/lib/dal/events";
import { getSql } from "@/lib/db/client";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";

const SUBMISSION = {
  region: "garo" as const,
  category: "programme" as const,
  subject: "Stipend not disbursed for Q1",
  description: "The Q1 incubation stipend has not been disbursed for over six weeks now.",
  complainantName: "Complainant One",
  complainantEmail: "complainant@example.com",
  complainantPhone: "+91 90000 00001",
};

async function grievanceIdByRef(ref: string): Promise<string> {
  const [g] = await migratorSql`SELECT id FROM grievance WHERE ticket_ref = ${ref}`;
  return g.id as string;
}

beforeEach(async () => {
  await truncateAll();
  await migratorSql`INSERT INTO app_user (id, email, full_name, persona, status) VALUES (${USER.id}, ${USER.email}, ${USER.fullName}, 'entrepreneur', 'active')`;
  await migratorSql`INSERT INTO admin_user (id, email, name, role) VALUES (${SUPER.id}, ${SUPER.email}, ${SUPER.name}, 'super_admin')`;
  await migratorSql`INSERT INTO admin_user (id, email, name, role) VALUES (${OFFICER_ID}, 'officer@x', 'Garo Officer', 'grievance_officer')`;
  await migratorSql`INSERT INTO admin_region (admin_id, region) VALUES (${OFFICER_ID}, 'garo')`;
});

afterAll(async () => {
  vi.restoreAllMocks();
  await getSql().end();
  await closeDb();
});

describe("account-linked intake", () => {
  test("a signed-in submission links the user, sets SLA + blind index, and notifies", async () => {
    const { ticketRef } = await createPublicGrievance(SUBMISSION, { ip: null, userId: USER.id });
    expect(ticketRef).toMatch(/^PRM-GH-/);

    const [g] = await migratorSql`
      SELECT user_id, category, sla_ack_due, sla_resolve_due, complainant_email_bidx,
             complainant_name_enc
      FROM grievance WHERE ticket_ref = ${ticketRef}`;
    expect(g.user_id).toBe(USER.id);
    expect(g.category).toBe("programme");
    expect(g.sla_ack_due).not.toBeNull();
    expect(g.sla_resolve_due).not.toBeNull();
    expect(g.complainant_email_bidx).toMatch(/^[0-9a-f]{64}$/);
    expect(g.complainant_name_enc.toString("utf8")).not.toContain("Complainant");

    // Shows on the member's list + they got a notification.
    expect((await getMyGrievances()).some((x) => x.ticketRef === ticketRef)).toBe(true);
    expect((await getMyNotifications()).unread).toBeGreaterThanOrEqual(1);
  });
});

describe("public tracking (enumeration-safe)", () => {
  test("needs the correct ref AND email; leaks no PII", async () => {
    const { ticketRef } = await createPublicGrievance(SUBMISSION, { ip: null, userId: USER.id });

    const ok = await trackGrievance({ ref: ticketRef, email: "complainant@example.com" });
    expect(ok.found).toBe(true);
    expect(ok.status).toBe("submitted");
    expect(ok.history?.length).toBe(1);
    // PII-free: the result type carries no name / email / phone / description.
    expect(Object.keys(ok)).not.toContain("complainant");
    expect(JSON.stringify(ok)).not.toContain("Complainant One");

    expect((await trackGrievance({ ref: ticketRef, email: "wrong@example.com" })).found).toBe(false);
    expect((await trackGrievance({ ref: "PRM-GH-9999", email: "complainant@example.com" })).found).toBe(false);
  });
});

describe("admin workflow: status → notify, assign, escalate", () => {
  test("status change notifies the linked complainant and writes history", async () => {
    const { ticketRef } = await createPublicGrievance(SUBMISSION, { ip: null, userId: USER.id });
    const id = await grievanceIdByRef(ticketRef);

    await updateGrievanceStatus({ grievanceId: id, status: "under_review", note: "Assigned to disbursal team" });

    const [g] = await migratorSql`SELECT status FROM grievance WHERE id = ${id}`;
    expect(g.status).toBe("under_review");
    const hist = await migratorSql`SELECT to_status FROM grievance_status_history WHERE grievance_id = ${id} ORDER BY changed_at`;
    expect(hist.map((h) => h.to_status)).toEqual(["submitted", "under_review"]);

    // Complainant got a status-change notification.
    const notifs = await getMyNotifications();
    expect(notifs.items.some((n) => n.type === "grievance.status_changed")).toBe(true);
  });

  test("stores optional fields + consent + attachments; admin lists and fetches them", async () => {
    const { ticketRef } = await createPublicGrievance(
      { ...SUBMISSION, primeId: "PRM-777", businessName: "Khasi Weaves LLP" },
      {
        ip: null,
        userId: USER.id,
        consentVersion: "dpdp-2023-v1",
        attachments: [{ buffer: Buffer.from("evidence"), name: "evidence.png" }],
      },
    );
    const id = await grievanceIdByRef(ticketRef);

    const [g] = await migratorSql`
      SELECT prime_id_ref, business_name, consent_version, consent_at
      FROM grievance WHERE id = ${id}`;
    expect(g.prime_id_ref).toBe("PRM-777");
    expect(g.business_name).toBe("Khasi Weaves LLP");
    expect(g.consent_version).toBe("dpdp-2023-v1");
    expect(g.consent_at).not.toBeNull();

    // The attachment row was inserted — grievance_is_submitted RLS allowed it.
    const atts = await migratorSql`
      SELECT original_name FROM grievance_attachment WHERE grievance_id = ${id}`;
    expect(atts.map((a) => a.original_name)).toEqual(["evidence.png"]);

    // Admin list surfaces the new metadata + attachment.
    const listed = (await listGrievances({})).find((x) => x.ticketRef === ticketRef);
    expect(listed?.primeIdRef).toBe("PRM-777");
    expect(listed?.businessName).toBe("Khasi Weaves LLP");
    expect(listed?.attachments.length).toBe(1);

    // Admin can fetch the bytes (IDOR-safe lookup, R2 mocked).
    const file = await getGrievanceAttachmentFileAdmin(listed!.attachments[0].id);
    expect(file?.name).toBe("evidence.png");
    expect(file?.buffer.toString()).toBe("PNGDATA");
  });

  test("assign to an officer, and escalate up to L3", async () => {
    const { ticketRef } = await createPublicGrievance(SUBMISSION, { ip: null, userId: USER.id });
    const id = await grievanceIdByRef(ticketRef);

    expect(await assignGrievance({ grievanceId: id, assigneeId: OFFICER_ID })).toEqual({ ok: true });
    const [a] = await migratorSql`SELECT assigned_to FROM grievance WHERE id = ${id}`;
    expect(a.assigned_to).toBe(OFFICER_ID);

    expect((await escalateGrievance({ grievanceId: id })).level).toBe(1);
    expect((await escalateGrievance({ grievanceId: id })).level).toBe(2);
    expect((await escalateGrievance({ grievanceId: id })).level).toBe(3);
    expect((await escalateGrievance({ grievanceId: id })).ok).toBe(false); // capped at L3
  });
});
