/**
 * Document vault shared types + labels. No I/O.
 */

export type DocumentKind = "aadhaar" | "pan" | "business_reg" | "bank_statement" | "gst" | "other";
export type DocumentStatus = "pending" | "verified" | "rejected";

export const DOCUMENT_KINDS: { value: DocumentKind; label: string }[] = [
  { value: "aadhaar", label: "Aadhaar" },
  { value: "pan", label: "PAN card" },
  { value: "business_reg", label: "Business registration" },
  { value: "bank_statement", label: "Bank statement" },
  { value: "gst", label: "GST certificate" },
  { value: "other", label: "Other" },
];

export const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = Object.fromEntries(
  DOCUMENT_KINDS.map((k) => [k.value, k.label]),
) as Record<DocumentKind, string>;

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  pending: "Pending review",
  verified: "Verified",
  rejected: "Rejected",
};
