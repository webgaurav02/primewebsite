"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CONSENT_EVENT,
  OPEN_PREFERENCES_EVENT,
  withdrawAnalytics,
} from "@/lib/analytics/client";

// Must stay in sync with CONSENT_STORAGE_KEY in lib/analytics/client.ts.
const STORAGE_KEY = "prime-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  // The admin console is an authenticated, internal tool (its own strict CSP) —
  // it uses only essential cookies, so the public consent notice never applies.
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (isAdmin) return;
    // First visit (no choice stored yet): surface the banner after a short delay.
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Delay so it doesn't compete with the page loader
      timer = setTimeout(() => setVisible(true), 2800);
    }
    // Footer "Cookie Preferences" re-opens the banner so consent can be reviewed
    // or withdrawn at any time.
    const onOpen = () => setVisible(true);
    window.addEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    };
  }, [isAdmin]);

  const handle = (choice: "accepted" | "declined") => {
    const previous = localStorage.getItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
    if (choice === "accepted") {
      // Opt-in: boot analytics immediately, no reload. Nothing analytics-related
      // loads a script or sets a cookie before this event fires.
      window.dispatchEvent(new Event(CONSENT_EVENT));
    } else if (previous === "accepted") {
      // Withdrawal: analytics was running, so purge the cookies/storage we set
      // and reload — on reload the "declined" state stops everything re-loading.
      withdrawAnalytics();
      window.location.reload();
    }
  };

  if (isAdmin) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-consent"
          role="dialog"
          aria-modal="false"
          aria-label="Cookie and data usage notice"
          aria-live="polite"
          className="fixed bottom-0 left-0 right-0 z-[9998] bg-[#111] border-t border-white/[0.08]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div className="flex items-start gap-3">
              {/* Cookie icon */}
              <svg
                className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12a2 2 0 0 1 2-2 2 2 0 0 0 2-2 2 2 0 0 1 2-2" />
                <circle cx="7" cy="14" r="1" fill="currentColor" />
                <circle cx="12" cy="17" r="1" fill="currentColor" />
                <circle cx="16" cy="12" r="1" fill="currentColor" />
              </svg>
              <p className="text-[12px] text-white/55 leading-relaxed max-w-2xl">
                We use essential cookies to operate this site. By clicking{" "}
                <strong className="text-white/80 font-semibold">Accept</strong>, you also
                consent to optional analytics cookies. This site is operated by the Government
                of Meghalaya under the{" "}
                <span className="text-white/70">
                  Digital Personal Data Protection Act, 2023
                </span>
                . See our{" "}
                <Link
                  href="/privacy-policy"
                  className="text-[#2D6A4F] underline underline-offset-2 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>{" "}
                for details.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-7 sm:ml-0">
              <button
                onClick={() => handle("declined")}
                className="text-[11px] text-white/45 hover:text-white/80 transition-colors font-medium px-3 py-2"
              >
                Essential only
              </button>
              <button
                onClick={() => handle("accepted")}
                className="text-[11px] bg-[#2D6A4F] text-black font-bold px-5 py-2 rounded-[2px] hover:bg-white transition-colors whitespace-nowrap"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
