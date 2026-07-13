"use server";

import { applyAsEntrepreneur, type ApplicationResult } from "@/lib/dal/applications";

/**
 * Thin action for the public "Apply to PRIME" wizard. Validation, PII
 * encryption, and the pending-account/profile/organisation writes all happen in
 * the DAL. Returns a discriminated result the client wizard renders.
 */
export async function applyAction(data: unknown): Promise<ApplicationResult> {
  return applyAsEntrepreneur(data);
}
