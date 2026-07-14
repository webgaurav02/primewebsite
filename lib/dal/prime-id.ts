import "server-only";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { assertCan } from "@/lib/auth/rbac";
import { requireUser } from "@/lib/auth/user-session";
import { withAdminContext, withUserContext, getSql } from "@/lib/db/client";
import { recordAudit } from "@/lib/audit/log";
import { emitTimelineEvent, emitNotification } from "@/lib/dal/events";
import { allocatePrimeIdNumber } from "@/lib/prime-id/id-number";
import {
  signPrimeToken,
  verifyPrimeToken,
  tokenHash,
  tokenFingerprint,
  buildVerifyUrl,
} from "@/lib/prime-id/token";
import {
  primeIdRequestSchema,
  revokeSchema,
  rejectSchema,
} from "@/lib/validation/prime-id";
import { imageDataUrl } from "@/lib/storage";

/**
 * Data Access Layer for PRIME ID credentials. Issuance is the security-critical
 * path: it happens ONLY here, server-side — the number comes from a row-locked
 * DB sequence and the token is Ed25519-signed with the env private key. Every
 * mutation is audited.
 */

type FieldErrors = Record<string, string[]>;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALIDITY_YEARS = 5;

export type HolderType = "entrepreneur" | "mentor" | "other";
export type Category = "startup" | "nano" | "livelihood";
export type RequestStatus = "pending" | "approved" | "rejected" | "issued";
export type CredStatus = "active" | "revoked" | "expired";

// ── Member: request a PRIME ID ────────────────────────────────────────────────

export type RequestResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

export async function requestPrimeId(raw: unknown): Promise<RequestResult> {
  const user = await requireUser();
  const parsed = primeIdRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the form.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as FieldErrors,
    };
  }
  const d = parsed.data;

  return withUserContext(user.id, async (tx) => {
    // Guard: no request while one is pending or a credential is already active.
    const [openReq] = await tx`
      SELECT 1 FROM prime_id_request WHERE user_id = ${user.id} AND status = 'pending'`;
    if (openReq) return { ok: false, error: "You already have a PRIME ID request under review." };

    const [profile] = await tx<{ fullName: string; district: string | null; ventureName: string | null }[]>`
      SELECT u.full_name AS "fullName", u.district, ep.business_name AS "ventureName"
      FROM app_user u
      LEFT JOIN entrepreneur_profile ep ON ep.user_id = u.id
      WHERE u.id = ${user.id}`;

    await tx`
      INSERT INTO prime_id_request
        (user_id, holder_type, custom_role_label, category, venture_name,
         district, full_name, photo_path, custom_details, status)
      VALUES
        (${user.id}, ${d.holderType}, ${d.customRoleLabel || null}, ${d.category},
         ${d.ventureName || profile?.ventureName || null},
         ${profile?.district ?? ""}, ${profile?.fullName ?? ""},
         ${d.photoPath || null}, ${JSON.stringify(d.customDetails)}::jsonb, 'pending')`;

    await recordAudit(
      { actor: { kind: "system", id: user.id, email: user.email },
        action: "prime_id.request", resourceType: "prime_id_request" },
      tx,
    );
    await emitTimelineEvent(tx, {
      userId: user.id,
      type: "id.requested",
      title: "PRIME ID requested",
      body: "Your PRIME ID request was submitted for review.",
    });
    return { ok: true };
  });
}

// ── Member: my request status + my issued card ────────────────────────────────

export interface MyPrimeIdState {
  request: { status: RequestStatus; rejectionReason: string | null } | null;
  credential: PrimeIdCardDTO | null;
}

export interface PrimeIdCardDTO {
  id: string;
  fullName: string;
  holderType: HolderType;
  customRoleLabel: string | null;
  category: Category | null;
  ventureName: string | null;
  district: string;
  issueDate: string;
  validThru: string;
  status: CredStatus;
  customDetails: { label: string; value: string }[];
  verifyUrl: string;
  tokenFingerprint: string;
  photoDataUrl: string | null;
}

