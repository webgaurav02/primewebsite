/**
 * Grievance domain constants shared by validation, the DAL, and UI. Plain,
 * serializable data — safe to import from either side.
 */

export const GRIEVANCE_STATUSES = [
  "submitted",
  "under_review",
  "in_progress",
  "resolved",
  "rejected",
] as const;

export type GrievanceStatus = (typeof GRIEVANCE_STATUSES)[number];

export const GRIEVANCE_CATEGORIES = [
  "data_protection",
  "programme",
  "website",
  "general",
  "procurement",
] as const;

export type GrievanceCategory = (typeof GRIEVANCE_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<GrievanceCategory, string> = {
  data_protection: "Data Protection",
  programme: "Programme",
  website: "Website / Technical",
  general: "General",
  procurement: "Procurement",
};

/** L0→L3 escalation ladder (PRIME grievance policy). */
export const ESCALATION_LABELS: Record<number, string> = {
  0: "L0 · PRIME Admin",
  1: "L1 · Programme Heads",
  2: "L2 · Director MBMA/MIE",
  3: "L3 · CEO MBMA",
};
