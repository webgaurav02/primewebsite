"use server";

import { revalidatePath } from "next/cache";
import { verifyDocument, rejectDocument } from "@/lib/dal/documents";

/**
 * Thin admin Server Actions. requireAdmin + assertCan("document:verify"),
 * validation, audit, and the owner notification all live in the DAL.
 */
export async function verifyDocumentAction(formData: FormData) {
  await verifyDocument(String(formData.get("documentId") ?? ""));
  revalidatePath("/admin/documents");
}

export async function rejectDocumentAction(formData: FormData) {
  await rejectDocument({
    documentId: formData.get("documentId"),
    reason: formData.get("reason"),
  });
  revalidatePath("/admin/documents");
}
