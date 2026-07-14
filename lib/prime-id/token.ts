import "server-only";
import crypto from "node:crypto";
import { appBaseUrl } from "@/lib/email";

/**
 * PRIME ID verification token — a compact JWS-style token embedded in the card's
 * QR code. Signed with **Ed25519 (asymmetric)**: the private key SIGNS on the
 * server only; the public key VERIFIES. A copied or hand-edited card yields a
 * token whose signature fails — and unlike the old symmetric HMAC, a verifier
 * (or a leaked frontend) can never mint new tokens.
 *
 * Keys come from the environment as base64-encoded PEM (never shipped to the
 * browser). Payload is v2 with a random `jti` so re-issuing the same card face
 * still produces a unique token (Ed25519 is deterministic).
 */

const ISSUER = process.env.PRIME_ID_ISSUER ?? "prime.meghalaya.gov.in";
const KID = process.env.PRIME_ID_SIGNING_KID ?? "prime-ed25519-2026";

export interface TokenPayload {
  v: 2;
  id: string;
  sub: string; // full name
  typ: string; // holder type
  cat: string | null; // category
  dst: string; // district
  iat: number;
  exp: number;
  iss: string;
  jti: string;
}

export interface VerifyResult {
  valid: boolean;
  payload?: TokenPayload;
  reason?: string;
}

let privateKey: crypto.KeyObject | null = null;
let publicKey: crypto.KeyObject | null = null;

function pemFromEnv(name: string): string {
  const b64 = process.env[name];
  if (!b64) throw new Error(`${name} is not set`);
  return Buffer.from(b64, "base64").toString("utf8");
}

function getPrivateKey(): crypto.KeyObject {
  if (!privateKey) {
    privateKey = crypto.createPrivateKey(pemFromEnv("PRIME_ID_SIGNING_PRIVATE_KEY"));
  }
  return privateKey;
}

function getPublicKey(): crypto.KeyObject {
  if (!publicKey) {
    publicKey = crypto.createPublicKey(pemFromEnv("PRIME_ID_SIGNING_PUBLIC_KEY"));
  }
  return publicKey;
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

/** Build a signed token for a freshly-issued credential. */
export function signPrimeToken(
  fields: Omit<TokenPayload, "v" | "iat" | "iss" | "jti">,
): string {
  const header = { alg: "EdDSA", typ: "PRIME-ID", kid: KID };
  const payload: TokenPayload = {
    v: 2,
    ...fields,
    iat: Math.floor(Date.now() / 1000),
    iss: ISSUER,
    jti: crypto.randomBytes(9).toString("base64url"),
  };
  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const sig = crypto.sign(null, Buffer.from(signingInput), getPrivateKey());
  return `${signingInput}.${b64url(sig)}`;
}

/** Verify a token's signature, issuer, and expiry (no DB lookup here). */
export function verifyPrimeToken(token: string): VerifyResult {
  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false, reason: "Malformed token" };
  const [h, p, s] = parts;

  let ok = false;
  try {
    ok = crypto.verify(
      null,
      Buffer.from(`${h}.${p}`),
      getPublicKey(),
      Buffer.from(s, "base64url"),
    );
  } catch {
    return { valid: false, reason: "Signature check failed" };
  }
  if (!ok) return { valid: false, reason: "Invalid signature — not issued by PRIME" };

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(p, "base64url").toString("utf8"));
  } catch {
    return { valid: false, reason: "Unreadable payload" };
  }
  if (payload.iss !== ISSUER) return { valid: false, reason: "Unknown issuer" };
  if (payload.exp * 1000 < Date.now())
    return { valid: false, reason: "Credential expired", payload };
  return { valid: true, payload };
}

export function tokenHash(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Short, human-readable proof printed on the card / shown in the UI. */
export function tokenFingerprint(token: string): string {
  const sig = token.split(".")[2] ?? "";
  return sig.length <= 10 ? sig : `${sig.slice(0, 6)}…${sig.slice(-4)}`;
}

export function buildVerifyUrl(token: string): string {
  return `${appBaseUrl()}/verify?t=${token}`;
}
