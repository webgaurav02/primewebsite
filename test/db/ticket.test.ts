import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { appSql, asContext, truncateAll, closeDb } from "../helpers/db";

/**
 * Ticket numbering is a row-locked per-region upsert (ticket_sequence), so refs
 * stay unique and monotonic under concurrency — unlike the old in-memory scan.
 */

async function allocate(region: string): Promise<number> {
  const [row] = await asContext(
    {},
    (tx) => tx`
      INSERT INTO ticket_sequence (region, last_value)
      VALUES (${region}, 1)
      ON CONFLICT (region)
      DO UPDATE SET last_value = ticket_sequence.last_value + 1
      RETURNING last_value
    `,
  );
  return row.last_value as number;
}

beforeAll(truncateAll);
afterAll(closeDb);

describe("ticket_sequence allocation", () => {
  test("increments monotonically per region", async () => {
    expect(await allocate("garo")).toBe(1);
    expect(await allocate("garo")).toBe(2);
    expect(await allocate("garo")).toBe(3);
  });

  test("regions have independent counters", async () => {
    expect(await allocate("ri_bhoi")).toBe(1);
    expect(await allocate("khasi_jaintia")).toBe(1);
    expect(await allocate("ri_bhoi")).toBe(2);
  });

  test("concurrent allocations never collide", async () => {
    const results = await Promise.all(
      Array.from({ length: 20 }, () => allocate("garo")),
    );
    // 20 concurrent allocations → 20 distinct values, no duplicates.
    expect(new Set(results).size).toBe(20);
  });
});
