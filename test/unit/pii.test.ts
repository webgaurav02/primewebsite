import { describe, test, expect } from "vitest";
import { encryptPII, decryptPII } from "@/lib/crypto/pii";

describe("PII field encryption (AES-256-GCM)", () => {
  test("round-trips plaintext", () => {
    const secret = "+91 90000 00001";
    const enc = encryptPII(secret);
    expect(Buffer.isBuffer(enc)).toBe(true);
    expect(decryptPII(enc)).toBe(secret);
  });

  test("ciphertext is not the plaintext and varies per call (random IV)", () => {
    const a = encryptPII("Wanphrang Kharlukhi");
    const b = encryptPII("Wanphrang Kharlukhi");
    expect(a.equals(b)).toBe(false);
    expect(a.toString("utf8")).not.toContain("Wanphrang");
  });

  test("handles unicode and empty strings", () => {
    for (const s of ["", "Khasi — Jaïntia ✓", "x".repeat(500)]) {
      expect(decryptPII(encryptPII(s))).toBe(s);
    }
  });

  test("tampered ciphertext fails the auth tag", () => {
    const enc = encryptPII("sensitive");
    const tampered = Buffer.from(enc);
    tampered[tampered.length - 1] ^= 0xff; // flip a ciphertext bit
    expect(() => decryptPII(tampered)).toThrow();
  });

  test("truncated ciphertext is rejected", () => {
    expect(() => decryptPII(Buffer.alloc(4))).toThrow(/too short/i);
  });
});