export async function getMyPrimeId(): Promise<MyPrimeIdState> {
  const user = await requireUser();

  const { request, cred } = await withUserContext(user.id, async (tx) => {
    const [req] = await tx<{ status: RequestStatus; rejectionReason: string | null }[]>`
      SELECT status, rejection_reason AS "rejectionReason"
      FROM prime_id_request WHERE user_id = ${user.id}
      ORDER BY requested_at DESC LIMIT 1`;

    const [c] = await tx<
      {
        id: string; fullName: string; holderType: HolderType;
        customRoleLabel: string | null; category: Category | null;
        ventureName: string | null; district: string; issueDate: Date;
        validThru: Date; status: CredStatus; customDetails: { label: string; value: string }[];
        token: string; tokenFingerprint: string; photoPath: string | null;
      }[]
    >`
      SELECT id, full_name AS "fullName", holder_type AS "holderType",
             custom_role_label AS "customRoleLabel", category,
             venture_name AS "ventureName", district, issue_date AS "issueDate",
             valid_thru AS "validThru", status, custom_details AS "customDetails",
             token, token_fingerprint AS "tokenFingerprint", photo_path AS "photoPath"
      FROM prime_id_credential
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC LIMIT 1`;

    return {
      request: req ? { status: req.status, rejectionReason: req.rejectionReason } : null,
      cred: c ?? null,
    };
  });

  // Fetch the photo AFTER the DB transaction (network call, don't hold the conn).
  const photoDataUrl = cred?.photoPath ? await imageDataUrl(cred.photoPath) : null;

  return {
    request,
    credential: cred
      ? {
          id: cred.id, fullName: cred.fullName, holderType: cred.holderType,
          customRoleLabel: cred.customRoleLabel, category: cred.category,
          ventureName: cred.ventureName, district: cred.district,
          issueDate: cred.issueDate.toISOString().slice(0, 10),
          validThru: cred.validThru.toISOString().slice(0, 10),
          status: cred.status, customDetails: cred.customDetails,
          verifyUrl: buildVerifyUrl(cred.token),
          tokenFingerprint: cred.tokenFingerprint,
          photoDataUrl,
        }
      : null,
  };
}

// ── Admin: review queue ───────────────────────────────────────────────────────

export interface PrimeIdRequestRow {
  id: string;
  userId: string;
  fullName: string;
  holderType: HolderType;
  category: Category | null;
  ventureName: string | null;
  district: string;
  status: RequestStatus;
  requestedAt: string;
}

export async function listPrimeIdRequests(status?: RequestStatus): Promise<PrimeIdRequestRow[]> {
  const admin = await requireAdmin();
  assertCan(admin, "prime_id:review");
  return withAdminContext(admin, async (tx) => {
    const rows = await tx<
      (Omit<PrimeIdRequestRow, "requestedAt"> & { requestedAt: Date })[]
    >`
      SELECT r.id, r.user_id AS "userId", r.full_name AS "fullName",
             r.holder_type AS "holderType", r.category,
             r.venture_name AS "ventureName", r.district, r.status,
             r.requested_at AS "requestedAt"
      FROM prime_id_request r
      WHERE TRUE ${status ? tx`AND r.status = ${status}` : tx``}
      ORDER BY r.requested_at DESC`;
    await recordAudit(
      { actor: admin, action: "prime_id.list_requests", resourceType: "prime_id_request",
        metadata: { count: rows.length } },
      tx,
    );
    return rows.map((r) => ({ ...r, requestedAt: r.requestedAt.toISOString() }));
  });
}

// ── Admin: approve → issue (the security-critical path) ───────────────────────

