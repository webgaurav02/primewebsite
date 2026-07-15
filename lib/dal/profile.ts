import "server-only";
import { z } from "zod";
import { requireUser } from "@/lib/auth/user-session";
import { withUserContext } from "@/lib/db/client";
import { imageDataUrl } from "@/lib/storage";
import { recordAudit } from "@/lib/audit/log";
import { emitTimelineEvent } from "@/lib/dal/events";
import { encryptPII, decryptPII } from "@/lib/crypto/pii";
import { SECTOR_LABELS } from "@/lib/entrepreneurs-data";
import { updateProfileSchema } from "@/lib/validation/profile";
import type { RegistrantType } from "@/lib/users/types";

type FieldErrors = Record<string, string[]>;
type UpdateResult = { ok: true } | { ok: false; fieldErrors: FieldErrors };

/** Whole-number string → int (whole rupees / counts), else null. */
function intOrNull(s: string): number | null {
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

// Stored sector is the LABEL ("Food Processing"); the editor <select> uses keys.
const SECTOR_KEY_BY_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(SECTOR_LABELS).map(([key, label]) => [label, key]),
);

/**
 * Member-facing "my profile" read — the counterpart to the admin getUserDetail.
 * Runs in the caller's own user context (RLS scopes app_user + entrepreneur_profile
 * to `user_id = current_user_id()`), so a member only ever sees their own row.
 *
 * Financials are bigint columns; the driver hands them back as strings, so they
 * are coerced to numbers here (whole rupees, always < 2^53).
 */

export interface MyBusiness {
  businessName: string | null;
  sector: string | null;
  entityType: string | null;
  stage: string | null;
  yearEstablished: number | null;
  address: string | null;
  description: string | null;
  employmentCount: number | null;
  livesImpacted: number | null;
  turnover: number | null;
  govtFunding: number | null;
  externalFunding: number | null;
  products: string | null;
  socialImpact: string | null;
}

export interface MyProfile {
  /** ISO app_user.created_at — powers "member since". */
  memberSince: string;
  photoDataUrl: string | null;
  /** The entrepreneur snapshot, or null for non-business registrant types. */
  business: MyBusiness | null;
}

export async function getMyProfile(): Promise<MyProfile> {
  const user = await requireUser();

  const { row, photoPath } = await withUserContext(user.id, async (tx) => {
    const [r] = await tx<
      {
        createdAt: Date; photoPath: string | null;
        businessName: string | null; sector: string | null; entityType: string | null;
        stage: string | null; yearEstablished: number | null; address: string | null;
        description: string | null; employmentCount: number | null; livesImpacted: number | null;
        turnover: string | null; govtFunding: string | null; externalFunding: string | null;
        products: string | null; socialImpact: string | null;
      }[]
    >`
      SELECT u.created_at AS "createdAt", u.photo_path AS "photoPath",
             ep.business_name AS "businessName", ep.sector, ep.entity_type AS "entityType",
             ep.stage, ep.year_established AS "yearEstablished", ep.address, ep.description,
             ep.employment_count AS "employmentCount", ep.lives_impacted AS "livesImpacted",
             ep.turnover, ep.govt_funding AS "govtFunding",
             ep.external_funding AS "externalFunding", ep.products,
             ep.social_impact AS "socialImpact"
      FROM app_user u
      LEFT JOIN entrepreneur_profile ep ON ep.user_id = u.id
      WHERE u.id = ${user.id}`;
    return { row: r ?? null, photoPath: r?.photoPath ?? null };
  });

  // Fetch the photo AFTER the DB txn (network call, don't hold the connection).
  const photoDataUrl = photoPath ? await imageDataUrl(photoPath) : null;

  const business: MyBusiness | null = row?.businessName
    ? {
        businessName: row.businessName, sector: row.sector, entityType: row.entityType,
        stage: row.stage, yearEstablished: row.yearEstablished, address: row.address,
        description: row.description, employmentCount: row.employmentCount,
        livesImpacted: row.livesImpacted,
        turnover: row.turnover == null ? null : Number(row.turnover),
        govtFunding: row.govtFunding == null ? null : Number(row.govtFunding),
        externalFunding: row.externalFunding == null ? null : Number(row.externalFunding),
        products: row.products, socialImpact: row.socialImpact,
      }
    : null;

  return {
    memberSince: (row?.createdAt ?? new Date()).toISOString(),
    photoDataUrl,
    business,
  };
}

