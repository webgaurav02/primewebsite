import "server-only";
import { requireAdmin } from "@/lib/auth/session";
import { assertCan } from "@/lib/auth/rbac";
import { withAdminContext, withAuthContext } from "@/lib/db/client";
import { recordAudit } from "@/lib/audit/log";
import { emitTimelineEvent, emitNotification } from "@/lib/dal/events";
import { newToken } from "@/lib/auth/tokens";
import { sendEmail, appBaseUrl } from "@/lib/email";
import { activationEmail } from "@/lib/email/templates";
import { decryptPII } from "@/lib/crypto/pii";
import { imageDataUrl } from "@/lib/storage";
import type { Persona, RegistrantType, UserStatus } from "@/lib/users/types";

/**
 * Admin-facing Data Access Layer for the unified user database (applicants +
 * members). Authorization boundary: requireAdmin → assertCan("user:manage") →
 * withAdminContext (RLS scopes to admins who manage users) → audit.
 *
 * "Activated" (has set a password) is derived from app_user.email_verified_at —
 * the credential table itself is unreadable outside the auth context.
 */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ACTIVATION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface UserListItem {
  id: string;
  fullName: string;
  email: string;
  persona: Persona | null;
  registrantType: RegistrantType | null;
  status: UserStatus;
  district: string | null;
  businessName: string | null;
  activated: boolean;
  createdAt: string;
}

export interface BusinessDetail {
  businessName: string | null;
  sector: string | null;
  entityType: string | null;
  stage: string | null;
  yearEstablished: number | null;
  address: string | null;
  description: string | null;
  employmentCount: number | null;
  livesImpacted: number | null;
  /** Whole-rupee amounts (bigint columns). */
  turnover: number | null;
  govtFunding: number | null;
  externalFunding: number | null;
  products: string | null;
  socialImpact: string | null;
}

export interface UserDetail extends UserListItem {
  source: string | null;
  mobile: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  preferredLanguage: string | null;
  howHeard: string | null;
  guardianName: string | null;
  guardianRelationship: string | null;
  photoDataUrl: string | null;
  business: BusinessDetail | null;
}

