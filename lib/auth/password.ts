import "server-only";
import crypto from "node:crypto";
import { promisify } from "node:util";

/**
 * Password hashing with Node's built-in scrypt (OWASP-recommended, zero deps).
 *
 * Stored format:  scrypt$N$r$p$<salt-b64>$<derivedKey-b64>
 * The parameters travel with the hash so they can be raised later without
 * breaking existing hashes.
 */

const scrypt = promisify(crypto.scrypt) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: crypto.ScryptOptions,
) => Promise<Buffer>;

// cost=2^15. memory ≈ 128*N*r ≈ 32 MB, so bump maxmem above Node's 32 MB default.
const N = 32768;
const r = 8;
const p = 1;
const KEYLEN = 64;
const MAXMEM = 64 * 1024 * 1024;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const dk = await scrypt(password, salt, KEYLEN, { N, r, p, maxmem: MAXMEM });
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${dk.toString("base64")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, nStr, rStr, pStr, saltB64, dkB64] = parts;
  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(dkB64, "base64");
  let dk: Buffer;
  try {
    dk = await scrypt(password, salt, expected.length, {
      N: Number(nStr),
      r: Number(rStr),
      p: Number(pStr),
      maxmem: MAXMEM,
    });
  } catch {
    return false;
  }
  return dk.length === expected.length && crypto.timingSafeEqual(dk, expected);
}

/**
 * A real, throwaway hash of a random secret. Login verifies against this when
 * no account matches the email, so response time doesn't reveal whether the
 * email exists (timing-based user enumeration). Computed lazily and cached.
 */
let dummyHashPromise: Promise<string> | null = null;

export function getDummyPasswordHash(): Promise<string> {
  if (!dummyHashPromise) {
    dummyHashPromise = hashPassword(crypto.randomBytes(24).toString("hex"));
  }
  return dummyHashPromise;
}
