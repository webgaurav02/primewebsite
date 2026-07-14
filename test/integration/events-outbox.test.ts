import { describe, test, expect, beforeEach, afterAll, vi } from "vitest";

const USER = {
  id: "88888888-0000-4000-8000-0000000000d1",
  email: "member@example.com",
  fullName: "Member One",
  persona: "entrepreneur" as const,
  status: "active" as const,
  emailVerified: true,
  district: "East Khasi Hills",
};
const ADMIN = {
  id: "88888888-0000-4000-8000-0000000000e2",
  email: "super@primemeghalaya.com",
  name: "Super Admin",
  role: "super_admin" as const,
  regions: null,
};

vi.mock("@/lib/auth/user-session", () => ({ requireUser: async () => USER }));
vi.mock("@/lib/auth/session", () => ({ requireAdmin: async () => ADMIN, getCurrentAdmin: async () => null }));

import {
  emitTimelineEvent,
  emitNotification,
  getMyTimeline,
  getMyNotifications,
  markNotificationRead,
  publishPublicEvent,
  listPublicEvents,
} from "@/lib/dal/events";
import { enqueueEmail, processEmailOutbox } from "@/lib/email";
import { withUserContext, getSql } from "@/lib/db/client";
import { migratorSql, truncateAll, closeDb } from "../helpers/db";

beforeEach(async () => {
  await truncateAll();
  await migratorSql`INSERT INTO app_user (id, email, full_name, persona, status) VALUES (${USER.id}, ${USER.email}, ${USER.fullName}, 'entrepreneur', 'active')`;
  await migratorSql`INSERT INTO admin_user (id, email, name, role) VALUES (${ADMIN.id}, ${ADMIN.email}, ${ADMIN.name}, 'super_admin')`;
});

afterAll(async () => {
  vi.restoreAllMocks();
  await getSql().end();
  await closeDb();
});

describe("timeline + notifications", () => {
  test("emitted events and notifications are visible to the member", async () => {
    await withUserContext(USER.id, async (tx) => {
      await emitTimelineEvent(tx, { userId: USER.id, type: "milestone", title: "Reached a milestone" });
      await emitNotification(tx, { userId: USER.id, type: "x", title: "You have an update", link: "/account" });
    });

    const timeline = await getMyTimeline();
    expect(timeline.some((t) => t.title === "Reached a milestone")).toBe(true);

    const { items, unread } = await getMyNotifications();
    expect(unread).toBe(1);
    expect(items[0].title).toBe("You have an update");

    await markNotificationRead(items[0].id);
    expect((await getMyNotifications()).unread).toBe(0);
  });

  test("a published public event shows on the public list AND every member's timeline", async () => {
    expect(await publishPublicEvent({ title: "E-Champion applications open", body: "Apply by Aug 1", occursAt: "" })).toEqual({ ok: true });

    const publicList = await listPublicEvents();
    expect(publicList.some((e) => e.title === "E-Champion applications open")).toBe(true);

    const memberTimeline = await getMyTimeline();
    expect(memberTimeline.some((t) => t.title === "E-Champion applications open" && t.visibility === "public")).toBe(true);
  });
});

describe("email outbox (durable, retrying)", () => {
  test("enqueue then process delivers via the console transport", async () => {
    await enqueueEmail({ to: "someone@example.com", subject: "Hi", text: "body" });
    const [before] = await migratorSql`SELECT status FROM email_outbox`;
    expect(before.status).toBe("pending");

    const res = await processEmailOutbox();
    expect(res.sent).toBe(1);
    const [after] = await migratorSql`SELECT status, sent_at FROM email_outbox`;
    expect(after.status).toBe("sent");
    expect(after.sent_at).not.toBeNull();
  });

  test("a failing transport is retried, not dropped", async () => {
    // Point at SMTP with no creds → the transport throws.
    vi.stubEnv("EMAIL_TRANSPORT", "smtp");
    try {
      await enqueueEmail({ to: "x@example.com", subject: "s", text: "b" });
      const r1 = await processEmailOutbox();
      expect(r1.failed).toBe(1);
      const [row1] = await migratorSql`SELECT status, attempts, last_error FROM email_outbox`;
      expect(row1.status).toBe("pending"); // still queued for retry
      expect(row1.attempts).toBe(1);
      expect(row1.last_error).toBeTruthy();

      await processEmailOutbox();
      const [row2] = await migratorSql`SELECT attempts FROM email_outbox`;
      expect(row2.attempts).toBe(2); // retried again
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
