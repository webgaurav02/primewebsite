import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { migratorSql, appSql, truncateAll, closeDb } from "../helpers/db";

/**
 * The audit log is append-only and hash-chained IN THE DATABASE. prime_app can
 * only write through record_audit() (a SECURITY DEFINER function); it has no
 * direct INSERT and no UPDATE/DELETE at all.
 */

beforeAll(truncateAll);
afterAll(closeDb);

describe("audit log integrity", () => {
  test("prime_app cannot INSERT directly", async () => {
    await expect(
      appSql`INSERT INTO audit_log (actor_id, actor_email, action, resource_type, prev_hash, hash)
             VALUES ('x','x','x','x','x','x')`,
    ).rejects.toThrow(/permission denied/i);
  });

  test("record_audit builds a verifiable chain", async () => {
    await appSql`SELECT record_audit('public','anon@x','a.one','t',NULL,'{}'::jsonb,NULL)`;
    await appSql`SELECT record_audit('u1','u1@x','a.two','t','r1','{"k":1}'::jsonb,NULL)`;
    await appSql`SELECT record_audit('u2','u2@x','a.three','t','r2','{}'::jsonb,NULL)`;

    const [{ ok }] = await appSql`SELECT ok FROM verify_audit_chain()`;
    expect(ok).toBe(true);

    const rows = await migratorSql`SELECT seq, prev_hash, hash FROM audit_log ORDER BY seq`;
    expect(rows.length).toBe(3);
    // Each row chains to the previous one's hash.
    expect(rows[0].prev_hash).toBe("0".repeat(64));
    expect(rows[1].prev_hash).toBe(rows[0].hash);
    expect(rows[2].prev_hash).toBe(rows[1].hash);
  });

  test("tampering with a historical row is detected", async () => {
    // Tamper as the owner (bypasses the RLS that stops prime_app entirely).
    await migratorSql`UPDATE audit_log SET action='a.TWO-tampered' WHERE seq=2`;
    const [{ ok, broken_at_seq }] = await appSql`SELECT ok, broken_at_seq FROM verify_audit_chain()`;
    expect(ok).toBe(false);
    expect(Number(broken_at_seq)).toBe(2);
  });
});
