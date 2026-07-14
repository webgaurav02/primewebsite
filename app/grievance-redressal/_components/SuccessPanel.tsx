"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircleIcon, CopyIcon, PhoneIcon } from "./icons";
import { getZone } from "../zones";
import type { Region } from "@/lib/auth/rbac";

/**
 * Terminal success receipt. Focus moves to the heading; the ticket reference is
 * announced politely and is large + selectable for easy mobile copy.
 */
export default function SuccessPanel({
  ticketRef,
  region,
  onReset,
}: {
  ticketRef: string;
  region: Region;
  onReset: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);
  const zone = getZone(region);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(ticketRef);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the reference is selectable on screen anyway.
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center gap-3">
        <CheckCircleIcon className="h-8 w-8 text-black" />
        <h2
          ref={headingRef}
          tabIndex={-1}
          aria-live="polite"
          className="text-2xl font-semibold text-zinc-900 focus-visible:outline-none"
        >
          Grievance received
        </h2>
      </div>
      <p className="mt-2 text-sm text-zinc-600">
        Save this reference. We&apos;ll acknowledge your grievance and your zone
        officer will follow up.
      </p>

      <div className="mt-5 rounded-lg bg-black p-5 text-white">
        <p className="text-xs uppercase tracking-wide text-zinc-400">
          Your ticket reference
        </p>
        <div className="mt-1 flex items-center justify-between gap-4">
          <span className="select-all font-mono text-2xl">{ticketRef}</span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-white hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <CopyIcon className="h-4 w-4" />
            {copied ? "Copied" : "Copy"}
            <span className="sr-only" aria-live="polite">
              {copied ? "Reference copied to clipboard" : ""}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-zinc-900">
          What happens next
        </h3>
        <ol className="mt-2 space-y-1.5 text-sm text-zinc-600">
          <li>1. Your grievance enters the {zone?.label ?? "regional"} queue.</li>
          <li>2. An officer reviews it and updates the status.</li>
          <li>3. We contact you on the details you provided.</li>
        </ol>
        {zone && (
          <p className="mt-4 flex items-center gap-2 text-sm text-zinc-900">
            <PhoneIcon className="h-4 w-4" />
            Prefer to call? {zone.label} helpline:{" "}
            <a
              href={`tel:${zone.helplineTel}`}
              className="font-medium underline underline-offset-2 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              {zone.helplineLabel}
            </a>
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <a
          href={`/grievance-redressal/track?ref=${encodeURIComponent(ticketRef)}`}
          className="text-sm font-medium text-[#2D6A4F] underline underline-offset-2 hover:text-[#1B4332] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          Track this grievance
        </a>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-zinc-700 underline underline-offset-2 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          File another grievance
        </button>
      </div>
    </div>
  );
}
