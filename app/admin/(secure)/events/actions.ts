"use server";

import { revalidatePath } from "next/cache";
import { publishPublicEvent } from "@/lib/dal/events";
import type { FormState } from "@/lib/forms";

export async function publishEventAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const res = await publishPublicEvent({
    title: formData.get("title"),
    body: formData.get("body"),
    occursAt: formData.get("occursAt"),
  });
  if (res.ok) {
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { status: "success" };
  }
  return { status: "error", formError: res.error };
}
