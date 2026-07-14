"use server";

import { revalidatePath } from "next/cache";
import { logSession, type LogResult } from "@/lib/dal/mentorship";

/**
 * Log a mentorship session. The DAL verifies the assignment belongs to the
 * caller (as mentor) and is active, and auto-issues the 5-hour certificate.
 */
export async function logSessionAction(data: {
  assignmentId: string;
  durationMinutes: number;
  mode: string;
  occurredAt: string;
  notes: string;
}): Promise<LogResult> {
  const res = await logSession(data);
  if (res.ok) revalidatePath("/account/mentorship");
  return res;
}