// ── Editable profile (for the self-serve editor) ───────────────────────────────

export interface EditableBusiness {
  businessName: string;
  /** Sector KEY (form <select> value), reverse-mapped from the stored label. */
  sector: string;
  entityType: string;
  stage: string;
  yearEstablished: string;
  address: string;
  description: string;
  employment: string;
  livesImpacted: string;
  turnover: string;
  govtFunding: string;
  externalFunding: string;
  products: string;
  socialImpact: string;
}

export interface EditableProfile {
  fullName: string;
  email: string;            // read-only
  mobile: string;           // decrypted
  gender: string;
  dateOfBirth: string | null; // read-only
  preferredLanguage: string;
  district: string;
  registrantType: RegistrantType | null; // read-only
  business: EditableBusiness | null;
}

/** Load the current member's editable fields (strings, ready to bind to inputs). */
export async function getMyEditableProfile(): Promise<EditableProfile> {
  const user = await requireUser();
  return withUserContext(user.id, async (tx) => {
    const [r] = await tx<
      {
        fullName: string; email: string; mobileEnc: Buffer | null;
        gender: string | null; dateOfBirth: Date | null;
        preferredLanguage: string | null; district: string | null;
        registrantType: RegistrantType | null;
        businessName: string | null; sector: string | null; entityType: string | null;
        stage: string | null; yearEstablished: number | null; address: string | null;
        description: string | null; employmentCount: number | null; livesImpacted: number | null;
        turnover: string | null; govtFunding: string | null; externalFunding: string | null;
        products: string | null; socialImpact: string | null;
      }[]
    >`
      SELECT u.full_name AS "fullName", u.email, u.mobile_enc AS "mobileEnc",
             u.gender::text AS gender, u.date_of_birth AS "dateOfBirth",
             u.preferred_language AS "preferredLanguage", u.district,
             u.registrant_type AS "registrantType",
             ep.business_name AS "businessName", ep.sector, ep.entity_type AS "entityType",
             ep.stage, ep.year_established AS "yearEstablished", ep.address, ep.description,
             ep.employment_count AS "employmentCount", ep.lives_impacted AS "livesImpacted",
             ep.turnover, ep.govt_funding AS "govtFunding",
             ep.external_funding AS "externalFunding", ep.products,
             ep.social_impact AS "socialImpact"
      FROM app_user u
      LEFT JOIN entrepreneur_profile ep ON ep.user_id = u.id
      WHERE u.id = ${user.id}`;

    const business: EditableBusiness | null = r?.businessName
      ? {
          businessName: r.businessName,
          sector: r.sector ? (SECTOR_KEY_BY_LABEL[r.sector] ?? "") : "",
          entityType: r.entityType ?? "",
          stage: r.stage ?? "",
          yearEstablished: r.yearEstablished != null ? String(r.yearEstablished) : "",
          address: r.address ?? "",
          description: r.description ?? "",
          employment: r.employmentCount != null ? String(r.employmentCount) : "",
          livesImpacted: r.livesImpacted != null ? String(r.livesImpacted) : "",
          turnover: r.turnover != null ? String(Number(r.turnover)) : "",
          govtFunding: r.govtFunding != null ? String(Number(r.govtFunding)) : "",
          externalFunding: r.externalFunding != null ? String(Number(r.externalFunding)) : "",
          products: r.products ?? "",
          socialImpact: r.socialImpact ?? "",
        }
      : null;

    return {
      fullName: r?.fullName ?? user.fullName,
      email: r?.email ?? user.email,
      mobile: r?.mobileEnc ? decryptPII(r.mobileEnc) : "",
      gender: r?.gender ?? "",
      dateOfBirth: r?.dateOfBirth ? r.dateOfBirth.toISOString().slice(0, 10) : null,
      preferredLanguage: r?.preferredLanguage ?? "",
      district: r?.district ?? "",
      registrantType: r?.registrantType ?? null,
      business,
    };
  });
}

