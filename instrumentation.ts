// Next.js server instrumentation (runs once per server instance, before the
// server handles requests). We use it to boot Sentry for whichever runtime is
// starting, and to forward every server-side error Next catches — crucially
// including Server Action failures (context.routeType === "action"), which is
// exactly where /register was throwing.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  } else if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Reports server errors (renders, route handlers, Server Actions, proxy) to
// Sentry with Next's request/context. No-ops when Sentry isn't enabled.
export const onRequestError = Sentry.captureRequestError;
