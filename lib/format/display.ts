/**
 * Small presentation helpers shared by the member dashboard and admin views.
 * No I/O, safe on both server and client.
 *
 * Financials render as grouped Indian-format numbers ("₹5,00,000"), not vague
 * text ("₹5 Lakh") — the underlying columns are bigint whole rupees.
 */

const inGrouping = new Intl.NumberFormat("en-IN");

/** Whole-rupee amount → "₹5,00,000". null/undefined → the em-dash placeholder. */
export function formatINR(n: number | null | undefined, empty = "—"): string {
  if (n == null || !Number.isFinite(n)) return empty;
  return `₹${inGrouping.format(Math.round(n))}`;
}

/** Plain count → "1,20,000". null/undefined → the placeholder. */
export function formatCount(n: number | null | undefined, empty = "—"): string {
  if (n == null || !Number.isFinite(n)) return empty;
  return inGrouping.format(Math.round(n));
}

/** ISO timestamp → "January 2024" (used for "member since"). */
export function monthYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

/** ISO timestamp → "Jul 15, 2026" (used for event/timeline dates). */
export function shortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** ISO timestamp → coarse "2 days ago" / "just now" for activity feeds. */
export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const secs = Math.round((Date.now() - then) / 1000);
  if (secs < 60) return "just now";
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (days < 30) { const w = Math.round(days / 7); return `${w} week${w === 1 ? "" : "s"} ago`; }
  if (days < 365) { const mo = Math.round(days / 30); return `${mo} month${mo === 1 ? "" : "s"} ago`; }
  const yr = Math.round(days / 365);
  return `${yr} year${yr === 1 ? "" : "s"} ago`;
}
