/**
 * Unified, consent-gated analytics facade — BROWSER ONLY.
 *
 * Import this only from Client Components. Every function no-ops on the server
 * and no-ops until the visitor has granted consent (the DPDP-Act cookie banner
 * in components/ui/CookieConsent.tsx stores "accepted" in localStorage). Nothing
 * here loads a network resource or sets a cookie before that.
 *
 * Four tools, each loaded EXACTLY ONCE to avoid double-counting:
 *   - Google Tag Manager   (NEXT_PUBLIC_GTM_ID)      — container for extra tags
 *   - Google Analytics 4   (NEXT_PUBLIC_GA4_ID)      — loaded directly via gtag.js
 *   - Microsoft Clarity    (NEXT_PUBLIC_CLARITY_ID)  — heatmaps / session insight
 *   - Mixpanel             (NEXT_PUBLIC_MIXPANEL_TOKEN) — product analytics SDK
 *
 * DOUBLE-COUNT RULE: GA4 and Clarity are deployed HERE, in code. Do NOT also add
 * GA4 or Clarity tags inside the GTM container, or every event fires twice. Use
 * GTM only for ADDITIONAL tags (Meta/LinkedIn pixels, etc.). See AGENTS.md.
 *
 * Each tool is optional: if its env var is absent, that tool is simply skipped
 * (mirrors how the Sentry DSN gates client-side Sentry). NEXT_PUBLIC_* values are
 * inlined at BUILD time, so production requires them as Docker build args — see
 * Dockerfile and .github/workflows/main_primemeghalaya.yml.
 */

type MixpanelLib = typeof import("mixpanel-browser")["default"];

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

/** Shared with components/ui/CookieConsent.tsx. */
export const CONSENT_STORAGE_KEY = "prime-cookie-consent";
/** Window event CookieConsent dispatches so analytics can start without a reload. */
export const CONSENT_EVENT = "prime-analytics-consent";

const isBrowser = () => typeof window !== "undefined";
const isProd = process.env.NODE_ENV === "production";

export function hasAnalyticsConsent(): boolean {
  if (!isBrowser()) return false;
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) === "accepted";
  } catch {
    return false;
  }
}

// ── Mixpanel: lazy-loaded (only after consent) so the ~40 KB SDK never touches
//    the bundle for visitors who decline. `ensure` is idempotent + race-safe. ──
let mp: MixpanelLib | null = null;
let mpPromise: Promise<MixpanelLib | null> | null = null;

function ensureMixpanel(): Promise<MixpanelLib | null> {
  if (!MIXPANEL_TOKEN) return Promise.resolve(null);
  if (mp) return Promise.resolve(mp);
  if (!mpPromise) {
    mpPromise = import("mixpanel-browser")
      .then(({ default: mixpanel }) => {
        mixpanel.init(MIXPANEL_TOKEN, {
          debug: !isProd,
          persistence: "localStorage",
          track_pageview: false, // pageviews handled centrally on route change
          autocapture: { pageview: false, click: true, input: false, submit: true, scroll: false },
        });
        mp = mixpanel;
        return mp;
      })
      .catch(() => null);
  }
  return mpPromise;
}

// ── Third-party script loaders. Each guards a module-level flag so a tool loads
//    at most once even if initAnalytics() is called again. ────────────────────
let started = false;
let gtmLoaded = false;
let ga4Loaded = false;

function loadGtm(id: string): void {
  if (gtmLoaded) return;
  gtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.appendChild(s);
}

function loadGa4(id: string): void {
  if (ga4Loaded) return;
  ga4Loaded = true;
  window.dataLayer = window.dataLayer || [];
  // Canonical gtag shim — pushes the `arguments` object, exactly like the snippet.
  const gtag: (...args: unknown[]) => void = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag = gtag;
  gtag("js", new Date());
  // send_page_view:false — we emit one page_view per route change ourselves.
  gtag("config", id, { send_page_view: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
}

function loadClarity(id: string): void {
  if (window.clarity) return;
  (function (c: Window, l: Document, a: "clarity", r: "script", i: string) {
    c[a] =
      c[a] ||
      function (...args: unknown[]) {
        (c[a] as unknown as { q: unknown[] }).q =
          (c[a] as unknown as { q?: unknown[] }).q || [];
        (c[a] as unknown as { q: unknown[] }).q.push(args);
      };
    const t = l.createElement(r);
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode!.insertBefore(t, y);
  })(window, document, "clarity", "script", id);
}

/**
 * Boot every configured tool. Safe to call repeatedly and from multiple mounts
 * (the consent banner, the Analytics loader, an identify() before boot) — it
 * runs the actual loads only once, and only when consent is present.
 */
export function initAnalytics(): void {
  if (!isBrowser() || started) return;
  if (!hasAnalyticsConsent()) return;
  started = true;
  if (GTM_ID) loadGtm(GTM_ID);
  if (GA4_ID) loadGa4(GA4_ID);
  if (CLARITY_ID) loadClarity(CLARITY_ID);
  void ensureMixpanel();
}

function gtagSafe(...args: unknown[]): void {
  if (isBrowser() && window.gtag) window.gtag(...args);
}
function pushDataLayer(obj: Record<string, unknown>): void {
  if (isBrowser() && Array.isArray(window.dataLayer)) window.dataLayer.push(obj);
}

/** One page_view per route, fired to every tool exactly once. */
export function trackPageview(): void {
  if (!started) return;
  const path = window.location.pathname + window.location.search;
  if (GA4_ID) {
    gtagSafe("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
  pushDataLayer({ event: "page_view", page_path: path });
  void ensureMixpanel().then((m) => m?.track_pageview());
}

/** A named business event (Login, Registration Submitted, …), fired once per tool. */
export function track(name: string, props: Record<string, unknown> = {}): void {
  if (!started) return;
  if (GA4_ID) gtagSafe("event", name, props);
  pushDataLayer({ event: name, ...props });
  void ensureMixpanel().then((m) => m?.track(name, props));
}

export interface AnalyticsUser {
  id: string;
  email?: string;
  fullName?: string;
  registrantType?: string | null;
  district?: string | null;
  status?: string;
}

/**
 * Tie the current session to a known user. Call on EVERY login and every
 * authenticated page load (Mixpanel guidance) — the DB primary key is the
 * identity, never the email.
 */
export function identify(user: AnalyticsUser): void {
  if (!started) {
    // An authenticated page mounted before the loader booted — self-heal.
    initAnalytics();
    if (!started) return;
  }
  if (GA4_ID) gtagSafe("set", { user_id: user.id });
  pushDataLayer({ event: "identify", user_id: user.id });
  void ensureMixpanel().then((m) => {
    if (!m) return;
    m.identify(user.id);
    m.people.set({
      ...(user.email ? { $email: user.email } : {}),
      ...(user.fullName ? { $name: user.fullName } : {}),
      ...(user.registrantType ? { registrant_type: user.registrantType } : {}),
      ...(user.district ? { district: user.district } : {}),
      ...(user.status ? { status: user.status } : {}),
    });
    m.people.set_once({ first_seen: new Date().toISOString() });
  });
}

/** Clear identity on logout so the next visitor isn't merged into this profile. */
export function reset(): void {
  if (!started) return;
  if (GA4_ID) gtagSafe("set", { user_id: null });
  void ensureMixpanel().then((m) => m?.reset());
}
