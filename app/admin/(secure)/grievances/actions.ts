"use server";

import { revalidatePath } from "next/cache";
import {
  updateGrievanceStatus,
  assignGrievance,
  escalateGrievance,
} from "@/lib/dal/grievances";

/**
 * Thin Server Actions. Auth, authz, region scope, validation, audit, and the
 * complainant timeline/notification all happen inside the DAL — these are
 * public POST endpoints regardless of which UI renders them.
 */
export async function updateStatusAction(formData: FormData) {
  await updateGrievanceStatus({
    grievanceId: formData.get("grievanceId"),
    status: formData.get("status"),
    note: formData.get("note") || undefined,
  });
  revalidatePath("/admin/grievances");
}

export async function assignAction(formData: FormData) {
  await assignGrievance({
    grievanceId: formData.get("grievanceId"),
    assigneeId: formData.get("assigneeId"),
  });
  revalidatePath("/admin/grievances");
}

export async function escalateAction(formData: FormData) {
  await escalateGrievance({ grievanceId: formData.get("grievanceId") });
  revalidatePath("/admin/grievances");
}
