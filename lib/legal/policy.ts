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
