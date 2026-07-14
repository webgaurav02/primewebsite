import "server-only";
import type { Db } from "@/lib/db/client";

/**
 * Allocates the mentorship certificate serial: PRIME-MENTOR-YYYY-NNNN, per-year,
 * backed by a row-locked upsert (same pattern as the PRIME ID number) so serials
 * stay unique and monotonic under concurrency. Call inside the issuing txn.
 */
export async function allocateCertificateSerial(tx: Db, year: number): Promise<string> {
  const [row] = await tx`
    INSERT INTO mentor_certificate_sequence (year, last_value)
    VALUES (${year}, 1)
    ON CONFLICT (year)
    DO UPDATE SET last_value = mentor_certificate_sequence.last_value + 1
    RETURNING last_value
  `;
  const seq = String(row.last_value as number).padStart(4, "0");
  return `PRIME-MENTOR-${year}-${seq}`;
}
