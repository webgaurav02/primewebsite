import "server-only";

/**
 * Per-IP sliding-window submission limiter for the public grievance form.
 *
 * ⚠ DEV-GRADE: in-memory + process-local. It does NOT survive restarts, is not
 * shared across instances, and is weak behind shared NAT/proxies. In production
 * replace with a shared store (Upstash/Redis) or enforce at the edge
 * (Cloudflare rate-limiting). See docs/admin-security.md.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_IN_WINDOW = 5;

const hits = new Map<string, number[]>();

export function checkRateLimit(ip: string | null): {
  ok: boolean;
  retryAfterSeconds?: number;
} {
  // A null IP (can't attribute the request) is allowed but should be flagged in
  // prod logging — see the shared-NAT caveat above.
  if (!ip) return { ok: true };

  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_IN_WINDOW) {
    const oldest = recent[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((WINDOW_MS - (now - oldest)) / 1000),
    );
    hits.set(ip, recent);
    return { ok: false, retryAfterSeconds };
  }

  recent.push(now);
  hits.set(ip, recent);
  return { ok: true };
}
