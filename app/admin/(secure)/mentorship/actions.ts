"use server";

import { revalidatePath } from "next/cache";
import { assignMentor, endAssignment } from "@/lib/dal/mentorship";

/**
 * Thin admin Server Actions. requireAdmin + assertCan("mentorship:manage"),
 * validation, and audit all live in the DAL.
 */
export async function assignMentorAction(formData: FormData) {
  await assignMentor({
    mentorId: formData.get("mentorId"),
    menteeId: formData.get("menteeId"),
  });
  revalidatePath("/admin/mentorship");
}

export async function endAssignmentAction(formData: FormData) {
  await endAssignment(String(formData.get("assignmentId") ?? ""));
  revalidatePath("/admin/mentorship");
}
