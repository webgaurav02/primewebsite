"use server";

import { resendVerification } from "@/lib/dal/auth";
import type { FormState } from "@/lib/forms";

export async function resendVerificationAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await resendVerification(formData.get("email"));
  // Always report success — never reveal whether the email exists/needs it.
  return { status: "success" };
}
