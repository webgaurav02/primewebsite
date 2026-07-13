import "server-only";

/**
 * Generic in-memory sliding-window limiter, keyed by an arbitrary string.
 *
 * ⚠ DEV-GRADE: in-memory + process-local. It does NOT survive restarts, is not
 * shared across instances, and is weak behind shared NAT/proxies. In production
 * replace with a shared store (Upstash/Redis) or enforce at the edge
 * (Cloudflare rate-limiting). See docs/admin-security.md.
 */

const buckets = new Map<string, number[]>();

export function slidingWindow(
  key: string,
  max: number,
  windowMs: number,
): { ok: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= max) {
    const oldest = recent[0];
    buckets.set(key, recent);
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }

  recent.push(now);
  buckets.set(key, recent);
  return { ok: true };
}
