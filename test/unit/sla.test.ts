import { describe, test, expect } from "vitest";
import { addWorkingDays, computeSla, isAckOverdue, isResolveOverdue } from "@/lib/grievance/sla";
import { blindIndex } from "@/lib/crypto/pii";

describe("SLA working-day math", () => {
  test("3 working days from a Thursday lands on the next Tuesday (skips weekend)", () => {
    const thu = new Date("2026-07-16T09:00:00Z"); // Thursday
    const due = addWorkingDays(thu, 3);
    expect(due.getUTCDay()).toBe(2); // Tuesday
    expect(due.toISOString().slice(0, 10)).toBe("2026-07-21");
  });

  test("computeSla sets ack (3 working days) and resolve (30 calendar days)", () => {
    const created = new Date("2026-07-01T00:00:00Z");
    const { ackDue, resolveDue } = computeSla(created);
    expect(ackDue.getTime()).toBeGreaterThan(created.getTime());
    expect(resolveDue.toISOString().slice(0, 10)).toBe("2026-07-31");
  });

  test("overdue flags", () => {
    const past = new Date(Date.now() - 86_400_000);
    const future = new Date(Date.now() + 86_400_000);
    expect(isAckOverdue("submitted", past)).toBe(true);
    expect(isAckOverdue("under_review", past)).toBe(false); // acknowledged
    expect(isAckOverdue("submitted", future)).toBe(false);
    expect(isResolveOverdue("in_progress", past)).toBe(true);
    expect(isResolveOverdue("resolved", past)).toBe(false);
    expect(isResolveOverdue("rejected", past)).toBe(false);
  });
});

describe("email blind index", () => {
  test("is deterministic and case/space-insensitive", () => {
    const a = blindIndex("Person@Example.com");
    expect(a).toBe(blindIndex("  person@example.com "));
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toBe(blindIndex("other@example.com"));
  });
});
