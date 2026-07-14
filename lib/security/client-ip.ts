import "server-only";

/**
 * Best-effort client IP for rate-limiting / audit.
 *
 * ⚠ The left-most X-Forwarded-For entry is CLIENT-CONTROLLED — an attacker can
 * send a fresh value per request to get a brand-new rate-limit bucket every
 * time, nullifying the limiter. So we prefer a header stamped by a TRUSTED edge
 * (Cloudflare / a reverse proxy you control) and treat XFF as untrusted, falling
 * back to a single shared bucket (null → callers key on a constant) rather than
 * a per-spoofable-value bucket. In production, set one of these at the edge
 * and/or enforce limits at the edge — see lib/security/rate-limit.ts.
 */
const TRUSTED_HEADERS = ["cf-connecting-ip", "true-client-ip", "x-real-ip"];

function isIp(s: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(s) || /^[0-9a-f:]+$/i.test(s);
}

export function clientIp(headers: Headers): string | null {
  for (const h of TRUSTED_HEADERS) {
    const v = headers.get(h)?.trim();
    if (v && isIp(v)) return v;
  }
  // XFF is spoofable; only used as a last resort, and NEVER to mint per-value buckets
  // in production (deploy behind an edge that sets a trusted header).
  const xff = headers.get("x-forwarded-for");
  const first = xff?.split(",")[0]?.trim();
  return first && isIp(first) ? first : null;
}
