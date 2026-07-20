// Sentry init for the Node.js server runtime. Loaded once at server startup by
// instrumentation.ts → register(). Reads SENTRY_DSN at RUNTIME, so it is
// configured via an Azure App Service app setting (no rebuild needed) and stays
// disabled anywhere the DSN is absent.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: !!dsn,
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  // Error monitoring by default (0). Opt into perf tracing via env if wanted.
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0),
  // DPDP/PII: never let the SDK auto-attach IPs, cookies, or request bodies.
  sendDefaultPii: false,
  beforeSend(event, hint) {
    // Client hung up mid-request (mobile lost signal, tab backgrounded, user hit
    // back). Node emits this from node:_http_server with no app frame on the
    // stack, and Next's onRequestError auto-captures it — it is transport noise,
    // not a fault we can act on. Drop it so real /register failures stay visible.
    const err = hint?.originalException as { code?: string; message?: string } | undefined;
    if (err?.code === "ECONNRESET" && err?.message === "aborted") return null;

    // Belt-and-braces scrub: registration requests carry personal data.
    if (event.request) {
      delete event.request.cookies;
      delete event.request.data;
      if (event.request.headers) {
        delete event.request.headers.cookie;
        delete event.request.headers.authorization;
      }
    }
    return event;
  },
});
