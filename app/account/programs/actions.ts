"use server";

import { revalidatePath } from "next/cache";
import { applyToProgram, withdrawApplication } from "@/lib/dal/programs";

/**
 * Thin member Server Actions. Auth, validation, cycle-open + duplicate checks,
 * audit, and the timeline/notification emits all happen inside the DAL.
 */
export async function applyAction(data: {
  cycleId: string;
  summary: string;
  objective: string;
}) {
  const res = await applyToProgram(data);
  if (res.ok) revalidatePath("/account/programs");
  return res;
}

export async function withdrawAction(applicationId: string) {
  const res = await withdrawApplication(applicationId);
  if (res.ok) revalidatePath("/account/programs");
  return res;
}
