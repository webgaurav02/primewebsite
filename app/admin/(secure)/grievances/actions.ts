"use server";

import { revalidatePath } from "next/cache";
import { updateGrievanceStatus } from "@/lib/dal/grievances";

/**
 * Thin Server Action. It does NOT trust the caller — auth, authz, region scope,
 * validation and audit all happen inside the DAL (updateGrievanceStatus).
 *
 * Reminder: this action is a public POST endpoint regardless of which UI renders
 * it, which is exactly why the real checks live in the DAL, not in the page.
 */
export async function updateStatusAction(formData: FormData) {
  await updateGrievanceStatus({
    grievanceId: formData.get("grievanceId"),
    status: formData.get("status"),
    note: formData.get("note") || undefined,
  });
  revalidatePath("/admin/grievances");
}
