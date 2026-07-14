"use server";

import { revalidatePath } from "next/cache";
import { requestPrimeId } from "@/lib/dal/prime-id";
import type { FormState } from "@/lib/forms";

export async function requestPrimeIdAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const res = await requestPrimeId({
    holderType: formData.get("holderType"),
    customRoleLabel: formData.get("customRoleLabel") || "",
    category: formData.get("category") || null,
    ventureName: formData.get("ventureName") || "",
    customDetails: [],
  });
  if (res.ok) {
    revalidatePath("/account/id-card");
    return { status: "success" };
  }
  return {
    status: "error",
    formError: res.error,
    fieldErrors: res.fieldErrors,
  };
}
