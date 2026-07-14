"use server";

import { revalidatePath } from "next/cache";
import { deleteMyDocument } from "@/lib/dal/documents";

export async function deleteDocumentAction(id: string) {
  const res = await deleteMyDocument(id);
  if (res.ok) revalidatePath("/account/documents");
  return res;
}
