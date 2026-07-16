"use server";

import { revalidatePath } from "next/cache";
import { reviewApplication } from "@/lib/dal/programs";

// Thin wrappers only — auth, validation, and audit live in the DAL (Server
// Actions are public POST endpoints; see lib/dal/programs.ts).

export async function reviewApplicationAction(formData: FormData): Promise<void> {
  const applicationId = String(formData.get("applicationId") ?? "");
  await reviewApplication({
    applicationId,
    status: String(formData.get("status") ?? ""),
    note: String(formData.get("note") ?? ""),
  });
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${applicationId}`);
}
