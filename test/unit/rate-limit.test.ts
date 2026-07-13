import { describe, test, expect } from "vitest";
import { slidingWindow } from "@/lib/security/rate-limit";

describe("sliding-window rate limiter", () => {
  test("allows up to max, then blocks with a retry hint", () => {
    const key = `t-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(slidingWindow(key, 3, 60_000).ok).toBe(true);
    }
    const blocked = slidingWindow(key, 3, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  test("separate keys have independent budgets", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    expect(slidingWindow(a, 1, 60_000).ok).toBe(true);
    expect(slidingWindow(a, 1, 60_000).ok).toBe(false);
    // b is untouched
    expect(slidingWindow(b, 1, 60_000).ok).toBe(true);
  });

  test("entries outside the window are forgotten", async () => {
    const key = `w-${Math.random()}`;
    expect(slidingWindow(key, 1, 20).ok).toBe(true);
    expect(slidingWindow(key, 1, 20).ok).toBe(false);
    await new Promise((r) => setTimeout(r, 40));
    expect(slidingWindow(key, 1, 20).ok).toBe(true);
  });
});
