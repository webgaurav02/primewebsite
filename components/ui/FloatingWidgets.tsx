"use client";

import { usePathname } from "next/navigation";
import AccessibilityToolbar from "./AccessibilityToolbar";
import SocialFloat from "./SocialFloat";

/**
 * The accessibility toolbar and social float are marketing-site chrome. On the
 * functional app surfaces (auth, member portal, admin console, PRIME ID verify)
 * they sit on top of forms and dashboards where they aren't wanted, so we render
 * them only on the public marketing pages.
 */
const FUNCTIONAL_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify",
  "/account",
  "/dashboard",
  "/admin",
];

function isFunctional(pathname: string): boolean {
  return FUNCTIONAL_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export default function FloatingWidgets() {
  const pathname = usePathname();
  if (isFunctional(pathname)) return null;
  return (
    <>
      <AccessibilityToolbar />
      <SocialFloat />
    </>
  );
}
