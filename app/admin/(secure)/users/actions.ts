"use server";

import { revalidatePath } from "next/cache";
import { approveUser, suspendUser, reactivateUser } from "@/lib/dal/users";

/**
 * Thin actions. Auth, authz, audit, and the activation email all happen inside
 * the DAL — these are treated as public POST endpoints.
 */
export async function approveUserAction(formData: FormData) {
  await approveUser(String(formData.get("userId")));
  revalidatePath("/admin/users");
}

export async function suspendUserAction(formData: FormData) {
  await suspendUser(String(formData.get("userId")));
  revalidatePath("/admin/users");
}

export async function reactivateUserAction(formData: FormData) {
  await reactivateUser(String(formData.get("userId")));
  revalidatePath("/admin/users");
}
