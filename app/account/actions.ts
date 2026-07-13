"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutUser } from "@/lib/dal/auth";
import { USER_SESSION_COOKIE_NAME } from "@/lib/auth/user-cookie";

export async function logoutAction() {
  const jar = await cookies();
  const token = jar.get(USER_SESSION_COOKIE_NAME)?.value;
  if (token) await logoutUser(token);
  jar.delete({ name: USER_SESSION_COOKIE_NAME, path: "/" });
  redirect("/login");
}
