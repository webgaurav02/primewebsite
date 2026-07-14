import "server-only";
import { requireAdmin } from "@/lib/auth/session";
import { assertCan } from "@/lib/auth/rbac";
import { requireUser } from "@/lib/auth/user-session";
import { withAdminContext, withUserContext } from "@/lib/db/client";
import { recordAudit } from "@/lib/audit/log";
import { emitTimelineEvent, emitNotification } from "@/lib/dal/events";
import { uploadUserFile, getFileBytes, deleteObject } from "@/lib/storage";
import { documentKindSchema, rejectDocumentSchema } from "@/lib/validation/document";
import type { DocumentKind, DocumentStatus } from "@/lib/documents/types";
import { DOCUMENT_KIND_LABELS } from "@/lib/documents/types";

/**
 * Document vault DAL. The file bytes live in R2; the DB row holds only the
 * opaque key + metadata. RLS is the IDOR guard: every read (including the
 * ownership-checked download routes) runs in the caller's context, so a member
 * only ever reaches their own document keys.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface FilePayload {
  buffer: Buffer;
  mime: string;
  name: string;
}

// ── Member: list my documents ─────────────────────────────────────────────────

export interface MyDocument {
  id: string;
  kind: DocumentKind;
  status: DocumentStatus;
  originalName: string | null;
  mime: string;
  sizeBytes: number;
  uploadedAt: string;
  rejectionReason: string | null;
}

export async function getMyDocuments(): Promise<MyDocument[]> {
  const user = await requireUser();
  return withUserContext(user.id, async (tx) => {
    const rows = await tx<
      (Omit<MyDocument, "uploadedAt"> & { uploadedAt: Date })[]
    >`
      SELECT id, kind, status, original_name AS "originalName", mime,
             size_bytes AS "sizeBytes", uploaded_at AS "uploadedAt",
             rejection_reason AS "rejectionReason"
      FROM document WHERE user_id = ${user.id}
      ORDER BY uploaded_at DESC`;
    return rows.map((r) => ({ ...r, uploadedAt: r.uploadedAt.toISOString() }));
  });
}

// ── Member: upload (replaces an existing document of the same kind) ────────────

export type UploadResult = { ok: true } | { ok: false; error: string };

export async function uploadDocument(
  rawKind: unknown,
  buffer: Buffer,
  originalName: string,
): Promise<UploadResult> {
  const user = await requireUser();
  // Soft-gate: verifying email is required before this resource-consuming action.
  if (!user.emailVerified) {
    return { ok: false, error: "Please verify your email before uploading documents." };
  }
  const parsedKind = documentKindSchema.safeParse(rawKind);
  if (!parsedKind.success) return { ok: false, error: "Pick a valid document type." };
  const kind = parsedKind.data;

  // Upload the bytes FIRST (network), like the ID-card photo path — validation
  // (magic bytes + size) happens inside uploadUserFile.
  const up = await uploadUserFile("documents", user.id, buffer);
  if (!up.ok) return { ok: false, error: up.error };

  const safeName = originalName.slice(0, 200) || null;
  const oldKey = await withUserContext(user.id, async (tx) => {
    // One document per kind: replace any existing one.
    const [existing] = await tx<{ id: string; fileKey: string }[]>`
      SELECT id, file_key AS "fileKey" FROM document
      WHERE user_id = ${user.id} AND kind = ${kind} FOR UPDATE`;
    if (existing) await tx`DELETE FROM document WHERE id = ${existing.id}`;

    await tx`
      INSERT INTO document (user_id, kind, file_key, mime, size_bytes, original_name, status)
      VALUES (${user.id}, ${kind}, ${up.key}, ${up.mime}, ${up.size}, ${safeName}, 'pending')`;

    await emitTimelineEvent(tx, {
      userId: user.id,
      type: "document.uploaded",
      title: `Uploaded ${DOCUMENT_KIND_LABELS[kind]}`,
      body: "Your document is pending verification.",
    });
    await recordAudit(
      { actor: { kind: "system", id: user.id, email: user.email },
        action: "document.upload", resourceType: "document", metadata: { kind } },
      tx,
    );
    return existing?.fileKey ?? null;
  });

  // Best-effort cleanup of the replaced object after the row is gone.
  if (oldKey) {
    try { await deleteObject(oldKey); } catch { /* orphaned object is harmless */ }
  }
  return { ok: true };
}

export async function deleteMyDocument(id: string): Promise<UploadResult> {
  const user = await requireUser();
  if (!UUID_RE.test(id)) return { ok: false, error: "Document not found." };
  const key = await withUserContext(user.id, async (tx) => {
    const [doc] = await tx<{ fileKey: string }[]>`
      SELECT file_key AS "fileKey" FROM document WHERE id = ${id} AND user_id = ${user.id}`;
    if (!doc) return null;
    await tx`DELETE FROM document WHERE id = ${id}`;
    await recordAudit(
      { actor: { kind: "system", id: user.id, email: user.email },
        action: "document.delete", resourceType: "document", resourceId: id },
      tx,
    );
    return doc.fileKey;
  });
  if (!key) return { ok: false, error: "Document not found." };
  try { await deleteObject(key); } catch { /* harmless */ }
  return { ok: true };
}

