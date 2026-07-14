import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { migratorSql, appSql, asContext, truncateAll, closeDb } from "../helpers/db";

/**
 * RLS for the timeline (private journey vs public events), notifications
 * (owner-only, mark-read), and the email outbox (system-context only).
 */

const A = "77777777-0000-4000-8000-0000000000a1";
const B = "77777777-0000-4000-8000-0000000000b2";
const ADMIN = { "app.current_admin_id": "77777777-0000-4000-8000-0000000000cc", "app.current_admin_role": "super_admin" };

beforeAll(async () => {
  await truncateAll();
  for (const [id, email] of [[A, "a@ex.com"], [B, "b@ex.com"]] as const) {
    await migratorSql`INSERT INTO app_user (id, email, full_name, persona, status) VALUES (${id}, ${email}, 'N', 'entrepreneur', 'active')`;
  }
  await migratorSql`INSERT INTO timeline_event (user_id, type, title, visibility) VALUES (${A}, 'x', 'A private', 'private')`;
  await migratorSql`INSERT INTO timeline_event (user_id, type, title, visibility) VALUES (${B}, 'x', 'B private', 'private')`;
  await migratorSql`INSERT INTO timeline_event (user_id, type, title, visibility) VALUES (NULL, 'announcement', 'Public event', 'public')`;
  await migratorSql`INSERT INTO notification (user_id, type, title) VALUES (${A}, 'x', 'A notif')`;
  await migratorSql`INSERT INTO notification (user_id, type, title) VALUES (${B}, 'x', 'B notif')`;
  await migratorSql`INSERT INTO email_outbox (to_email, subject, body) VALUES ('x@ex.com', 's', 'b')`;
});

afterAll(closeDb);

describe("timeline RLS", () => {
  test("no context sees only public events", async () => {
    const rows = await appSql`SELECT title FROM timeline_event`;
    expect(rows.map((r) => r.title)).toEqual(["Public event"]);
  });

  test("a member sees their own journey + public, not others'", async () => {
    const rows = await asContext({ "app.current_user_id": A }, (tx) => tx`SELECT title FROM timeline_event ORDER BY title`);
    expect(rows.map((r) => r.title)).toEqual(["A private", "Public event"]);
  });

  test("an admin sees everything", async () => {
    const rows = await asContext(ADMIN, (tx) => tx`SELECT title FROM timeline_event`);
    expect(rows.length).toBe(3);
  });
});

describe("notification RLS", () => {
  test("no context sees none; a member sees only their own", async () => {
    expect((await appSql`SELECT 1 FROM notification`).length).toBe(0);
    const rows = await asContext({ "app.current_user_id": A }, (tx) => tx`SELECT title FROM notification`);
    expect(rows.map((r) => r.title)).toEqual(["A notif"]);
  });

  test("a member can mark their own read but not another's", async () => {
    const mine = await asContext({ "app.current_user_id": A }, (tx) => tx`UPDATE notification SET read_at = now() WHERE user_id = ${A}`);
    expect(mine.count).toBe(1);
    const theirs = await asContext({ "app.current_user_id": A }, (tx) => tx`UPDATE notification SET read_at = now() WHERE user_id = ${B}`);
    expect(theirs.count).toBe(0);
  });
});

describe("email_outbox RLS", () => {
  test("only the system context (or admins) can read the queue", async () => {
    expect((await appSql`SELECT 1 FROM email_outbox`).length).toBe(0); // no context
    const sys = await asContext({ "app.system_op": "1" }, (tx) => tx`SELECT 1 FROM email_outbox`);
    expect(sys.length).toBe(1);
    const asMember = await asContext({ "app.current_user_id": A }, (tx) => tx`SELECT 1 FROM email_outbox`);
    expect(asMember.length).toBe(0);
  });
});
