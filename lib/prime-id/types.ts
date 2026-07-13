/**
 * Shared types for the PRIME ID credential feature. Plain, serializable data —
 * imported by both the lib layer and the client components.
 */

export type HolderType = "entrepreneur" | "mentor" | "other";

export type Category = "startup" | "nano" | "livelihood";

export interface CustomDetail {
  label: string;
  value: string;
}

/** The persisted record (localStorage mock; one per issued credential). */
export interface PrimeIdRecord {
  id: string; // PRM-ML-YYYY-NNNNNN — the human PRIME ID number, also the key
  recordKey: string; // stable internal uuid
  fullName: string;
  holderType: HolderType;
  customRoleLabel: string | null;
  category: Category | null;
  ventureName: string | null;
  district: string;
  issueDate: string; // ISO yyyy-mm-dd
  validThru: string; // ISO yyyy-mm-dd
  photoDataUrl: string; // base64 data URL
  customDetails: CustomDetail[]; // 0–2
  token: string; // signed verification token minted at issue
  tokenFingerprint: string;
  verifyUrl: string;
  createdAt: string; // ISO timestamp
  schemaVersion: 1;
}

/** The editable form draft, before a PRIME ID number is assigned. */
export interface FormDraft {
  fullName: string;
  holderType: HolderType;
  customRoleLabel: string;
  category: Category | null;
  ventureName: string;
  district: string;
  issueDate: string;
  validThru: string;
  photoDataUrl: string;
  customDetails: CustomDetail[];
}

/**
 * What the card faces render from. Decoupled from PrimeIdRecord so the live
 * preview can render before a number/token is assigned (placeholders).
 */
export interface CardViewModel {
  fullName: string;
  idNumber: string | null; // null before issue → placeholder
  holderType: HolderType;
  customRoleLabel: string | null;
  category: Category | null;
  ventureName: string | null;
  district: string;
  issueDate: string;
  validThru: string;
  photoDataUrl: string;
  customDetails: CustomDetail[];
  verifyUrl: string | null;
  tokenFingerprint: string | null;
}

export const MEGHALAYA_DISTRICTS: readonly string[] = [
  "East Khasi Hills",
  "West Khasi Hills",
  "South West Khasi Hills",
  "Eastern West Khasi Hills",
  "Ri-Bhoi",
  "West Jaintia Hills",
  "East Jaintia Hills",
  "East Garo Hills",
  "West Garo Hills",
  "North Garo Hills",
  "South Garo Hills",
  "South West Garo Hills",
];

export const HOLDER_TYPES: { value: HolderType; label: string }[] = [
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "mentor", label: "Mentor" },
  { value: "other", label: "Other (custom role)" },
];

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "startup", label: "Startup Entrepreneur" },
  { value: "nano", label: "Nano Entrepreneur" },
  { value: "livelihood", label: "Livelihood Entrepreneur" },
];
