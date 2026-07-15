/**
 * DPDP (Digital Personal Data Protection Act, 2023) notice + consent for the
 * public grievance form. Plain, serializable data — NO "use client" / "server-only"
 * — so the client wizard renders the notice and the server records which version
 * of it the complainant consented to.
 *
 * Bump CONSENT_VERSION whenever the itemized notice below materially changes, so
 * every stored grievance records exactly which notice its consent was given
 * against (demonstrable consent under §6 of the Act).
 */

export const CONSENT_VERSION = "dpdp-2023-v1";

/** Attachment limits, shared by the form, the action, and the copy. */
export const MAX_ATTACHMENTS = 5;

/**
 * The itemized §5 notice, shown at the point of collection. Each item is a
 * heading + plain-language explanation.
 */
export const DPDP_NOTICE: { heading: string; body: string }[] = [
  {
    heading: "What we collect",
    body: "Your name, email and phone, and — only if you provide them — your PRIME ID, business name, the grievance details you write, and any files you attach.",
  },
  {
    heading: "Why",
    body: "Solely to receive, verify, route and respond to this grievance, and to contact you about it. We do not use it for marketing or sell it.",
  },
  {
    heading: "Legal basis",
    body: "Your consent, which you give by ticking the box below.",
  },
  {
    heading: "Who sees it",
    body: "The PRIME grievance team and the department or officer handling your case.",
  },
  {
    heading: "How long we keep it",
    body: "Only as long as needed to resolve your grievance and meet record-keeping obligations, after which it is deleted.",
  },
  {
    heading: "Your rights",
    body: "You may ask us to access, correct or erase your data, or withdraw consent, by writing to our Grievance Officer at grievance@primemeghalaya.com. Withdrawing consent may stop us from processing this grievance further.",
  },
  {
    heading: "Escalation",
    body: "If unsatisfied, you may approach the Data Protection Board of India.",
  },
];

export const CONSENT_LABEL =
  "I have read the notice above and consent to PRIME collecting and processing my personal data for the purpose of handling this grievance.";
