/**
 * Dashboard view-model — the fully-serializable shape the server assembles
 * (app/dashboard/data.ts) and the client renders (DashboardClient.tsx).
 *
 * Everything here is a primitive/string already formatted for display, so the
 * client stays purely presentational: no dates, currency, or DB values leak
 * across the server→client boundary un-shaped.
 */

/** Visual tone for status dots/badges; maps to the existing palette in the client. */
export type StatusTone = "active" | "positive" | "warn" | "muted" | "negative";

export interface DashUser {
  fullName: string;
  email: string;
  shortName: string;
  /** Business name, else the registrant-type label ("Student", "Mentor", …). */
  headline: string;
  sector: string | null;
  primeId: string;
  primeIdTone: StatusTone;
  district: string;
  status: string;
  since: string;
  photoDataUrl: string | null;
  initials: string;
  emailVerified: boolean;
}

export interface DashStats {
  employed: string;
  turnover: string;
  govtFunding: string;
  programsActive: string;
}

export interface DashProgram {
  name: string;
  meta: string;
  statusLabel: string;
  tone: StatusTone;
  applyHref: string | null;
}

export interface DashEvent {
  title: string;
  date: string;
  detail: string | null;
}

export interface DashActivity {
  text: string;
  time: string;
  iconKey: "check" | "doc" | "funding" | "program" | "id" | "announce" | "grievance";
  tone: StatusTone;
}

export interface DashDoc {
  name: string;
  statusLabel: string;
  tone: StatusTone;
  date: string;
  href: string | null;
}

export interface DashFunding {
  govtFunding: string;
  externalFunding: string;
  total: string;
  hasAny: boolean;
}

export interface DashBusiness {
  name: string;
  about: string | null;
  rows: { label: string; value: string }[];
  tiles: { value: string; label: string }[];
}

export interface DashboardData {
  user: DashUser;
  stats: DashStats;
  programs: DashProgram[];
  events: DashEvent[];
  activity: DashActivity[];
  documents: DashDoc[];
  funding: DashFunding;
  business: DashBusiness | null;
  unread: number;
}
