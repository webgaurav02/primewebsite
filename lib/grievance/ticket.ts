import "server-only";
import type { Region } from "@/lib/auth/rbac";
import type { Db } from "@/lib/db/client";

/**
 * Allocates the public ticket reference: PRM-{KJ|GH|RB}-NNNN.
 *
 * Numbering is per-region, backed by the ticket_sequence table. The upsert
 * takes a row lock, so references stay unique under concurrency — call it
 * inside the same transaction as the grievance INSERT so an aborted submission
 * merely leaves a gap, never a duplicate.
 */
const REGION_PREFIX: Record<Region, string> = {
  khasi_jaintia: "KJ",
  garo: "GH",
  ri_bhoi: "RB",
};

export async function allocateTicketRef(
  tx: Db,
  region: Region,
): Promise<string> {
  const [row] = await tx`
    INSERT INTO ticket_sequence (region, last_value)
    VALUES (${region}, 1)
    ON CONFLICT (region)
    DO UPDATE SET last_value = ticket_sequence.last_value + 1
    RETURNING last_value
  `;
  const seq = String(row.last_value as number).padStart(4, "0");
  return `PRM-${REGION_PREFIX[region]}-${seq}`;
}
