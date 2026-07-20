"use client";

import { OPEN_PREFERENCES_EVENT } from "@/lib/analytics/client";

/**
 * Footer control that re-opens the cookie banner so a visitor can review or
 * WITHDRAW their consent as easily as they gave it (DPDP Act). Styled to match
 * the surrounding footer text. Lives in the public footer only (not /admin).
 */
export default function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))}
      className={className}
    >
      Cookie Preferences
    </button>
  );
}
