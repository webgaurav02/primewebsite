"use server";

import { revalidatePath } from "next/cache";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/dal/events";

export async function markReadAction(formData: FormData) {
  await markNotificationRead(String(formData.get("id")));
  revalidatePath("/account/notifications");
}

export async function markAllReadAction() {
  await markAllNotificationsRead();
  revalidatePath("/account/notifications");
}