export interface UserListFilters {
  status?: UserStatus;
  persona?: Persona;
  registrantType?: RegistrantType;
  district?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

export async function listUsers(
  filters?: UserListFilters,
): Promise<{ rows: UserListItem[]; total: number }> {
  const viewer = await requireAdmin();
  assertCan(viewer, "user:manage");

  const q = filters?.q ? `%${filters.q.replace(/[\\%_]/g, (c) => `\\${c}`)}%` : null;
  const limit = Math.min(Math.max(filters?.limit ?? 50, 1), 10000);
  const offset = Math.max(filters?.offset ?? 0, 0);

  return withAdminContext(viewer, async (tx) => {
    const rows = await tx<
      {
        id: string;
        fullName: string;
        email: string;
        persona: Persona | null;
        registrantType: RegistrantType | null;
        status: UserStatus;
        district: string | null;
        businessName: string | null;
        activated: boolean;
        createdAt: Date;
        total: number;
      }[]
    >`
      SELECT u.id, u.full_name AS "fullName", u.email, u.persona,
             u.registrant_type AS "registrantType", u.status,
             u.district, ep.business_name AS "businessName",
             (u.email_verified_at IS NOT NULL) AS activated,
             u.created_at AS "createdAt",
             count(*) OVER ()::int AS total
      FROM app_user u
      LEFT JOIN entrepreneur_profile ep ON ep.user_id = u.id
      WHERE TRUE
        ${filters?.status ? tx`AND u.status = ${filters.status}` : tx``}
        ${filters?.persona ? tx`AND u.persona = ${filters.persona}` : tx``}
        ${filters?.registrantType ? tx`AND u.registrant_type = ${filters.registrantType}` : tx``}
        ${filters?.district ? tx`AND u.district = ${filters.district}` : tx``}
        ${q ? tx`AND (u.full_name ILIKE ${q} OR u.email ILIKE ${q})` : tx``}
      ORDER BY u.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    await recordAudit(
      {
        actor: viewer,
        action: "user.list",
        resourceType: "app_user",
        metadata: { count: rows.length },
      },
      tx,
    );

    // count(*) OVER () rides on returned rows, so an offset past the last row
    // yields zero rows AND total=0 — recount so a stale ?page= URL still shows
    // the true total (and the pagination controls) instead of a lying empty state.
    let total = rows[0]?.total ?? 0;
    if (rows.length === 0 && offset > 0) {
      const [c] = await tx<{ n: number }[]>`
        SELECT count(*)::int AS n
        FROM app_user u
        WHERE TRUE
          ${filters?.status ? tx`AND u.status = ${filters.status}` : tx``}
          ${filters?.persona ? tx`AND u.persona = ${filters.persona}` : tx``}
          ${filters?.registrantType ? tx`AND u.registrant_type = ${filters.registrantType}` : tx``}
          ${filters?.district ? tx`AND u.district = ${filters.district}` : tx``}
          ${q ? tx`AND (u.full_name ILIKE ${q} OR u.email ILIKE ${q})` : tx``}`;
      total = c.n;
    }
    return {
      rows: rows.map(({ total: _t, ...r }) => ({ ...r, createdAt: r.createdAt.toISOString() })),
      total,
    };
  });
}

/**
 * "Who registered" at a glance: registrant counts by type. Pure aggregates
 * (no PII), so — like the dashboard — not audited.
 */
export interface UserBreakdown {
  total: number;
  byType: { registrantType: RegistrantType | null; count: number }[];
}

export async function getUserBreakdown(): Promise<UserBreakdown> {
  const viewer = await requireAdmin();
  assertCan(viewer, "user:manage");
  return withAdminContext(viewer, async (tx) => {
    const byType = await tx<{ registrantType: RegistrantType | null; count: number }[]>`
      SELECT u.registrant_type AS "registrantType", count(*)::int AS count
      FROM app_user u
      GROUP BY u.registrant_type
      ORDER BY count(*) DESC`;
    return { total: byType.reduce((n, r) => n + r.count, 0), byType };
  });
}

export async function getUserDetail(id: string): Promise<UserDetail | null> {
  const viewer = await requireAdmin();
  assertCan(viewer, "user:manage");
  if (!UUID_RE.test(id)) return null;

  const detail = await withAdminContext(viewer, async (tx) => {
    const [row] = await tx<
      {
        id: string; fullName: string; email: string;
        persona: Persona | null; registrantType: RegistrantType | null;
        status: UserStatus; district: string | null; activated: boolean;
        createdAt: Date; source: string | null; mobileEnc: Buffer | null;
        gender: string | null; dateOfBirth: Date | null;
        preferredLanguage: string | null; howHeard: string | null;
        guardianName: string | null; guardianRelationship: string | null;
        photoPath: string | null;
        businessName: string | null; sector: string | null; entityType: string | null;
        stage: string | null; yearEstablished: number | null; address: string | null;
        description: string | null; employmentCount: number | null; livesImpacted: number | null;
        turnover: string | null; govtFunding: string | null; externalFunding: string | null;
        products: string | null; socialImpact: string | null;
      }[]
    >`
      SELECT u.id, u.full_name AS "fullName", u.email, u.persona,
             u.registrant_type AS "registrantType", u.status, u.district,
             (u.email_verified_at IS NOT NULL) AS activated,
             u.created_at AS "createdAt", u.source::text AS source,
             u.mobile_enc AS "mobileEnc", u.gender::text AS gender,
             u.date_of_birth AS "dateOfBirth", u.preferred_language AS "preferredLanguage",
             u.how_heard AS "howHeard", u.guardian_name AS "guardianName",
             u.guardian_relationship AS "guardianRelationship", u.photo_path AS "photoPath",
             ep.business_name AS "businessName", ep.sector, ep.entity_type AS "entityType",
             ep.stage, ep.year_established AS "yearEstablished", ep.address,
             ep.description, ep.employment_count AS "employmentCount",
             ep.lives_impacted AS "livesImpacted", ep.turnover,
             ep.govt_funding AS "govtFunding", ep.external_funding AS "externalFunding",
             ep.products, ep.social_impact AS "socialImpact"
      FROM app_user u
      LEFT JOIN entrepreneur_profile ep ON ep.user_id = u.id
      WHERE u.id = ${id}
    `;
    if (!row) return null;

    await recordAudit(
      { actor: viewer, action: "user.view", resourceType: "app_user", resourceId: id },
      tx,
    );

    const business: BusinessDetail | null = row.businessName
      ? {
          businessName: row.businessName, sector: row.sector, entityType: row.entityType,
          stage: row.stage, yearEstablished: row.yearEstablished, address: row.address,
          description: row.description, employmentCount: row.employmentCount,
          livesImpacted: row.livesImpacted,
          // bigint columns arrive from the driver as strings — coerce to number.
          turnover: row.turnover == null ? null : Number(row.turnover),
          govtFunding: row.govtFunding == null ? null : Number(row.govtFunding),
          externalFunding: row.externalFunding == null ? null : Number(row.externalFunding),
          products: row.products, socialImpact: row.socialImpact,
        }
      : null;

    return {
      photoPath: row.photoPath,
      detail: {
        id: row.id, fullName: row.fullName, email: row.email, persona: row.persona,
        registrantType: row.registrantType, status: row.status, district: row.district,
        businessName: row.businessName, activated: row.activated,
        createdAt: row.createdAt.toISOString(), source: row.source,
        mobile: row.mobileEnc ? decryptPII(row.mobileEnc) : null, gender: row.gender,
        dateOfBirth: row.dateOfBirth ? row.dateOfBirth.toISOString().slice(0, 10) : null,
        preferredLanguage: row.preferredLanguage, howHeard: row.howHeard,
        guardianName: row.guardianName, guardianRelationship: row.guardianRelationship,
        photoDataUrl: null as string | null, business,
      },
    };
  });

  if (!detail) return null;
  // Fetch the photo AFTER the DB txn (network call); inline as a data URL for the
  // admin CSP (img-src 'self' blob: data:).
  const photoDataUrl = detail.photoPath ? await imageDataUrl(detail.photoPath) : null;
  return { ...detail.detail, photoDataUrl };
}

/** Set an app_user's status (approve / suspend / reactivate) with audit. */
async function setStatus(id: string, status: UserStatus): Promise<{ email: string; fullName: string }> {
  const viewer = await requireAdmin();
  assertCan(viewer, "user:manage");
  if (!UUID_RE.test(id)) throw new Error("User not found");

  return withAdminContext(viewer, async (tx) => {
    const [u] = await tx<{ email: string; fullName: string }[]>`
      SELECT email, full_name AS "fullName" FROM app_user WHERE id = ${id}
    `;
    if (!u) throw new Error("User not found");
    await tx`UPDATE app_user SET status = ${status}, updated_at = now() WHERE id = ${id}`;
    await recordAudit(
      { actor: viewer, action: `user.${status}`, resourceType: "app_user", resourceId: id },
      tx,
    );
    return u;
  });
}

/**
 * Approve an applicant: mark active, then (if they have not set a password yet)
 * email a "set your password" activation link. Reuses the reset-password token
 * + page — controlling the link proves email ownership and creates the
 * credential.
 */
export async function approveUser(id: string): Promise<void> {
  const admin = await requireAdmin();
  assertCan(admin, "user:manage");
  const { email, fullName } = await setStatus(id, "active");

  await withAdminContext(admin, async (tx) => {
    await emitTimelineEvent(tx, {
      userId: id,
      type: "user.approved",
      title: "Application approved",
      body: "Your PRIME application was approved.",
    });
    await emitNotification(tx, {
      userId: id,
      type: "user.approved",
      title: "Application approved",
      body: "Set your password from the activation email to access your dashboard.",
      link: "/login",
    });
  });

  const sent = await withAuthContext(async (tx) => {
    // Already activated? (credential rows are only visible in the auth context.)
    const cred = await tx`SELECT 1 FROM user_credential WHERE user_id = ${id}`;
    if (cred.length > 0) return false;
    // Invalidate any outstanding activation tokens, then issue a fresh one.
    await tx`
      UPDATE user_email_token SET consumed_at = now()
      WHERE user_id = ${id} AND kind = 'reset' AND consumed_at IS NULL
    `;
    const { token, hash } = newToken();
    await tx`
      INSERT INTO user_email_token (token_hash, user_id, kind, expires_at)
      VALUES (${hash}, ${id}, 'reset',
              now() + ${`${ACTIVATION_TTL_MS} milliseconds`}::interval)
    `;
    return token;
  });

  if (sent) {
    const baseUrl = appBaseUrl();
    const url = `${baseUrl}/reset-password?token=${sent}`;
    await sendEmail({
      to: email,
      ...(await activationEmail({ baseUrl, name: fullName, url })),
    });
  }
}

export async function suspendUser(id: string): Promise<void> {
  await setStatus(id, "suspended");
}

export async function reactivateUser(id: string): Promise<void> {
  await setStatus(id, "active");
}
