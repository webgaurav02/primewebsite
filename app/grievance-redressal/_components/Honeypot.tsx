"use client";

import { useEffect, useRef } from "react";

/**
 * Bot trap + timing token.
 * - `company_url` is visually hidden via sr-only (NOT display:none / hidden, so
 *   bots that skip hidden fields still fill it) and removed from the a11y +
 *   keyboard path (aria-hidden, tabIndex -1, autoComplete off).
 * - `_renderedAt` records mount time so the server can drop implausibly fast
 *   (automated) submissions. We write it to the DOM imperatively after mount —
 *   not via state — so there is no hydration mismatch from server time and no
 *   cascading render.
 */
export default function Honeypot() {
  const renderedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renderedAtRef.current) renderedAtRef.current.value = String(Date.now());
  }, []);

  return (
    <>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="company_url">Company URL (leave blank)</label>
        <input
          id="company_url"
          name="company_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input ref={renderedAtRef} type="hidden" name="_renderedAt" defaultValue="" />
    </>
  );
}
