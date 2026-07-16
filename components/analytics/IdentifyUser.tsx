"use client";

import { useEffect } from "react";
import { identify, type AnalyticsUser } from "@/lib/analytics/client";

/**
 * Drop into any authenticated server page (dashboard, account, …) to tie the
 * session to the signed-in member on every load — which is exactly the moment
 * Mixpanel wants identify() called (each login + each app re-open). Renders
 * nothing; no-ops until consent + the analytics stack are ready.
 */
export default function IdentifyUser({ user }: { user: AnalyticsUser }) {
  useEffect(() => {
    identify(user);
    // Only re-run if the identity changes (it won't within a session).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  return null;
}
