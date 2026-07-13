import "server-only";
import crypto from "node:crypto";
import { withPublicContext } from "@/lib/db/client";
import { encryptPII } from "@/lib/crypto/pii";
import { recordAudit, PUBLIC_SYSTEM_ACTOR } from "@/lib/audit/log";
import { allocateTicketRef } from "@/lib/grievance/ticket";
import {
  publicSubmissionSchema,
  type PublicSubmission,
} from "@/lib/validation/grievance";
import type { Region } from "@/lib/auth/rbac";

/**
 * Isolated UNAUTHENTICATED write boundary — the ONLY place the public grievance
 * form may write. Deliberately separate from lib/dal/grievances.ts (which
 * requires an authenticated admin) so the trust zones never blur.
 *
 * It re-parses the input (defense in depth — never trusts the action layer),
 * encrypts complainant PII before it touches the database, writes the row +
 * the initial status-history entry, audits as the system actor, and returns
 * ONLY the ticket reference + region. Complainant PII is NEVER echoed back.
 *
 * Runs in withPublicContext (no admin GUCs): RLS confines this path to
 * INSERTs with status 'submitted' and system-actor history rows — even a bug
 * here could not update or read existing grievances.
 */
export async function createPublicGrievance(
  input: PublicSubmission,
  meta: { ip: string | null },
): Promise<{ ticketRef: string; region: Region }> {
  // Re-validate at the boundary regardless of what the action already did.
  const data = publicSubmissionSchema.parse(input);
  const region = data.region as Region;

  return withPublicContext(async (tx) => {
    const ticketRef = await allocateTicketRef(tx, region);
    // Generated app-side so no RETURNING (and thus no SELECT policy) is needed
    // on this locked-down path.
    const id = crypto.randomUUID();

    await tx`
      INSERT INTO grievance
        (id, ticket_ref, region, subject, description, status,
         complainant_name_enc, complainant_email_enc, complainant_phone_enc)
      VALUES
        (${id}, ${ticketRef}, ${region}, ${data.subject}, ${data.description},
         'submitted',
         ${encryptPII(data.complainantName)},
         ${encryptPII(data.complainantEmail)},
         ${encryptPII(data.complainantPhone)})
    `;

    await tx`
      INSERT INTO grievance_status_history
        (grievance_id, from_status, to_status, note, changed_by)
      VALUES
        (${id}, NULL, 'submitted', 'Submitted via public portal', NULL)
    `;

    await recordAudit(
      {
        actor: PUBLIC_SYSTEM_ACTOR,
        action: "grievance.create_public",
        resourceType: "grievance",
        resourceId: ticketRef,
        // Metadata is non-PII only — region + a coarse IP marker for abuse triage.
        metadata: { region, hasIp: Boolean(meta.ip) },
      },
      tx,
    );

    return { ticketRef, region };
  });
}
