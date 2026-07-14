/**
 * Grievance SLA windows (PRIME grievance policy): acknowledge within 3 WORKING
 * days, resolve within 30 calendar days. Pure + unit-testable.
 */

/** Add N working days (Mon–Fri), skipping Sat/Sun. */
export function addWorkingDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setUTCDate(d.getUTCDate() + 1);
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return d;
}

export function computeSla(createdAt: Date): { ackDue: Date; resolveDue: Date } {
  const resolveDue = new Date(createdAt);
  resolveDue.setUTCDate(resolveDue.getUTCDate() + 30);
  return { ackDue: addWorkingDays(createdAt, 3), resolveDue };
}

/** Ack overdue = still unacknowledged (submitted) past the ack due date. */
export function isAckOverdue(status: string, ackDue: Date | null, now = new Date()): boolean {
  return status === "submitted" && ackDue !== null && now > ackDue;
}

/** Resolve overdue = not yet resolved/rejected past the resolve due date. */
export function isResolveOverdue(status: string, resolveDue: Date | null, now = new Date()): boolean {
  return (
    status !== "resolved" &&
    status !== "rejected" &&
    resolveDue !== null &&
    now > resolveDue
  );
}
