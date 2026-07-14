import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { migratorSql, appSql, asContext, truncateAll, closeDb } from "../helpers/db";

/**
 * RLS + sequence for PRIME ID. The credential token is the secret proof, so the
 * table is NOT world-readable; the public /verify path goes through the
 * SECURITY DEFINER prime_id_public_lookup(), which never returns the token.
 */

const OWNER = "aaaa1111-0000-4000-8000-00000000000a";
const OTHER = "aaaa2222-0000-4000-8000-00000000000b";
const HASH = "deadbeef".repeat(8); // 64 hex

beforeAll(async () => {
  await truncateAll();
  for (const [id, email] of [[OWNER, "owner@ex.com"], [OTHER, "other@ex.com"]] as const) {
    await migratorSql`
      INSERT INTO app_user (id, email, full_name, persona, status)
      VALUES (${id}, ${email}, 'Holder', 'entrepreneur', 'active')`;
  }
  await migratorSql`
    INSERT INTO prime_id_credential
      (id, user_id, full_name, holder_type, category, district, issue_date,
       valid_thru, token, token_hash, token_fingerprint, status)
    VALUES
      ('PRM-ML-2026-000001', ${OWNER}, 'Holder', 'entrepreneur', 'startup',
       'East Khasi Hills', '2026-01-01', '2031-01-01', 'the-secret-token',
       ${HASH}, 'ab12…cd', 'active')`;
});

afterAll(closeDb);

describe("credential RLS — the token is not world-readable", () => {
  test("no context sees no credentials (fail closed)", async () => {
    expect((await appSql`SELECT 1 FROM prime_id_credential`).length).toBe(0);
  });

  test("owner sees only their own credential (incl. token, to build the QR)", async () => {
    const rows = await asContext(
      { "app.current_user_id": OWNER },
      (tx) => tx`SELECT id, token FROM prime_id_credential`,
    );
    expect(rows.map((r) => r.id)).toEqual(["PRM-ML-2026-000001"]);
    expect(rows[0].token).toBe("the-secret-token");
  });

  test("another user cannot see it", async () => {
    const rows = await asContext(
      { "app.current_user_id": OTHER },
      (tx) => tx`SELECT id FROM prime_id_credential`,
    );
    expect(rows.length).toBe(0);
  });

  test("an admin who manages users sees all", async () => {
    const rows = await asContext(
      { "app.current_admin_id": "bbbb0000-0000-4000-8000-00000000000c", "app.current_admin_role": "super_admin" },
      (tx) => tx`SELECT id FROM prime_id_credential`,
    );
    expect(rows.length).toBe(1);
  });
});

describe("public verify lookup (SECURITY DEFINER)", () => {
  test("returns safe fields by token hash — but never the token itself", async () => {
    const rows = await appSql`SELECT * FROM prime_id_public_lookup(${HASH})`;
    expect(rows.length).toBe(1);
    expect(rows[0].id).toBe("PRM-ML-2026-000001");
    expect(rows[0].status).toBe("active");
    // photo_path is exposed (helps a verifier match the holder); the secret
    // token and its hash are NOT.
    expect("photo_path" in rows[0]).toBe(true);
    expect("token" in rows[0]).toBe(false);
    expect("token_hash" in rows[0]).toBe(false);
  });

  test("an unknown hash returns nothing", async () => {
    const rows = await appSql`SELECT * FROM prime_id_public_lookup(${"f".repeat(64)})`;
    expect(rows.length).toBe(0);
  });
});

describe("prime_id_sequence allocation", () => {
  async function allocate(year: number): Promise<number> {
    const [row] = await asContext(
      { "app.current_admin_id": "bbbb0000-0000-4000-8000-00000000000c", "app.current_admin_role": "super_admin" },
      (tx) => tx`
        INSERT INTO prime_id_sequence (year, last_value) VALUES (${year}, 1)
        ON CONFLICT (year) DO UPDATE SET last_value = prime_id_sequence.last_value + 1
        RETURNING last_value`,
    );
    return row.last_value as number;
  }

  test("increments per year and never collides under concurrency", async () => {
    expect(await allocate(2026)).toBe(1);
    expect(await allocate(2026)).toBe(2);
    expect(await allocate(2027)).toBe(1); // independent year
    const many = await Promise.all(Array.from({ length: 15 }, () => allocate(2026)));
    expect(new Set(many).size).toBe(15);
  });
});
