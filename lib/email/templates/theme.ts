/**
 * Email design tokens — a distilled, email-safe subset of the website's system
 * (app/globals.css). Sharp corners, deep PRIME green, a light-green accent, and
 * uppercase tracked micro-labels — the same language as /login and /dashboard.
 * Colours are literal hex (no CSS vars) because mail clients don't resolve them.
 */
export const brand = {
  green: "#1B4332", // primary dark green (headers, buttons)
  greenMid: "#2D6A4F", // eyebrow labels, links
  greenLight: "#74C69D", // accent rule
  ink: "#111111", // headings
  body: "#444444", // paragraph text
  muted: "#8a8a8a", // footer / fine print
  faint: "#eef2ef", // link-fallback chip background
  line: "#e6e6e6", // hairline borders
  bg: "#f5f5f5", // page background
  card: "#ffffff",
} as const;

// Web fonts don't load reliably in mail clients — fall back to a clean system
// stack (Host Grotesk is the site face; this reads closest to it everywhere).
export const fontStack =
  "'Host Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";

export const CARD_WIDTH = 560;
