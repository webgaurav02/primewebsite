"use server";

import { revalidatePath } from "next/cache";
import { adminIssuePrimeId, type AdminIssueResult } from "@/lib/dal/prime-id";

/**
 * Direct-issue a PRIME ID for a user. Thin wrapper — requireAdmin +
 * assertCan("prime_id:issue"), validation, signing, and audit live in the DAL.
 * Returns the signed card DTO (or an error) to the client generator.
 */
export async function issuePrimeIdAction(input: {
  userId: string;
  holderType: string;
  category: string | null;
  customRoleLabel: string;
  ventureName: string;
  customDetails: { label: string; value: string }[];
}): Promise<AdminIssueResult> {
  const res = await adminIssuePrimeId(input);
  if (res.ok) {
    revalidatePath("/admin/prime-id");
    revalidatePath("/admin/prime-id/generate");
  }
  return res;
}
