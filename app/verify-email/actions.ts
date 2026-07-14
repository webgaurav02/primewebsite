"use server";

import { headers } from "next/headers";
import { resendVerification } from "@/lib/dal/auth";
import { slidingWindow } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/client-ip";
import type { FormState } from "@/lib/forms";

export async function resendVerificationAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // Bound the open resend endpoint so it can't be used to email-bomb an address.
  const ip = clientIp(await headers()) ?? "shared";
  const rl = slidingWindow(`resend-verify:${ip}`, 5, 15 * 60 * 1000);
  // Stay uniform even when throttled — never reveal whether the email exists.
  if (rl.ok) await resendVerification(formData.get("email"));
  return { status: "success" };
}
