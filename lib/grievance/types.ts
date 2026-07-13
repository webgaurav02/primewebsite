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
