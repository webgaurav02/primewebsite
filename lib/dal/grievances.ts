import "server-only";
// Exposed in the react-server layer because experimental.taint is on (next.config.ts).
import { experimental_taintObjectReference as taintObjectReference } from "react";
import { requireAdmin } from "@/lib/auth/session";
import {
  assertCan,
  assertRegion,
  can,
  type AdminUser,
  type Region,
} from "@/lib/auth/rbac";
import { recordAudit } from "@/lib/audit/log";
import { withAdminContext } from "@/lib/db/client";
import { decryptPII } from "@/lib/crypto/pii";
import type { GrievanceStatus } from "@/lib/grievance/types";
import {
  listFiltersSchema,
  updateStatusSchema,
  type ListFilters,
  type UpdateStatusInput,
} from "@/lib/validation/grievance";

/**
 * Data Access Layer for grievances. This module is the authorization boundary.
 *
 * Every exported function:
 *   1. resolves the caller (requireAdmin) — authentication,
 *   2. checks permission + per-resource region scope — authorization (IDOR guard),
 *   3. runs its queries inside withAdminContext, which SET LOCALs the verified
 *      identity so Postgres RLS enforces the same scoping a second time,
 *   4. returns a minimal DTO (never the raw row) — complainant PII is stored
 *      encrypted and is only DECRYPTED for callers holding "grievance:read_pii";
 *      everyone else gets "[redacted]" without plaintext ever materializing, and
 *   5. records an audit entry for sensitive reads and all mutations, inside the
 *      same transaction as the mutation it describes.
 *
 * `import "server-only"` guarantees this never ends up in a client bundle.
 */

