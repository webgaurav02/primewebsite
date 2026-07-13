import crypto from "node:crypto";

/**
 * Pure token helpers shared by the auth DAL and the session seam. No
 * `server-only`, no Next imports — a plain module so it can be unit-tested and
 * imported from either side without pulling in request-scoped APIs.
 *
 * Opaque tokens (session cookies, email links) are random and only their
 * SHA-256 hash is ever stored, so a database dump yields nothing usable.
 */

/** Hash an opaque token for at-rest storage / lookup. */
export function hashSessionToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** A fresh opaque token and its at-rest hash. */
export function newToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(32).toString("base64url");
  return { token, hash: hashSessionToken(token) };
}
