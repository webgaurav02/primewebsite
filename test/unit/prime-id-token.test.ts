import { describe, test, expect } from "vitest";
import {
  signPrimeToken,
  verifyPrimeToken,
  tokenHash,
  tokenFingerprint,
} from "@/lib/prime-id/token";

const base = {
  id: "PRM-ML-2026-000001",
  sub: "Kyrsoibor Nongrum",
  typ: "entrepreneur",
  cat: "startup" as const,
  dst: "East Khasi Hills",
  exp: Math.floor(Date.now() / 1000) + 3600,
};

describe("PRIME ID token (Ed25519)", () => {
  test("a freshly signed token verifies and round-trips the payload", () => {
    const token = signPrimeToken(base);
    const res = verifyPrimeToken(token);
    expect(res.valid).toBe(true);
    expect(res.payload?.id).toBe(base.id);
    expect(res.payload?.sub).toBe(base.sub);
    expect(res.payload?.v).toBe(2);
    expect(res.payload?.jti).toBeTruthy();
  });

  test("the same inputs still produce distinct tokens (random jti)", () => {
    expect(signPrimeToken(base)).not.toBe(signPrimeToken(base));
  });

  test("a tampered payload fails the signature", () => {
    const [h, , s] = signPrimeToken(base).split(".");
    const forged = Buffer.from(
      JSON.stringify({ ...base, sub: "Someone Else", v: 2, iat: 0, iss: "prime.meghalaya.gov.in", jti: "x" }),
    ).toString("base64url");
    const res = verifyPrimeToken(`${h}.${forged}.${s}`);
    expect(res.valid).toBe(false);
  });

  test("a garbage token is rejected, not thrown", () => {
    expect(verifyPrimeToken("not.a.token").valid).toBe(false);
    expect(verifyPrimeToken("only-one-part").valid).toBe(false);
  });

  test("an expired credential is invalid", () => {
    const token = signPrimeToken({ ...base, exp: Math.floor(Date.now() / 1000) - 10 });
    const res = verifyPrimeToken(token);
    expect(res.valid).toBe(false);
    expect(res.reason).toMatch(/expired/i);
  });

  test("tokenHash is stable SHA-256; fingerprint is short", () => {
    const token = signPrimeToken(base);
    expect(tokenHash(token)).toMatch(/^[0-9a-f]{64}$/);
    expect(tokenHash(token)).toBe(tokenHash(token));
    expect(tokenFingerprint(token).length).toBeLessThanOrEqual(13);
  });
});
