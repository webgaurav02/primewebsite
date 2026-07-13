"use server";

import { resetPassword } from "@/lib/dal/auth";
import type { FormState } from "@/lib/forms";

export async function resetPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = await resetPassword({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (result.ok) return { status: "success" };
  if (result.error === "invalid_token") {
    return {
      status: "error",
      formError:
        "This reset link is invalid or has expired. Request a new one from the sign-in page.",
    };
  }
  return { status: "error", fieldErrors: result.fieldErrors };
}
