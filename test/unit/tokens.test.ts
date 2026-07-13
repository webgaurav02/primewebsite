import { describe, test, expect } from "vitest";
import { hashSessionToken, newToken } from "@/lib/auth/tokens";

describe("opaque token helpers", () => {
  test("hash is deterministic 64-hex SHA-256", () => {
    const h = hashSessionToken("abc");
    expect(h).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
    expect(hashSessionToken("abc")).toBe(h);
  });

  test("newToken returns a random token whose hash matches", () => {
    const a = newToken();
    const b = newToken();
    expect(a.token).not.toBe(b.token);
    expect(a.hash).toBe(hashSessionToken(a.token));
    // The stored hash is not the token itself (a DB dump reveals nothing usable).
    expect(a.hash).not.toBe(a.token);
    expect(a.token.length).toBeGreaterThanOrEqual(40);
  });
});