/**
 * Fetch a member's OWN document bytes for download. RLS scopes the lookup to the
 * caller, so a request for another member's document id returns null (IDOR-safe).
 */
export async function getMyDocumentFile(id: string): Promise<FilePayload | null> {
  const user = await requireUser();
  if (!UUID_RE.test(id)) return null;
  const meta = await withUserContext(user.id, async (tx) => {
    const [doc] = await tx<{ fileKey: string; mime: string; originalName: string | null; kind: DocumentKind }[]>`
      SELECT file_key AS "fileKey", mime, original_name AS "originalName", kind
      FROM document WHERE id = ${id} AND user_id = ${user.id}`;
    return doc ?? null;
  });
  if (!meta) return null;
  const buffer = await getFileBytes(meta.fileKey);
  if (!buffer) return null;
  return { buffer, mime: meta.mime, name: meta.originalName || `${meta.kind}` };
}

// ── Admin: verification queue ─────────────────────────────────────────────────

export interface AdminDocument {
  id: string;
  ownerName: string;
  kind: DocumentKind;
  status: DocumentStatus;
  originalName: string | null;
  mime: string;
  sizeBytes: number;
  uploadedAt: string;
  rejectionReason: string | null;
}

export async function listDocuments(filters?: { status?: DocumentStatus }): Promise<AdminDocument[]> {
  const admin = await requireAdmin();
  assertCan(admin, "document:verify");
  return withAdminContext(admin, async (tx) => {
    const rows = await tx<
      (Omit<AdminDocument, "uploadedAt"> & { uploadedAt: Date })[]
    >`
      SELECT d.id, u.full_name AS "ownerName", d.kind, d.status,
             d.original_name AS "originalName", d.mime, d.size_bytes AS "sizeBytes",
             d.uploaded_at AS "uploadedAt", d.rejection_reason AS "rejectionReason"
      FROM document d JOIN app_user u ON u.id = d.user_id
      WHERE TRUE ${filters?.status ? tx`AND d.status = ${filters.status}` : tx``}
      ORDER BY d.uploaded_at DESC`;
    await recordAudit(
      { actor: admin, action: "document.list", resourceType: "document", metadata: { count: rows.length } },
      tx,
    );
    return rows.map((r) => ({ ...r, uploadedAt: r.uploadedAt.toISOString() }));
  });
}

export async function getDocumentFileAdmin(id: string): Promise<FilePayload | null> {
  const admin = await requireAdmin();
  assertCan(admin, "document:verify");
  if (!UUID_RE.test(id)) return null;
  const meta = await withAdminContext(admin, async (tx) => {
    const [doc] = await tx<{ fileKey: string; mime: string; originalName: string | null; kind: DocumentKind }[]>`
      SELECT file_key AS "fileKey", mime, original_name AS "originalName", kind
      FROM document WHERE id = ${id}`;
    if (doc) {
      await recordAudit(
        { actor: admin, action: "document.view_file", resourceType: "document", resourceId: id },
        tx,
      );
    }
    return doc ?? null;
  });
  if (!meta) return null;
  const buffer = await getFileBytes(meta.fileKey);
  if (!buffer) return null;
  return { buffer, mime: meta.mime, name: meta.originalName || `${meta.kind}` };
}

async function setDocStatus(
  id: string,
  status: "verified" | "rejected",
  reason: string | null,
): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();
  assertCan(admin, "document:verify");
  return withAdminContext(admin, async (tx) => {
    const [doc] = await tx<{ userId: string; kind: DocumentKind }[]>`
      SELECT user_id AS "userId", kind FROM document WHERE id = ${id} FOR UPDATE`;
    if (!doc) return { ok: false, error: "Document not found." };
    await tx`
      UPDATE document
      SET status = ${status}, verified_by = ${admin.id}, verified_at = now(),
          rejection_reason = ${reason}
      WHERE id = ${id}`;
    await recordAudit(
      { actor: admin, action: `document.${status}`, resourceType: "document", resourceId: id,
        metadata: { kind: doc.kind } },
      tx,
    );
    const label = DOCUMENT_KIND_LABELS[doc.kind];
    await emitTimelineEvent(tx, {
      userId: doc.userId,
      type: "document.verified",
      title: status === "verified" ? `${label} verified` : `${label} needs attention`,
      body: status === "verified" ? "Your document was verified." : reason,
    });
    await emitNotification(tx, {
      userId: doc.userId,
      type: "document.verified",
      title: status === "verified" ? `${label} verified` : `${label} rejected`,
      body: status === "verified" ? "Your document was verified." : (reason ?? "Please re-upload."),
      link: "/account/documents",
    });
    return { ok: true };
  });
}

export async function verifyDocument(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!UUID_RE.test(id)) return { ok: false, error: "Document not found." };
  return setDocStatus(id, "verified", null);
}

export async function rejectDocument(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  const parsed = rejectDocumentSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "A short reason is required." };
  return setDocStatus(parsed.data.documentId, "rejected", parsed.data.reason);
}
