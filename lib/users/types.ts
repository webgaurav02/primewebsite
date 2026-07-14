/**
 * Unified user database — entrepreneurs, mentors and investors who register on
 * the PRIME portal. One registry the admin dashboard manages and issues PRIME
 * IDs from. (MVP: persisted in localStorage.)
 */

export type Persona = "entrepreneur" | "mentor" | "investor";
export type Gender = "male" | "female" | "other";
export type UserStatus = "pending" | "active" | "suspended";

export interface UserRecord {
  id: string; // internal uuid
  fullName: string;
  dateOfBirth: string; // ISO yyyy-mm-dd
  gender: Gender;
  photoDataUrl: string; // base64 (optional → "")
  email: string;
  mobile: string; // 10 digits
  persona: Persona;
  preferredLanguage: string;
  district: string;
  howHeard: string;
  status: UserStatus;
  primeId: string | null; // assigned PRIME ID number, once issued
  organizationId: string | null; // org this entrepreneur is clubbed under
  mentorId: string | null; // assigned mentor (a user with persona "mentor")
  source: "public" | "admin";
  createdAt: string;
  updatedAt: string;
}

/** Editable draft used by the form (no system fields). */
export interface UserDraft {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  photoDataUrl: string;
  email: string;
  mobile: string;
  persona: Persona;
  preferredLanguage: string;
  district: string;
  howHeard: string;
  status: UserStatus;
}

export const PERSONAS: { value: Persona; label: string; blurb: string }[] = [
  {
    value: "entrepreneur",
    label: "Entrepreneur",
    blurb: "Building a product, service or venture in Meghalaya.",
  },
  {
    value: "mentor",
    label: "Mentor",
    blurb: "Guiding founders with experience and networks.",
  },
  {
    value: "investor",
    label: "Investor",
    blurb: "Funding and backing startups in the State.",
  },
];

export const GENDERS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const USER_STATUSES: { value: UserStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

// Alphabetical, per the registration spec. Used by registerSchema z.enum(LANGUAGES).
export const LANGUAGES: readonly string[] = [
  "English",
  "Garo",
  "Hindi",
  "Jaintia",
  "Khasi",
];

/**
 * The self-declared "Who are you?" identity chosen at registration. This is the
 * source of truth; the narrower `persona` enum is DERIVED from it (see
 * registrantTypeToPersona) for the subsystems that need it (mentorship, filters).
 */
export type RegistrantType =
  | "entrepreneur_existing"
  | "aspiring_entrepreneur"
  | "student"
  | "mentor"
  | "government_official"
  | "corporate_professional"
  | "prime_staff"
  | "other";

export const REGISTRANT_TYPES: { value: RegistrantType; label: string }[] = [
  { value: "entrepreneur_existing", label: "Entrepreneur with Existing Business" },
  { value: "aspiring_entrepreneur", label: "Aspiring Entrepreneur / Just Starting" },
  { value: "student", label: "Student" },
  { value: "mentor", label: "Mentor" },
  { value: "government_official", label: "Government Official" },
  { value: "corporate_professional", label: "Corporate / Professional" },
  { value: "prime_staff", label: "PRIME Team / Staff" },
  { value: "other", label: "Other" },
];

export const REGISTRANT_TYPE_LABELS: Record<RegistrantType, string> =
  Object.fromEntries(REGISTRANT_TYPES.map((r) => [r.value, r.label])) as Record<
    RegistrantType,
    string
  >;

/** Derive the internal persona (nullable) that subsystems key off. */
export function registrantTypeToPersona(rt: RegistrantType): Persona | null {
  switch (rt) {
    case "mentor":
      return "mentor";
    case "entrepreneur_existing":
    case "aspiring_entrepreneur":
      return "entrepreneur";
    default:
      return null;
  }
}

/** Only an existing-business entrepreneur is asked for business + impact details. */
export function collectsBusinessDetails(rt: RegistrantType): boolean {
  return rt === "entrepreneur_existing";
}

export const HOW_HEARD: readonly string[] = [
  "Social media",
  "Friend or family",
  "Government office",
  "PRIME event or workshop",
  "News / media",
  "Other",
];

// Reuse the same 12 districts as the PRIME ID feature.
export { MEGHALAYA_DISTRICTS } from "@/lib/prime-id/types";

export function makeEmptyDraft(): UserDraft {
  return {
    fullName: "",
    dateOfBirth: "",
    gender: "male",
    photoDataUrl: "",
    email: "",
    mobile: "",
    persona: "entrepreneur",
    preferredLanguage: "English",
    district: "",
    howHeard: "",
    status: "pending",
  };
}

export function userToDraft(u: UserRecord): UserDraft {
  return {
    fullName: u.fullName,
    dateOfBirth: u.dateOfBirth,
    gender: u.gender,
    photoDataUrl: u.photoDataUrl,
    email: u.email,
    mobile: u.mobile,
    persona: u.persona,
    preferredLanguage: u.preferredLanguage,
    district: u.district,
    howHeard: u.howHeard,
    status: u.status,
  };
}
