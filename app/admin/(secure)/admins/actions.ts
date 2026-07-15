"use server";

import { revalidatePath } from "next/cache";
import {
  createAdmin,
  updateAdmin,
  setAdminActive,
  setAdminPassword,
} from "@/lib/dal/admins";
import type { FormState } from "@/lib/forms";

/**
 * Thin admin Server Actions. requireAdmin + assertCan("admin:manage"),
 * validation, guardrails, and audit all live in the DAL. Results are mapped to
 * the shared FormState for `useActionState`-driven feedback.
 */

function toFormState(res: Awaited<ReturnType<typeof createAdmin>>): FormState {
  if (res.ok) return { status: "success" };
  const fieldErrors = res.fieldErrors
    ? Object.fromEntries(
        Object.entries(res.fieldErrors).filter(([, v]) => v != null) as [string, string[]][],
      )
    : undefined;
  return { status: "error", fieldErrors, formError: res.error };
}

export async function createAdminAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const res = await createAdmin({
    email: formData.get("email"),
    name: formData.get("name"),
    role: formData.get("role"),
    regions: formData.getAll("regions"),
    password: formData.get("password"),
  });
  if (res.ok) revalidatePath("/admin/admins");
  return toFormState(res);
}

export async function updateAdminAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const res = await updateAdmin({
    adminId: formData.get("adminId"),
    name: formData.get("name"),
    role: formData.get("role"),
    regions: formData.getAll("regions"),
  });
  if (res.ok) revalidatePath("/admin/admins");
  return toFormState(res);
}

export async function setActiveAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const res = await setAdminActive({
    adminId: formData.get("adminId"),
    isActive: formData.get("isActive") === "true",
  });
  if (res.ok) revalidatePath("/admin/admins");
  return toFormState(res);
}

export async function setPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const res = await setAdminPassword({
    adminId: formData.get("adminId"),
    password: formData.get("password"),
  });
  if (res.ok) revalidatePath("/admin/admins");
  return toFormState(res);
}
