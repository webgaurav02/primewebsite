import "server-only";
import { z } from "zod";
import { withAuthContext } from "@/lib/db/client";
import { encryptPII } from "@/lib/crypto/pii";
import { recordAudit } from "@/lib/audit/log";
import { emitTimelineEvent, emitNotification } from "@/lib/dal/events";
import { DISTRICT_LABELS, SECTOR_LABELS } from "@/lib/entrepreneurs-data";
import {
  entrepreneurApplicationSchema,
  type EntrepreneurApplicationInput,
} from "@/lib/validation/application";

/**
 * Entrepreneur application intake — the boundary for the public "Apply to PRIME"
 * wizard. It creates a PENDING app_user (NO credential — this is an application,
 * not a signup), an entrepreneur_profile snapshot, and a linked organisation.
 * An admin later approves, which sends a "set your password" activation link.
 *
 * Runs in withAuthContext (applying is a deliberate pre-auth operation), the
 * only context in which RLS lets these rows be inserted from an anonymous user.
 */

type FieldErrors = Record<string, string[]>;

export type ApplicationResult =
  | { ok: true; reference: string }
  | { ok: false; fieldErrors: FieldErrors };

function toInt(s: string): number | null {
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

function mapGender(g: string): "male" | "female" | "other" | null {
  if (g === "male" || g === "female") return g;
  if (g === "non-binary") return "other";
  return null;
}

export async function applyAsEntrepreneur(
  raw: unknown,
): Promise<ApplicationResult> {
  const parsed = entrepreneurApplicationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors as FieldErrors,
    };
  }
  const d: EntrepreneurApplicationInput = parsed.data;

  const districtLabel = DISTRICT_LABELS[d.district] ?? d.district;
  const sectorLabel = SECTOR_LABELS[d.sector] ?? d.sector;
  const fullName = `${d.firstName} ${d.lastName}`.trim();
  const mobileEnc = encryptPII(d.phone);
  const year = toInt(d.yearEstablished);
  const employment = toInt(d.employment);
  const lives = toInt(d.livesImpacted);

  return withAuthContext(async (tx) => {
    const existing = await tx`SELECT id FROM app_user WHERE email = ${d.email}`;
    if (existing.length > 0) {
      return {
        ok: false,
        fieldErrors: {
          email: ["An application with this email already exists."],
        },
      };
    }

    const [org] = await tx<{ id: string }[]>`
      INSERT INTO organization
        (name, sector, district, entity_type, stage, year_started, address,
         description, employment_count, turnover)
      VALUES
        (${d.businessName}, ${sectorLabel}, ${districtLabel}, ${d.entityType},
         ${d.stage}, ${year}, ${d.address || null}, ${d.description},
         ${employment}, ${d.turnover || null})
      RETURNING id
    `;

    const [user] = await tx<{ id: string }[]>`
      INSERT INTO app_user
        (email, full_name, persona, gender, mobile_enc, district, status,
         source, organization_id)
      VALUES
        (${d.email}, ${fullName}, 'entrepreneur', ${mapGender(d.gender)},
         ${mobileEnc}, ${districtLabel}, 'pending', 'public', ${org.id})
      RETURNING id
    `;

    await tx`UPDATE organization SET created_by = ${user.id} WHERE id = ${org.id}`;

    await tx`
      INSERT INTO entrepreneur_profile
        (user_id, business_name, sector, entity_type, stage, year_established,
         address, description, employment_count, lives_impacted, turnover,
         govt_funding, external_funding, products, social_impact)
      VALUES
        (${user.id}, ${d.businessName}, ${sectorLabel}, ${d.entityType},
         ${d.stage}, ${year}, ${d.address || null}, ${d.description},
         ${employment}, ${lives}, ${d.turnover || null}, ${d.govtFunding || null},
         ${d.externalFunding || null}, ${d.products}, ${d.socialImpact || null})
    `;

    await recordAudit(
      {
        actor: { kind: "system", id: user.id, email: d.email },
        action: "application.submit",
        resourceType: "app_user",
        resourceId: user.id,
        metadata: { persona: "entrepreneur", sector: d.sector },
      },
      tx,
    );

    await emitTimelineEvent(tx, {
      userId: user.id,
      type: "user.registered",
      title: "Application submitted",
      body: `Applied to PRIME as an entrepreneur — ${d.businessName}.`,
    });
    await emitNotification(tx, {
      userId: user.id,
      type: "user.registered",
      title: "Application received",
      body: "PRIME is reviewing your application. We'll email you once it's approved.",
      link: "/account",
    });

    // Cosmetic reference tied to the real record (admins identify by name/email).
    const reference = user.id.replace(/-/g, "").slice(0, 4).toUpperCase();
    return { ok: true, reference };
  });
}
