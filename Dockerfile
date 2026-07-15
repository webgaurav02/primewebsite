# Multi-stage build for the Next.js standalone server (next.config.ts: output "standalone").
# All secrets (DATABASE_URL, SMTP, signing keys, …) are RUNTIME env — nothing is baked in.

FROM node:24-alpine AS base

# ── deps: install the full dependency tree from the lockfile ─────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── builder: next build → .next/standalone ──────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Client-side Sentry DSN is a NEXT_PUBLIC_* value, so it is inlined into the
# browser bundle at BUILD time (not read at runtime). Pass it with
# `--build-arg NEXT_PUBLIC_SENTRY_DSN=...` to enable browser error capture; when
# absent the client SDK simply stays disabled. The SERVER-side SENTRY_DSN is a
# runtime App Service setting and needs no build arg.
ARG NEXT_PUBLIC_SENTRY_DSN=""
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
RUN npm run build

# ── runner: minimal runtime image, non-root ──────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# server.js + traced node_modules; public/ and .next/static are not included
# in standalone by default and must be copied alongside (see Next self-hosting docs).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# App Service routes traffic to WEBSITES_PORT=3000; the standalone server
# reads PORT/HOSTNAME at startup.
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
