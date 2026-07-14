"use server";

import { revalidatePath } from "next/cache";
import { requestPrimeId, type RequestResult } from "@/lib/dal/prime-id";

/**
 * Submit a PRIME ID request. The photo is uploaded separately (to R2 via the
 * photo route) before this is called; `photoPath` is the returned object key.
 */
export async function submitPrimeIdRequest(data: {
  holderType: string;
  category: string | null;
  ventureName: string;
  photoPath: string;
}): Promise<RequestResult> {
  const res = await requestPrimeId(data);
  if (res.ok) revalidatePath("/account/id-card");
  return res;
}
