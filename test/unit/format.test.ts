import { describe, test, expect } from "vitest";
import { formatINR, formatCount, monthYear, shortDate } from "@/lib/format/display";

/**
 * Impact financials render as grouped Indian-format numbers, never vague text.
 */
describe("formatINR", () => {
  test("groups whole rupees the Indian way", () => {
    expect(formatINR(500000)).toBe("₹5,00,000");
    expect(formatINR(2000000)).toBe("₹20,00,000");
    expect(formatINR(0)).toBe("₹0");
    expect(formatINR(1234567)).toBe("₹12,34,567");
  });

  test("null/undefined/NaN fall back to the placeholder", () => {
    expect(formatINR(null)).toBe("—");
    expect(formatINR(undefined)).toBe("—");
    expect(formatINR(Number.NaN)).toBe("—");
    expect(formatINR(null, "N/A")).toBe("N/A");
  });
});

describe("formatCount", () => {
  test("groups counts and handles null", () => {
    expect(formatCount(20)).toBe("20");
    expect(formatCount(120000)).toBe("1,20,000");
    expect(formatCount(null)).toBe("—");
  });
});

describe("date helpers", () => {
  test("monthYear / shortDate format ISO input", () => {
    expect(monthYear("2024-01-15T00:00:00.000Z")).toMatch(/2024/);
    expect(shortDate("2026-07-15T00:00:00.000Z")).toMatch(/2026/);
    expect(monthYear("not-a-date")).toBe("—");
  });
});
