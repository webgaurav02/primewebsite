"use server";

import { revalidatePath } from "next/cache";
import { createCycle, setCycleStatus, reviewApplication } from "@/lib/dal/programs";

/**
 * Thin admin Server Actions. requireAdmin + assertCan("program:manage"),
 * validation, and audit all live in the DAL — these are public POST endpoints.
 */
export async function createCycleAction(formData: FormData) {
  await createCycle({
    programId: formData.get("programId"),
    label: formData.get("label"),
    opensAt: formData.get("opensAt") || "",
    closesAt: formData.get("closesAt") || "",
  });
  revalidatePath("/admin/programs");
}

export async function setCycleStatusAction(formData: FormData) {
  await setCycleStatus({
    cycleId: formData.get("cycleId"),
    status: formData.get("status"),
  });
  revalidatePath("/admin/programs");
}

export async function reviewApplicationAction(formData: FormData) {
  await reviewApplication({
    applicationId: formData.get("applicationId"),
    status: formData.get("status"),
    note: formData.get("note") || "",
  });
  revalidatePath("/admin/programs");
}
