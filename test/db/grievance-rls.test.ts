import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { migratorSql, appSql, asContext, truncateAll, closeDb } from "../helpers/db";
import { encryptPII } from "@/lib/crypto/pii";

/**
 * Row-Level Security is the SECOND authorization layer. These tests connect as
 * the real least-privilege app role (prime_app) and prove the policies hold
 * even if the DAL were bypassed.
 */

const SUPER = "11111111-1111-4111-8111-111111111111";
const OFFICER_GH = "22222222-2222-4222-8222-222222222222";
const AUDITOR = "33333333-3333-4333-8333-333333333333";

const G_KJ = "aaaaaaaa-0000-4000-8000-0000000000a1";
const G_GH = "aaaaaaaa-0000-4000-8000-0000000000a2";
const G_RB = "aaaaaaaa-0000-4000-8000-0000000000a3";

beforeAll(async () => {
  await truncateAll();

  await migratorSql`
    INSERT INTO admin_user (id, email, name, role) VALUES
      (${SUPER}, 'super@x', 'Super', 'super_admin'),
      (${OFFICER_GH}, 'gh@x', 'Officer GH', 'grievance_officer'),
      (${AUDITOR}, 'aud@x', 'Auditor', 'auditor')
  `;
  await migratorSql`INSERT INTO admin_region (admin_id, region) VALUES (${OFFICER_GH}, 'garo')`;

  for (const [id, region, ref] of [
    [G_KJ, "khasi_jaintia", "PRM-KJ-0001"],
    [G_GH, "garo", "PRM-GH-0002"],
    [G_RB, "ri_bhoi", "PRM-RB-0003"],
  ] as const) {
    await migratorSql`
      INSERT INTO grievance
        (id, ticket_ref, region, subject, description, status,
         complainant_name_enc, complainant_email_enc, complainant_phone_enc)
      VALUES
        (${id}, ${ref}, ${region}, 'Subject here', 'A description long enough.',
         'submitted', ${encryptPII("Name")}, ${encryptPII("e@x")}, ${encryptPII("+91")})
    `;
  }
});

afterAll(closeDb);

describe("grievance RLS — read scoping", () => {
  test("no GUC context is fail-closed (0 rows)", async () => {
    const rows = await appSql`SELECT id FROM grievance`;
    expect(rows.length).toBe(0);
  });

  test("super_admin sees all regions", async () => {
    const rows = await asContext(
      { "app.current_admin_id": SUPER, "app.current_admin_role": "super_admin" },
      (tx) => tx`SELECT id FROM grievance`,
    );
    expect(rows.length).toBe(3);
  });

  test("grievance_officer sees only owned region", async () => {
    const rows = await asContext(
      { "app.current_admin_id": OFFICER_GH, "app.current_admin_role": "grievance_officer" },
      (tx) => tx`SELECT ticket_ref FROM grievance`,
    );
    expect(rows.map((r) => r.ticket_ref)).toEqual(["PRM-GH-0002"]);
  });

  test("auditor sees all (read-only oversight)", async () => {
    const rows = await asContext(
      { "app.current_admin_id": AUDITOR, "app.current_admin_role": "auditor" },
      (tx) => tx`SELECT id FROM grievance`,
    );
    expect(rows.length).toBe(3);
  });
});

describe("grievance RLS — write scoping", () => {
  test("officer cannot update a grievance outside their region (0 rows)", async () => {
    const res = await asContext(
      { "app.current_admin_id": OFFICER_GH, "app.current_admin_role": "grievance_officer" },
      (tx) => tx`UPDATE grievance SET status='resolved' WHERE id=${G_KJ}`,
    );
    expect(res.count).toBe(0);
  });

  test("officer can update within their region", async () => {
    const res = await asContext(
      { "app.current_admin_id": OFFICER_GH, "app.current_admin_role": "grievance_officer" },
      (tx) => tx`UPDATE grievance SET status='under_review' WHERE id=${G_GH}`,
    );
    expect(res.count).toBe(1);
  });

  test("auditor cannot mutate (no write policy → 0 rows)", async () => {
    const res = await asContext(
      { "app.current_admin_id": AUDITOR, "app.current_admin_role": "auditor" },
      (tx) => tx`UPDATE grievance SET status='resolved' WHERE id=${G_GH}`,
    );
    expect(res.count).toBe(0);
  });
});

describe("public intake RLS", () => {
  test("public context may INSERT a 'submitted' grievance", async () => {
    const res = await asContext(
      {},
      (tx) => tx`
        INSERT INTO grievance
          (ticket_ref, region, subject, description, status,
           complainant_name_enc, complainant_email_enc, complainant_phone_enc)
        VALUES ('PRM-KJ-9001','khasi_jaintia','S','A description long enough.',
                'submitted', ${encryptPII("n")}, ${encryptPII("e")}, ${encryptPII("p")})
      `,
    );
    expect(res.count).toBe(1);
  });

  test("public context CANNOT INSERT a non-'submitted' grievance", async () => {
    await expect(
      asContext(
        {},
        (tx) => tx`
          INSERT INTO grievance
            (ticket_ref, region, subject, description, status,
             complainant_name_enc, complainant_email_enc, complainant_phone_enc)
          VALUES ('PRM-KJ-9002','khasi_jaintia','S','A description long enough.',
                  'resolved', ${encryptPII("n")}, ${encryptPII("e")}, ${encryptPII("p")})
        `,
      ),
    ).rejects.toThrow(/row-level security/i);
  });
});
