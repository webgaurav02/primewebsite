"use server";

import { revalidatePath } from "next/cache";
import {
  approveAndIssuePrimeId,
  rejectPrimeIdRequest,
  revokePrimeIdCredential,
} from "@/lib/dal/prime-id";

/** Thin actions — all authz/validation/audit live in the DAL. */
export async function approveIssueAction(formData: FormData) {
  await approveAndIssuePrimeId(String(formData.get("requestId")));
  revalidatePath("/admin/prime-id");
}

export async function rejectRequestAction(formData: FormData) {
  await rejectPrimeIdRequest({
    requestId: formData.get("requestId"),
    reason: formData.get("reason"),
  });
  revalidatePath("/admin/prime-id");
}

export async function revokeCredentialAction(formData: FormData) {
  await revokePrimeIdCredential({
    credentialId: formData.get("credentialId"),
    reason: formData.get("reason"),
  });
  revalidatePath("/admin/prime-id");
}
