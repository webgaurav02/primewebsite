import "server-only";
import { requireAdmin } from "@/lib/auth/session";
import { assertCan } from "@/lib/auth/rbac";
import { withAdminContext, withAuthContext } from "@/lib/db/client";
import { recordAudit } from "@/lib/audit/log";
import { newToken } from "@/lib/auth/tokens";
import { sendEmail, appBaseUrl } from "@/lib/email";
import { decryptPII } from "@/lib/crypto/pii";
import type { Persona, UserStatus } from "@/lib/users/types";

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
  persona: Persona;
  status: UserStatus;
  district: string | null;
  businessName: string | null;
  activated: boolean;
  createdAt: string;
}

export interface UserDetail extends UserListItem {
  mobile: string | null;
  gender: string | null;
  organizationId: string | null;
}

export async function listUsers(filters?: {
  status?: UserStatus;
  persona?: Persona;
  q?: string;
}): Promise<UserListItem[]> {
  const viewer = await requireAdmin();
  assertCan(viewer, "user:manage");

  const q = filters?.q ? `%${filters.q.replace(/[\\%_]/g, (c) => `\\${c}`)}%` : null;

  return withAdminContext(viewer, async (tx) => {
    const rows = await tx<
      {
        id: string;
        fullName: string;
        email: string;
        persona: Persona;
        status: UserStatus;
        district: string | null;
        businessName: string | null;
        activated: boolean;
        createdAt: Date;
      }[]
    >`
      SELECT u.id, u.full_name AS "fullName", u.email, u.persona, u.status,
             u.district, ep.business_name AS "businessName",
             (u.email_verified_at IS NOT NULL) AS activated,
             u.created_at AS "createdAt"
      FROM app_user u
      LEFT JOIN entrepreneur_profile ep ON ep.user_id = u.id
      WHERE TRUE
        ${filters?.status ? tx`AND u.status = ${filters.status}` : tx``}
        ${filters?.persona ? tx`AND u.persona = ${filters.persona}` : tx``}
        ${q ? tx`AND (u.full_name ILIKE ${q} OR u.email ILIKE ${q})` : tx``}
      ORDER BY u.created_at DESC
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

    return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
  });
}

export async function getUserDetail(id: string): Promise<UserDetail | null> {
  const viewer = await requireAdmin();
  assertCan(viewer, "user:manage");
  if (!UUID_RE.test(id)) return null;

  return withAdminContext(viewer, async (tx) => {
    const [row] = await tx<
      {
        id: string;
        fullName: string;
        email: string;
        persona: Persona;
        status: UserStatus;
        district: string | null;
        businessName: string | null;
        activated: boolean;
        createdAt: Date;
        mobileEnc: Buffer | null;
        gender: string | null;
        organizationId: string | null;
      }[]
    >`
      SELECT u.id, u.full_name AS "fullName", u.email, u.persona, u.status,
             u.district, ep.business_name AS "businessName",
             (u.email_verified_at IS NOT NULL) AS activated,
             u.created_at AS "createdAt", u.mobile_enc AS "mobileEnc",
             u.gender::text AS gender, u.organization_id AS "organizationId"
      FROM app_user u
      LEFT JOIN entrepreneur_profile ep ON ep.user_id = u.id
      WHERE u.id = ${id}
    `;
    if (!row) return null;

    await recordAudit(
      { actor: viewer, action: "user.view", resourceType: "app_user", resourceId: id },
      tx,
    );

    return {
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      persona: row.persona,
      status: row.status,
      district: row.district,
      businessName: row.businessName,
      activated: row.activated,
      createdAt: row.createdAt.toISOString(),
      mobile: row.mobileEnc ? decryptPII(row.mobileEnc) : null,
      gender: row.gender,
      organizationId: row.organizationId,
    };
  });
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
  const { email, fullName } = await setStatus(id, "active");

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
    const url = `${appBaseUrl()}/reset-password?token=${sent}`;
    await sendEmail({
      to: email,
      subject: "Your PRIME application is approved — set your password",
      text: [
        `Hi ${fullName.split(" ")[0]},`,
        "",
        "Good news — your PRIME application has been approved. Set a password to",
        "activate your account and access your dashboard:",
        url,
        "",
        "This link expires in 7 days.",
      ].join("\n"),
    });
  }
}

export async function suspendUser(id: string): Promise<void> {
  await setStatus(id, "suspended");
}

export async function reactivateUser(id: string): Promise<void> {
  await setStatus(id, "active");
}
