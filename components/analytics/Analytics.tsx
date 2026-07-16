"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  initAnalytics,
  trackPageview,
  hasAnalyticsConsent,
  CONSENT_EVENT,
} from "@/lib/analytics/client";

/**
 * Invisible root-layout companion that boots the analytics stack once the DPDP
 * cookie consent is granted, and emits one page_view per client navigation.
 * Renders nothing. Never runs on /admin (internal tool — its strict CSP would
 * block third-party scripts and it must not be tracked anyway).
 */
export default function Analytics() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  // Boot on mount (if already consented) and the moment consent is granted.
  useEffect(() => {
    if (isAdmin) return;
    // If consent is already stored, boot now — the pathname effect below fires
    // the first page_view, so we deliberately don't fire it here (avoids a dupe).
    if (hasAnalyticsConsent()) initAnalytics();

    const onConsent = () => {
      initAnalytics();
      // Consent granted mid-session: the route didn't change, so emit the
      // current page_view ourselves.
      trackPageview();
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, [isAdmin]);

  // One page_view per route change (no-ops until analytics has booted).
  useEffect(() => {
    if (isAdmin) return;
    trackPageview();
  }, [pathname, isAdmin]);

  return null;
}