/** Update the member's identity + (optional) business snapshot in their own context. */
export async function updateMyProfile(raw: unknown): Promise<UpdateResult> {
  const user = await requireUser();
  const parsed = updateProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors as FieldErrors };
  }
  const d = parsed.data;
  const mobileEnc = encryptPII(d.mobile);

  return withUserContext(user.id, async (tx) => {
    await tx`
      UPDATE app_user
      SET full_name = ${d.fullName}, mobile_enc = ${mobileEnc}, gender = ${d.gender},
          preferred_language = ${d.preferredLanguage}, district = ${d.district}, updated_at = now()
      WHERE id = ${user.id}`;

    if (d.businessName) {
      const sectorLabel = SECTOR_LABELS[d.sector] ?? d.sector;
      const year = intOrNull(d.yearEstablished);
      const employment = intOrNull(d.employment);
      const lives = intOrNull(d.livesImpacted);
      const turnover = intOrNull(d.turnover);
      const govtFunding = intOrNull(d.govtFunding);
      const externalFunding = intOrNull(d.externalFunding);
      const address = d.address || null;
      const socialImpact = d.socialImpact || null;

      const [existing] = await tx<{ userId: string }[]>`
        SELECT user_id AS "userId" FROM entrepreneur_profile WHERE user_id = ${user.id} FOR UPDATE`;

      if (existing) {
        await tx`
          UPDATE entrepreneur_profile SET
            business_name = ${d.businessName}, sector = ${sectorLabel}, entity_type = ${d.entityType},
            stage = ${d.stage}, year_established = ${year}, address = ${address},
            description = ${d.description}, employment_count = ${employment},
            lives_impacted = ${lives}, turnover = ${turnover}, govt_funding = ${govtFunding},
            external_funding = ${externalFunding}, products = ${d.products},
            social_impact = ${socialImpact}, updated_at = now()
          WHERE user_id = ${user.id}`;

        const [me] = await tx<{ organizationId: string | null }[]>`
          SELECT organization_id AS "organizationId" FROM app_user WHERE id = ${user.id}`;
        if (me?.organizationId) {
          await tx`
            UPDATE organization SET
              name = ${d.businessName}, sector = ${sectorLabel}, district = ${d.district},
              entity_type = ${d.entityType}, stage = ${d.stage}, year_started = ${year},
              address = ${address}, description = ${d.description},
              employment_count = ${employment}, turnover = ${turnover}, updated_at = now()
            WHERE id = ${me.organizationId}`;
        }
      } else {
        const [org] = await tx<{ id: string }[]>`
          INSERT INTO organization
            (name, sector, district, entity_type, stage, year_started, address,
             description, employment_count, turnover, created_by)
          VALUES
            (${d.businessName}, ${sectorLabel}, ${d.district}, ${d.entityType}, ${d.stage},
             ${year}, ${address}, ${d.description}, ${employment}, ${turnover}, ${user.id})
          RETURNING id`;
        await tx`UPDATE app_user SET organization_id = ${org.id} WHERE id = ${user.id}`;
        await tx`
          INSERT INTO entrepreneur_profile
            (user_id, business_name, sector, entity_type, stage, year_established, address,
             description, employment_count, lives_impacted, turnover, govt_funding,
             external_funding, products, social_impact)
          VALUES
            (${user.id}, ${d.businessName}, ${sectorLabel}, ${d.entityType}, ${d.stage},
             ${year}, ${address}, ${d.description}, ${employment}, ${lives}, ${turnover},
             ${govtFunding}, ${externalFunding}, ${d.products}, ${socialImpact})`;
      }
    }

    await recordAudit(
      { actor: { kind: "system", id: user.id, email: user.email },
        action: "profile.update", resourceType: "app_user", resourceId: user.id },
      tx,
    );
    await emitTimelineEvent(tx, {
      userId: user.id, type: "profile.updated",
      title: "Profile updated", body: null,
    });
    return { ok: true };
  });
}