export async function approveAndIssuePrimeId(requestId: string): Promise<{ ok: boolean; id?: string; error?: string }> {
  const admin = await requireAdmin();
  assertCan(admin, "prime_id:review");
  if (!UUID_RE.test(requestId)) return { ok: false, error: "Request not found" };

  return withAdminContext(admin, async (tx) => {
    const [req] = await tx<
      {
        userId: string; holderType: HolderType; customRoleLabel: string | null;
        category: Category | null; ventureName: string | null; district: string;
        fullName: string; photoPath: string | null; customDetails: { label: string; value: string }[];
        status: RequestStatus;
      }[]
    >`
      SELECT user_id AS "userId", holder_type AS "holderType",
             custom_role_label AS "customRoleLabel", category,
             venture_name AS "ventureName", district, full_name AS "fullName",
             photo_path AS "photoPath", custom_details AS "customDetails", status
      FROM prime_id_request WHERE id = ${requestId} FOR UPDATE`;
    if (!req) return { ok: false, error: "Request not found" };
    if (req.status !== "pending") return { ok: false, error: `Request is already ${req.status}.` };

    const now = new Date();
    const year = Number(now.toISOString().slice(0, 4));
    const id = await allocatePrimeIdNumber(tx, year);
    const issueDate = now.toISOString().slice(0, 10);
    const validThruDate = new Date(now);
    validThruDate.setFullYear(validThruDate.getFullYear() + VALIDITY_YEARS);
    const validThru = validThruDate.toISOString().slice(0, 10);

    const token = signPrimeToken({
      id,
      sub: req.fullName,
      typ: req.holderType,
      cat: req.category,
      dst: req.district,
      exp: Math.floor(validThruDate.getTime() / 1000),
    });
    const hash = tokenHash(token);
    const fingerprint = tokenFingerprint(token);

    await tx`
      INSERT INTO prime_id_credential
        (id, request_id, user_id, full_name, holder_type, custom_role_label,
         category, venture_name, district, photo_path, custom_details,
         issue_date, valid_thru, token, token_hash, token_fingerprint,
         status, issued_by)
      VALUES
        (${id}, ${requestId}, ${req.userId}, ${req.fullName}, ${req.holderType},
         ${req.customRoleLabel}, ${req.category}, ${req.ventureName},
         ${req.district}, ${req.photoPath}, ${JSON.stringify(req.customDetails)}::jsonb,
         ${issueDate}, ${validThru}, ${token}, ${hash}, ${fingerprint},
         'active', ${admin.id})`;

    await tx`
      UPDATE prime_id_request
      SET status = 'issued', reviewed_by = ${admin.id}, reviewed_at = now()
      WHERE id = ${requestId}`;

    await recordAudit(
      { actor: admin, action: "prime_id.issue", resourceType: "prime_id_credential",
        resourceId: id, metadata: { requestId, userId: req.userId } },
      tx,
    );
    await emitTimelineEvent(tx, {
      userId: req.userId,
      type: "id.issued",
      title: "PRIME ID issued",
      body: `Your PRIME ID ${id} has been issued.`,
      metadata: { id },
    });
    await emitNotification(tx, {
      userId: req.userId,
      type: "id.issued",
      title: "Your PRIME ID is ready",
      body: `Credential ${id} has been issued. Download your card from your account.`,
      link: "/account/id-card",
    });
    return { ok: true, id };
  });
}

export async function rejectPrimeIdRequest(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  assertCan(admin, "prime_id:review");
  const parsed = rejectSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "A reason is required." };
  const { requestId, reason } = parsed.data;

  return withAdminContext(admin, async (tx) => {
    const [req] = await tx<{ status: RequestStatus; userId: string }[]>`
      SELECT status, user_id AS "userId" FROM prime_id_request WHERE id = ${requestId} FOR UPDATE`;
    if (!req) return { ok: false, error: "Request not found" };
    if (req.status !== "pending") return { ok: false, error: `Request is already ${req.status}.` };
    await tx`
      UPDATE prime_id_request
      SET status = 'rejected', rejection_reason = ${reason},
          reviewed_by = ${admin.id}, reviewed_at = now()
      WHERE id = ${requestId}`;
    await recordAudit(
      { actor: admin, action: "prime_id.reject", resourceType: "prime_id_request",
        resourceId: requestId, metadata: { reason } },
      tx,
    );
    await emitTimelineEvent(tx, {
      userId: req.userId, type: "id.rejected", title: "PRIME ID request declined", body: reason,
    });
    await emitNotification(tx, {
      userId: req.userId, type: "id.rejected", title: "PRIME ID request declined",
      body: reason, link: "/account/id-card",
    });
    return { ok: true };
  });
}

