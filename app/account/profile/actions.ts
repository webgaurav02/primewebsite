"use server";

import { revalidatePath } from "next/cache";
import { updateMyProfile } from "@/lib/dal/profile";
import type { FormState } from "@/lib/forms";

/**
 * Save the member's profile edits. Thin wrapper: the DAL re-validates and
 * authorizes (owns-their-row via RLS). Returns useActionState-shaped state.
 */
export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const g = (k: string) => formData.get(k)?.toString() ?? "";
  const res = await updateMyProfile({
    fullName: g("fullName"), mobile: g("mobile"), gender: g("gender"),
    preferredLanguage: g("preferredLanguage"), district: g("district"),
    businessName: g("businessName"), sector: g("sector"), entityType: g("entityType"),
    stage: g("stage"), yearEstablished: g("yearEstablished"), address: g("address"),
    description: g("description"), employment: g("employment"), livesImpacted: g("livesImpacted"),
    turnover: g("turnover"), govtFunding: g("govtFunding"), externalFunding: g("externalFunding"),
    products: g("products"), socialImpact: g("socialImpact"),
  });
  if (!res.ok) {
    return { status: "error", fieldErrors: res.fieldErrors, formError: "Please fix the highlighted fields." };
  }
  revalidatePath("/account/profile");
  revalidatePath("/account");
  revalidatePath("/dashboard");
  return { status: "success", message: "Profile saved." };
}
