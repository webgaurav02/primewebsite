"use server";

import { requestPasswordReset } from "@/lib/dal/auth";
import { slidingWindow } from "@/lib/security/rate-limit";
import { headers } from "next/headers";
import type { FormState } from "@/lib/forms";

export async function forgotPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  // Throttle so this can't be used to blast reset emails at an address.
  slidingWindow(`reset:${ip ?? "unknown"}`, 5, 15 * 60 * 1000);

  await requestPasswordReset({ email: formData.get("email") });
  // Always report success — never reveal whether the email is registered.
  return { status: "success" };
}
