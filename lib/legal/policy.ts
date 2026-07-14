/**
 * Single source of truth for the DPDP consent / privacy-notice version and the
 * itemised processing purposes. Both the registration UI and the persisted
 * user_consent record stamp POLICY_VERSION, so a stored consent is always
 * traceable to the exact notice the data principal saw. Bump the version
 * whenever the notice or purposes change — never edit history in place.
 *
 * No I/O — safe to import in client components (consent copy) and the DAL alike.
 */

export const POLICY_VERSION = "2026-07-14";

/** The purposes a registrant consents to at account creation (DPDP s.5/s.6). */
export const CONSENT_PURPOSES = [
  "account_management",
  "identity_verification",
  "prime_id_issuance",
  "programme_administration",
  "communications",
] as const;

export type ConsentPurpose = (typeof CONSENT_PURPOSES)[number];

/** Human-readable purpose lines shown in the consent notice. */
export const PURPOSE_LABELS: Record<ConsentPurpose, string> = {
  account_management: "Create and manage my PRIME account",
  identity_verification: "Verify my identity",
  prime_id_issuance: "Issue and manage a PRIME ID, if I request one",
  programme_administration: "Administer PRIME programmes I apply to",
  communications: "Send me service communications about my account and applications",
};

/** Age of majority for the DPDP minor (guardian-consent) flow. */
export const AGE_OF_MAJORITY = 18;

// PRIME operates in Meghalaya; the age gate is decided on the Indian Standard
// Time (UTC+5:30) civil calendar so the boundary flips at IST midnight of the
// 18th birthday — not at UTC midnight, which would be off by up to a day.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** Completed years of age from an ISO date-of-birth string, on the IST civil date. */
export function ageFromDob(dob: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dob.trim());
  if (!m) return NaN;
  const [by, bm, bd] = [Number(m[1]), Number(m[2]), Number(m[3])];
  // "Today" as an IST civil date: shift the instant by +5:30 then read UTC parts.
  const ist = new Date(Date.now() + IST_OFFSET_MS);
  const ty = ist.getUTCFullYear(), tm = ist.getUTCMonth() + 1, td = ist.getUTCDate();
  let age = ty - by;
  if (tm < bm || (tm === bm && td < bd)) age--;
  return age;
}

/** True when the DOB indicates an under-18 data principal (guardian consent required). */
export function isMinorDob(dob: string): boolean {
  const age = ageFromDob(dob);
  return Number.isFinite(age) && age < AGE_OF_MAJORITY;
}
