"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { reviewApplication } from "@/lib/dal/programs";

// Thin wrappers only — auth, validation, and audit live in the DAL (Server
// Actions are public POST endpoints; see lib/dal/programs.ts).

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function reviewApplicationAction(formData: FormData): Promise<void> {
  const applicationId = String(formData.get("applicationId") ?? "");
  const res = await reviewApplication({
    applicationId,
    status: String(formData.get("status") ?? ""),
    note: String(formData.get("note") ?? ""),
  });
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${applicationId}`);
  // A failed decision (e.g. the applicant withdrew moments ago) must not look
  // identical to success — bounce back with the error visible.
  if (!res.ok) {
    const msg = encodeURIComponent(res.error ?? "That decision could not be saved.");
    redirect(
      UUID_RE.test(applicationId)
        ? `/admin/applications/${applicationId}?error=${msg}`
        : `/admin/applications?error=${msg}`,
    );
  }
}
