import "server-only";
import crypto from "node:crypto";
import { r2Put, r2Get, r2Delete } from "./r2";

/**
 * Pluggable object storage. Today backed by Cloudflare R2 (lib/storage/r2.ts);
 * swap the three r2* calls for another provider without touching callers.
 *
 * Images are validated by magic bytes (not the client's content-type header),
 * size-capped, uploaded under a per-user key, and read back as data URLs.
 */

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024; // 10 MB

const IMAGE_TYPES: { ext: string; mime: string; test: (b: Buffer) => boolean }[] = [
  { ext: "jpg", mime: "image/jpeg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: "png", mime: "image/png", test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { ext: "webp", mime: "image/webp", test: (b) => b.length > 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP" },
];

// Documents also allow PDF (the common KYC/business-document format).
const PDF_TYPE = {
  ext: "pdf",
  mime: "application/pdf",
  test: (b: Buffer) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46, // %PDF
};

/** Detect a supported image by content, or null. */
export function detectImage(buffer: Buffer): { ext: string; mime: string } | null {
  const hit = IMAGE_TYPES.find((t) => t.test(buffer));
  return hit ? { ext: hit.ext, mime: hit.mime } : null;
}

/** Detect a supported document (PDF or image) by content, or null. */
export function detectDocument(buffer: Buffer): { ext: string; mime: string } | null {
  if (PDF_TYPE.test(buffer)) return { ext: PDF_TYPE.ext, mime: PDF_TYPE.mime };
  return detectImage(buffer);
}

function mimeForKey(key: string): string {
  if (key.endsWith(".png")) return "image/png";
  if (key.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export type UploadResult =
  | { ok: true; key: string }
  | { ok: false; error: string };

/** Validate + upload a user's image. `prefix` namespaces the object path. */
export async function uploadUserImage(
  prefix: string,
  userId: string,
  buffer: Buffer,
): Promise<UploadResult> {
  if (buffer.length === 0) return { ok: false, error: "Empty file." };
  if (buffer.length > MAX_IMAGE_BYTES) return { ok: false, error: "Image must be under 5 MB." };
  const kind = detectImage(buffer);
  if (!kind) return { ok: false, error: "Upload a JPEG, PNG, or WebP image." };

  const key = `${prefix}/${userId}/${crypto.randomUUID()}.${kind.ext}`;
  try {
    await r2Put(key, buffer, kind.mime);
  } catch {
    return { ok: false, error: "Upload failed. Please try again." };
  }
  return { ok: true, key };
}

/** Fetch an object and inline it as a data: URL (for html-to-image / SSR). */
export async function imageDataUrl(key: string): Promise<string | null> {
  try {
    const buf = await r2Get(key);
    return `data:${mimeForKey(key)};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export type DocumentUploadResult =
  | { ok: true; key: string; mime: string; size: number }
  | { ok: false; error: string };

/** Validate + upload a user's document (PDF or image) under a per-user key. */
export async function uploadUserFile(
  prefix: string,
  userId: string,
  buffer: Buffer,
): Promise<DocumentUploadResult> {
  if (buffer.length === 0) return { ok: false, error: "Empty file." };
  if (buffer.length > MAX_DOCUMENT_BYTES) return { ok: false, error: "File must be under 10 MB." };
  const kind = detectDocument(buffer);
  if (!kind) return { ok: false, error: "Upload a PDF, JPEG, PNG, or WebP file." };

  const key = `${prefix}/${userId}/${crypto.randomUUID()}.${kind.ext}`;
  try {
    await r2Put(key, buffer, kind.mime);
  } catch {
    return { ok: false, error: "Upload failed. Please try again." };
  }
  return { ok: true, key, mime: kind.mime, size: buffer.length };
}

/** Fetch raw object bytes (for the ownership-checked file-serving routes), or null. */
export async function getFileBytes(key: string): Promise<Buffer | null> {
  try {
    return await r2Get(key);
  } catch {
    return null;
  }
}

export async function deleteObject(key: string): Promise<void> {
  await r2Delete(key);
}
