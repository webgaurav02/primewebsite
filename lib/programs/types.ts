/**
 * Program module shared types + labels. No I/O — safe to import in client
 * components (for status chips) and the DAL alike.
 */

export type CycleStatus = "draft" | "open" | "closed";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "approved"
  | "rejected"
  | "withdrawn";

/** Statuses an admin may set when reviewing (not draft/submitted/withdrawn). */
export const REVIEW_STATUSES: ApplicationStatus[] = [
  "under_review",
  "shortlisted",
  "approved",
  "rejected",
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  shortlisted: "Shortlisted",
  approved: "Approved",
  rejected: "Not selected",
  withdrawn: "Withdrawn",
};

/** Statuses from which an applicant may still withdraw. */
export const WITHDRAWABLE: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "shortlisted",
];
