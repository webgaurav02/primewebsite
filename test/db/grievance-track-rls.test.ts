import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { migratorSql, appSql, asContext, truncateAll, closeDb } from "../helpers/db";

/**
 * A member reads only their OWN linked grievances (new RLS policy), and the
 * public grievance_track() definer returns PII-free status by ref + email hash.
 */

const OWNER = "aaaa9999-0000-4000-8000-0000000000a1";
const OTHER = "aaaa9999-0000-4000-8000-0000000000b2";
const BIDX = "cafe".repeat(16); // 64 hex
const ENC = Buffer.from([0, 1, 2]); // dummy bytea (not decrypted in these tests)

beforeAll(async () => {
  await truncateAll();
  for (const [id, email] of [[OWNER, "o@x.com"], [OTHER, "n@x.com"]] as const) {
    await migratorSql`INSERT INTO app_user (id, email, full_name, persona, status) VALUES (${id}, ${email}, 'N', 'entrepreneur', 'active')`;
  }
  await migratorSql`
    INSERT INTO grievance
      (ticket_ref, region, category, subject, description, status, user_id,
       complainant_name_enc, complainant_email_enc, complainant_phone_enc, complainant_email_bidx)
    VALUES
      ('PRM-GH-0001', 'garo', 'programme', 'Subject', 'A long enough description here.',
       'under_review', ${OWNER}, ${ENC}, ${ENC}, ${ENC}, ${BIDX})`;
});

afterAll(closeDb);

describe("member reads only their own grievance", () => {
  test("no context sees none", async () => {
    expect((await appSql`SELECT 1 FROM grievance`).length).toBe(0);
  });
  test("owner sees theirs; another member does not", async () => {
    const mine = await asContext({ "app.current_user_id": OWNER }, (tx) => tx`SELECT ticket_ref FROM grievance`);
    expect(mine.map((r) => r.ticket_ref)).toEqual(["PRM-GH-0001"]);
    const theirs = await asContext({ "app.current_user_id": OTHER }, (tx) => tx`SELECT ticket_ref FROM grievance`);
    expect(theirs.length).toBe(0);
  });
});

describe("grievance_track() is PII-free and needs the email hash", () => {
  test("correct ref + bidx returns status, never contact/description", async () => {
    const rows = await appSql`SELECT * FROM grievance_track('PRM-GH-0001', ${BIDX})`;
    expect(rows.length).toBe(1);
    expect(rows[0].status).toBe("under_review");
    const cols = Object.keys(rows[0]);
    for (const leak of ["complainant_name_enc", "complainant_email_enc", "description", "subject"]) {
      expect(cols).not.toContain(leak);
    }
  });
  test("wrong bidx returns nothing", async () => {
    const rows = await appSql`SELECT * FROM grievance_track('PRM-GH-0001', ${"0".repeat(64)})`;
    expect(rows.length).toBe(0);
  });
});
