import "server-only";
import crypto from "node:crypto";

/**
 * Field-level encryption for PII columns (the `_enc bytea` columns in the
 * schema). AES-256-GCM, key from the environment — disk-level encryption at
 * rest is not sufficient when the threat is exposure of complainant identity
 * (see db/README.md §PII encryption).
 *
 * Wire format (bytea): iv(12) || authTag(16) || ciphertext
 *
 * db/seed-dev.ts mirrors this format with its own inline implementation (it
 * runs under plain Node without path aliases) — keep the two in sync.
 */

const IV_LENGTH = 12;
const TAG_LENGTH = 16;

let cachedKey: Buffer | null = null;

function getKey(): Buffer {
  if (cachedKey) return cachedKey;
  const b64 = process.env.PII_ENCRYPTION_KEY;
  if (!b64) {
    throw new Error(
      "PII_ENCRYPTION_KEY is not set. Generate one with `openssl rand -base64 32`.",
    );
  }
  const key = Buffer.from(b64, "base64");
  if (key.length !== 32) {
    throw new Error("PII_ENCRYPTION_KEY must decode to exactly 32 bytes.");
  }
  cachedKey = key;
  return key;
}

export function encryptPII(plaintext: string): Buffer {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]);
}

export function decryptPII(data: Buffer | Uint8Array): string {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  if (buf.length < IV_LENGTH + TAG_LENGTH) {
    throw new Error("Corrupt PII ciphertext (too short)");
  }
  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const ciphertext = buf.subarray(IV_LENGTH + TAG_LENGTH);
  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
    "utf8",
  );
}

/**
 * Keyed blind index for equality lookups on an encrypted value without
 * decrypting it (HMAC-SHA256 over the normalized value). Used so public
 * grievance tracking can require the ticket ref AND the submitter's email.
 */
export function blindIndex(value: string): string {
  return crypto
    .createHmac("sha256", getKey())
    .update(value.trim().toLowerCase())
    .digest("hex");
}
