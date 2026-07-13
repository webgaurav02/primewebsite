import { describe, test, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  getDummyPasswordHash,
} from "@/lib/auth/password";

describe("password hashing (scrypt)", () => {
  test("hash has the encoded scrypt format", async () => {
    const hash = await hashPassword("correct-horse-8");
    expect(hash).toMatch(/^scrypt\$\d+\$\d+\$\d+\$[^$]+\$[^$]+$/);
  });

  test("verifies the correct password", async () => {
    const hash = await hashPassword("correct-horse-8");
    await expect(verifyPassword("correct-horse-8", hash)).resolves.toBe(true);
  });

  test("rejects the wrong password", async () => {
    const hash = await hashPassword("correct-horse-8");
    await expect(verifyPassword("wrong", hash)).resolves.toBe(false);
  });

  test("salts differ, so identical passwords hash differently", async () => {
    const a = await hashPassword("same");
    const b = await hashPassword("same");
    expect(a).not.toBe(b);
    await expect(verifyPassword("same", a)).resolves.toBe(true);
    await expect(verifyPassword("same", b)).resolves.toBe(true);
  });

  test("malformed stored hash never verifies", async () => {
    await expect(verifyPassword("x", "not-a-hash")).resolves.toBe(false);
    await expect(verifyPassword("x", "scrypt$bad")).resolves.toBe(false);
    await expect(verifyPassword("x", "")).resolves.toBe(false);
  });

  test("dummy hash is real and stable within a run", async () => {
    const d1 = await getDummyPasswordHash();
    const d2 = await getDummyPasswordHash();
    expect(d1).toBe(d2);
    expect(d1).toMatch(/^scrypt\$/);
    // No password should verify against it.
    await expect(verifyPassword("anything", d1)).resolves.toBe(false);
  });
});
