import "server-only";
import crypto from "node:crypto";
import { withPublicContext, withUserContext, type Db } from "@/lib/db/client";
import { encryptPII, blindIndex } from "@/lib/crypto/pii";
import { recordAudit, PUBLIC_SYSTEM_ACTOR } from "@/lib/audit/log";
import { allocateTicketRef } from "@/lib/grievance/ticket";
import { computeSla } from "@/lib/grievance/sla";
import { emitTimelineEvent, emitNotification } from "@/lib/dal/events";
import {
  publicSubmissionSchema,
  type PublicSubmission,
} from "@/lib/validation/grievance";
import type { Region } from "@/lib/auth/rbac";

/**
 * Isolated grievance write boundary — never trusts the action layer (re-parses),
 * encrypts complainant PII, computes SLA windows, and stores a keyed blind index
 * of the email so public tracking needs the ticket ref AND the email.
 *
 * If a logged-in user submits, the grievance is linked to them (user context),
 * added to their timeline, and they get a notification. Anonymous submissions
 * run in the locked-down public context (RLS confines them to INSERTs with
 * status 'submitted'). Complainant PII is NEVER echoed back.
 */
export async function createPublicGrievance(
  input: PublicSubmission,
  meta: { ip: string | null; userId?: string | null },
): Promise<{ ticketRef: string; region: Region }> {
  const data = publicSubmissionSchema.parse(input);
  const region = data.region as Region;
  const userId = meta.userId ?? null;
  const now = new Date();
  const { ackDue, resolveDue } = computeSla(now);
  const emailBidx = blindIndex(data.complainantEmail);

  const run = async (tx: Db) => {
    const ticketRef = await allocateTicketRef(tx, region);
    const id = crypto.randomUUID();

    await tx`
      INSERT INTO grievance
        (id, ticket_ref, region, category, subject, description, status,
         complainant_name_enc, complainant_email_enc, complainant_phone_enc,
         complainant_email_bidx, user_id, sla_ack_due, sla_resolve_due)
      VALUES
        (${id}, ${ticketRef}, ${region}, ${data.category}, ${data.subject},
         ${data.description}, 'submitted',
         ${encryptPII(data.complainantName)},
         ${encryptPII(data.complainantEmail)},
         ${encryptPII(data.complainantPhone)},
         ${emailBidx}, ${userId}, ${ackDue}, ${resolveDue})
    `;

    await tx`
      INSERT INTO grievance_status_history
        (grievance_id, from_status, to_status, note, changed_by)
      VALUES (${id}, NULL, 'submitted', 'Submitted via public portal', NULL)
    `;

    await recordAudit(
      {
        actor: PUBLIC_SYSTEM_ACTOR,
        action: "grievance.create_public",
        resourceType: "grievance",
        resourceId: ticketRef,
        metadata: { region, category: data.category, linked: Boolean(userId) },
      },
      tx,
    );

    if (userId) {
      await emitTimelineEvent(tx, {
        userId,
        type: "grievance.submitted",
        title: "Grievance submitted",
        body: `Ticket ${ticketRef} — PRIME will review it.`,
        metadata: { ticketRef },
      });
      await emitNotification(tx, {
        userId,
        type: "grievance.submitted",
        title: "Grievance received",
        body: `Your grievance ${ticketRef} was submitted and is under review.`,
        link: "/account/grievances",
      });
    }

    return { ticketRef, region };
  };

  return userId ? withUserContext(userId, run) : withPublicContext(run);
}