export async function revokePrimeIdCredential(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  assertCan(admin, "prime_id:review");
  const parsed = revokeSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "A reason is required." };
  const { credentialId, reason } = parsed.data;

  return withAdminContext(admin, async (tx) => {
    const [cred] = await tx<{ status: CredStatus; userId: string }[]>`
      SELECT status, user_id AS "userId" FROM prime_id_credential WHERE id = ${credentialId} FOR UPDATE`;
    if (!cred) return { ok: false, error: "Credential not found" };
    await tx`
      UPDATE prime_id_credential
      SET status = 'revoked', revoked_at = now(), revoked_reason = ${reason}
      WHERE id = ${credentialId}`;
    await recordAudit(
      { actor: admin, action: "prime_id.revoke", resourceType: "prime_id_credential",
        resourceId: credentialId, metadata: { reason } },
      tx,
    );
    await emitTimelineEvent(tx, {
      userId: cred.userId, type: "id.revoked", title: "PRIME ID revoked", body: reason,
    });
    await emitNotification(tx, {
      userId: cred.userId, type: "id.revoked", title: "PRIME ID revoked", body: reason,
    });
    return { ok: true };
  });
}

// ── Public: verify a token (no auth) ──────────────────────────────────────────

export interface PublicVerifyResult {
  valid: boolean;
  reason?: string;
  credential?: {
    id: string;
    fullName: string;
    holderType: HolderType;
    category: Category | null;
    ventureName: string | null;
    district: string;
    issueDate: string;
    validThru: string;
    status: CredStatus;
    photoDataUrl: string | null;
  };
}

export async function verifyPrimeIdToken(token: string): Promise<PublicVerifyResult> {
  if (!token || token.length > 4096) return { valid: false, reason: "Malformed token" };

  // 1) Signature + issuer + expiry (no DB, pure crypto).
  const sig = verifyPrimeToken(token);
  if (!sig.valid) return { valid: false, reason: sig.reason };

  // 2) Authoritative DB status by token hash (via the SECURITY DEFINER lookup —
  //    never reads the token column or any other credential).
  const [row] = await getSql()<
    {
      id: string; fullName: string; holderType: HolderType; category: Category | null;
      ventureName: string | null; district: string; photoPath: string | null;
      issueDate: Date; validThru: Date; status: CredStatus;
    }[]
  >`
    SELECT id, full_name AS "fullName", holder_type AS "holderType", category,
           venture_name AS "ventureName", district, photo_path AS "photoPath",
           issue_date AS "issueDate", valid_thru AS "validThru", status
    FROM prime_id_public_lookup(${tokenHash(token)})`;

  if (!row) return { valid: false, reason: "Credential not found" };
  if (row.status === "revoked") return { valid: false, reason: "Credential revoked" };
  if (row.status === "expired") return { valid: false, reason: "Credential expired" };

  const photoDataUrl = row.photoPath ? await imageDataUrl(row.photoPath) : null;

  return {
    valid: true,
    credential: {
      id: row.id, fullName: row.fullName, holderType: row.holderType,
      category: row.category, ventureName: row.ventureName, district: row.district,
      issueDate: row.issueDate.toISOString().slice(0, 10),
      validThru: row.validThru.toISOString().slice(0, 10),
      status: row.status, photoDataUrl,
    },
  };
}
