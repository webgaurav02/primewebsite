import { describe, test, expect, afterEach, vi } from "vitest";
import { ageFromDob, isMinorDob } from "@/lib/legal/policy";

/**
 * The DPDP s.9 minor gate must flip at IST midnight of the 18th birthday, not at
 * UTC midnight — otherwise an adult can be forced into the guardian flow, or (worse)
 * a real minor can slip through as an adult with no guardian consent recorded.
 */

afterEach(() => vi.useRealTimers());

describe("age gate on the IST civil date", () => {
  test("flips from 17 to 18 at IST midnight of the birthday (born 2008-07-14)", () => {
    // 2026-07-13 23:59 IST = 2026-07-13T18:29Z → still 17 (minor).
    vi.setSystemTime(new Date("2026-07-13T18:29:00Z"));
    expect(ageFromDob("2008-07-14")).toBe(17);
    expect(isMinorDob("2008-07-14")).toBe(true);

    // 2026-07-14 00:01 IST = 2026-07-13T18:31Z → 18 (adult).
    vi.setSystemTime(new Date("2026-07-13T18:31:00Z"));
    expect(ageFromDob("2008-07-14")).toBe(18);
    expect(isMinorDob("2008-07-14")).toBe(false);
  });

  test("an adult at 03:00 IST on their 18th birthday is NOT forced into the guardian flow", () => {
    // 03:00 IST on 2026-07-14 = 2026-07-13T21:30Z. The old UTC math wrongly said 17.
    vi.setSystemTime(new Date("2026-07-13T21:30:00Z"));
    expect(isMinorDob("2008-07-14")).toBe(false);
  });

  test("a clear minor and a clear adult are unambiguous", () => {
    vi.setSystemTime(new Date("2026-07-14T06:00:00Z"));
    expect(isMinorDob("2015-06-15")).toBe(true);
    expect(isMinorDob("1990-01-01")).toBe(false);
  });
});
