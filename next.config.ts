import type { NextConfig } from "next";

/**
 * Origins allowed to invoke Server Actions. Behind a reverse proxy / CDN the
 * forwarded Host differs from the internal Host, so the public origin(s) must be
 * trusted explicitly or Next aborts the action (CSRF protection).
 * Set ADMIN_ALLOWED_ORIGINS="https://primemeghalaya.com,https://www.primemeghalaya.com".
 */
const allowedOrigins = (process.env.ADMIN_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

/**
 * Baseline security headers on EVERY response. The strict nonce-based CSP is
 * added per-request in proxy.ts and scoped to /admin.
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90, 95],
    deviceSizes: [640, 828, 1080, 1200, 1920, 2560],
    minimumCacheTTL: 2592000,
  },

  experimental: {
    // Block tainted PII values/objects from crossing the server→client boundary
    // (used in the Data Access Layer).
    taint: true,
    // Only honor Server Action POSTs from our own public origin(s) when set.
    ...(allowedOrigins.length > 0 ? { serverActions: { allowedOrigins } } : {}),
  },

  // nodemailer has dynamic requires — keep it external (Node runtime), don't bundle.
  serverExternalPackages: ["nodemailer"],

  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