interface GrievanceDbRow {
  id: string;
  ticketRef: string;
  region: Region;
  subject: string;
  description: string;
  status: GrievanceStatus;
  complainantNameEnc: Buffer;
  complainantEmailEnc: Buffer;
  complainantPhoneEnc: Buffer;
  assignedToId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrievanceDTO {
  id: string;
  ticketRef: string;
  region: Region;
  subject: string;
  description: string;
  status: GrievanceStatus;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
  complainant: {
    name: string;
    email: string;
    phone: string;
    redacted: boolean;
  };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Escape LIKE wildcards in user-supplied search text. */
function escapeLike(q: string): string {
  return q.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/**
 * Shared SELECT list (static SQL, embedded via tx.unsafe — no user input).
 * Aliased to camelCase so rows map 1:1 onto GrievanceDbRow.
 */
const ROW_SELECT = `
  id,
  ticket_ref             AS "ticketRef",
  region,
  subject,
  description,
  status,
  complainant_name_enc   AS "complainantNameEnc",
  complainant_email_enc  AS "complainantEmailEnc",
  complainant_phone_enc  AS "complainantPhoneEnc",
  assigned_to            AS "assignedToId",
  created_at             AS "createdAt",
  updated_at             AS "updatedAt"
`;

function toDTO(row: GrievanceDbRow, viewer: AdminUser): GrievanceDTO {
  // Raw rows carry PII ciphertext — block them from ever crossing to the client.
  taintObjectReference?.(
    "Do not pass raw grievance rows to the client — return the DTO.",
    row,
  );

  const showPII = can(viewer, "grievance:read_pii");

  return {
    id: row.id,
    ticketRef: row.ticketRef,
    region: row.region,
    subject: row.subject,
    description: row.description,
    status: row.status,
    assignedToId: row.assignedToId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    // Without the permission we never even decrypt — plaintext PII simply does
    // not exist in this process for unauthorized viewers.
    complainant: showPII
      ? {
          name: decryptPII(row.complainantNameEnc),
          email: decryptPII(row.complainantEmailEnc),
          phone: decryptPII(row.complainantPhoneEnc),
          redacted: false,
        }
      : {
          name: "[redacted]",
          email: "[redacted]",
          phone: "[redacted]",
          redacted: true,
        },
  };
}

export async function listGrievances(
  rawFilters: unknown,
): Promise<GrievanceDTO[]> {
  const viewer = await requireAdmin();
  assertCan(viewer, "grievance:read");

  const filters: ListFilters = listFiltersSchema.parse(rawFilters ?? {});
  const q = filters.q ? `%${escapeLike(filters.q)}%` : null;

  return withAdminContext(viewer, async (tx) => {
    // DAL-side region scoping; RLS enforces the same thing underneath.
    const rows = await tx<GrievanceDbRow[]>`
      SELECT ${tx.unsafe(ROW_SELECT)}
      FROM grievance
      WHERE TRUE
        ${viewer.regions === null ? tx`` : tx`AND region = ANY(${viewer.regions}::region[])`}
        ${filters.status ? tx`AND status = ${filters.status}` : tx``}
        ${filters.region ? tx`AND region = ${filters.region}` : tx``}
        ${q ? tx`AND (subject ILIKE ${q} OR ticket_ref ILIKE ${q})` : tx``}
      ORDER BY created_at DESC
    `;

    await recordAudit(
      {
        actor: viewer,
        action: "grievance.list",
        resourceType: "grievance",
        metadata: { count: rows.length, filters },
      },
      tx,
    );

    return rows.map((r) => toDTO(r, viewer));
  });
}

export async function getGrievance(id: string): Promise<GrievanceDTO | null> {
  const viewer = await requireAdmin();
  assertCan(viewer, "grievance:read");

  if (!UUID_RE.test(id)) return null;

  return withAdminContext(viewer, async (tx) => {
    const [row] = await tx<GrievanceDbRow[]>`
      SELECT ${tx.unsafe(ROW_SELECT)} FROM grievance WHERE id = ${id}
    `;
    if (!row) return null;

    // Per-resource authorization — prevents reading another region's complaint
    // by id (RLS would already have hidden it; keep the explicit check anyway).
    assertRegion(viewer, row.region);

    await recordAudit(
      {
        actor: viewer,
        action: "grievance.view",
        resourceType: "grievance",
        resourceId: row.id,
      },
      tx,
    );

    return toDTO(row, viewer);
  });
}

export async function updateGrievanceStatus(
  rawInput: unknown,
): Promise<GrievanceDTO> {
  const viewer = await requireAdmin();
  assertCan(viewer, "grievance:update_status");

  const input: UpdateStatusInput = updateStatusSchema.parse(rawInput);
  if (!UUID_RE.test(input.grievanceId)) throw new Error("Grievance not found");

  return withAdminContext(viewer, async (tx) => {
    const [row] = await tx<GrievanceDbRow[]>`
      SELECT ${tx.unsafe(ROW_SELECT)} FROM grievance
      WHERE id = ${input.grievanceId}
      FOR UPDATE
    `;
    if (!row) throw new Error("Grievance not found");
    assertRegion(viewer, row.region);

    const from = row.status;
    const [updated] = await tx<{ updatedAt: Date }[]>`
      UPDATE grievance
      SET status = ${input.status}, updated_at = now()
      WHERE id = ${input.grievanceId}
      RETURNING updated_at AS "updatedAt"
    `;

    // The history table is the trackable record of every transition.
    await tx`
      INSERT INTO grievance_status_history
        (grievance_id, from_status, to_status, note, changed_by)
      VALUES
        (${input.grievanceId}, ${from}, ${input.status},
         ${input.note ?? null}, ${viewer.id})
    `;

    await recordAudit(
      {
        actor: viewer,
        action: "grievance.update_status",
        resourceType: "grievance",
        resourceId: row.id,
        metadata: { from, to: input.status, note: input.note ?? null },
      },
      tx,
    );

    return toDTO(
      { ...row, status: input.status, updatedAt: updated.updatedAt },
      viewer,
    );
  });
}
