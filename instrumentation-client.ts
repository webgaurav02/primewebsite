// Client-side Sentry init (runs in the browser before the app is interactive).
//
// The DSN here is NEXT_PUBLIC_* because it is inlined into the browser bundle at
// BUILD time — so to enable client-side capture in production it must be present
// when the Docker image is built (see Dockerfile ARG NEXT_PUBLIC_SENTRY_DSN),
// not merely as a runtime App Service setting. Without it, this no-ops.
//
// No Session Replay integration: the registration form carries personal data we
// must not record.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: !!dsn,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0),
  sendDefaultPii: false,
});

// Lets Sentry tie browser errors to the client-side navigation that caused them.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
