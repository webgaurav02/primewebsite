<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Analytics

Four tools run on the PUBLIC site, all routed through one consent-gated facade —
`lib/analytics/client.ts` (browser-only; import ONLY from Client Components):

| Tool | Env var | Notes |
|------|---------|-------|
| Google Tag Manager | `NEXT_PUBLIC_GTM_ID` | Container for EXTRA tags only (see rule below) |
| Google Analytics 4 | `NEXT_PUBLIC_GA4_ID` | Loaded directly via gtag.js |
| Microsoft Clarity | `NEXT_PUBLIC_CLARITY_ID` | Heatmaps / session insight |
| Mixpanel | `NEXT_PUBLIC_MIXPANEL_TOKEN` | Product analytics, lazy-loaded post-consent |

**Consent gate (non-negotiable).** Nothing loads a script or sets a cookie until
the visitor accepts the DPDP-Act banner (`components/ui/CookieConsent.tsx`, which
stores `"accepted"` under `localStorage["prime-cookie-consent"]` and dispatches
the `prime-analytics-consent` event). `<Analytics/>` in the root layout boots the
stack on that signal and emits one `page_view` per client navigation. `/admin` is
never tracked (internal tool; its strict CSP would block these scripts anyway).

**DOUBLE-COUNT RULE.** GA4 and Clarity are deployed in code (loaded once each). Do
**NOT** also add GA4 or Clarity tags inside the GTM container — that loads them
twice and every hit doubles. Use GTM only for ADDITIONAL tags (Meta/LinkedIn
pixels, etc.). Each tool is optional: if its env var is empty, it's skipped.

**Env / deploy.** All four are PUBLIC IDs inlined at BUILD time (like the Sentry
DSN), so production needs them as Docker build args — real values live in
`.github/workflows/main_primemeghalaya.yml` and pass through `Dockerfile` ARGs.
`.env.local` / `.env.example` enable them for local dev (dev events flow to the
same projects — use a separate dev token/property if that noise matters).

**Instrumented events.** `page_view` (auto, every route); `identify()` +
`people.set` on every authenticated page load via `<IdentifyUser/>` (dashboard,
account) keyed on the DB user id — never email; `reset()` on logout; `track()`
for `Login` and `Registration Submitted` (named "Submitted" because the register
response is enumeration-safe — the client can't tell a new signup from a
duplicate). Add new conversions with `track(name, props)` — keep props non-PII.
