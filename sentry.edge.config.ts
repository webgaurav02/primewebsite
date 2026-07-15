// Sentry init for the Edge runtime (proxy.ts and any edge routes). Loaded by
// instrumentation.ts → register() when NEXT_RUNTIME === "edge". Same runtime
// SENTRY_DSN app setting as the Node config.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: !!dsn,
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0),
  sendDefaultPii: false,
});
