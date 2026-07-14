import "server-only";
import type { Db } from "@/lib/db/client";

/**
 * Allocates the human PRIME ID number: PRM-ML-YYYY-NNNNNN, per-year, backed by
 * a row-locked upsert so numbers stay unique and monotonic under concurrency.
 * Call inside the issuance transaction.
 */
export async function allocatePrimeIdNumber(
  tx: Db,
  year: number,
): Promise<string> {
  const [row] = await tx`
    INSERT INTO prime_id_sequence (year, last_value)
    VALUES (${year}, 1)
    ON CONFLICT (year)
    DO UPDATE SET last_value = prime_id_sequence.last_value + 1
    RETURNING last_value
  `;
  const seq = String(row.last_value as number).padStart(6, "0");
  return `PRM-ML-${year}-${seq}`;
}
