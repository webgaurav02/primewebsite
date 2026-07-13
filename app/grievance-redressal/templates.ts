import type { Region } from "@/lib/auth/rbac";

/**
 * Single source of truth for the grievance template catalog. Plain, serializable
 * data — NO "use client", NO "server-only" — so both the RSC page and the client
 * wizard import the same list. Selecting a template seeds the subject + a
 * description scaffold (UI-only; what posts is just the final subject/description
 * strings, mapped 1:1 to publicSubmissionSchema).
 */
export type TemplateIconKey =
  | "incubation"
  | "funding"
  | "hub"
  | "mentorship"
  | "events"
  | "portal"
  | "scheme"
  | "concern"
  | "custom";

export interface Template {
  id: string;
  category: string;
  title: string;
  helper: string;
  subjectPrefix: string;
  descriptionScaffold: string;
  keywords: string[];
  iconKey: TemplateIconKey;
  suggestedRegion?: Region;
}

export const TEMPLATES: readonly Template[] = [
  {
    id: "incubation",
    category: "Programme",
    title: "Incubation & cohort onboarding",
    helper: "Application status, cohort onboarding, or incubation agreement issues.",
    subjectPrefix: "Incubation: ",
    descriptionScaffold:
      "• Programme / cohort: [...]\n• Application or startup name: [...]\n• Which onboarding step are you stuck at: [...]\n• What you expected vs what happened: [...]\n• Relevant dates: [...]",
    keywords: ["incubation", "cohort", "onboarding", "application", "agreement", "startup"],
    iconKey: "incubation",
  },
  {
    id: "funding",
    category: "Funding",
    title: "Seed / grant funding & stipend",
    helper: "Disbursal delays, sanctioned-amount mismatch, or stipend not received.",
    subjectPrefix: "Funding/Stipend: ",
    descriptionScaffold:
      "• Type (seed grant / milestone / stipend): [...]\n• Scheme or grant name: [...]\n• Sanctioned amount vs received: [...]\n• Period expected (e.g. Q1) and due date: [...]\n• Sanction or milestone reference: [...]\n(Do NOT paste bank account or Aadhaar numbers.)",
    keywords: ["funding", "grant", "seed", "stipend", "disbursal", "payment", "money", "sanction"],
    iconKey: "funding",
  },
  {
    id: "hub_access",
    category: "Facilities",
    title: "Hub access & facilities",
    helper: "Access cards, seating, internet, or equipment at Shillong, Tura, or Nongpoh.",
    subjectPrefix: "Hub access: ",
    descriptionScaffold:
      "• Which hub (Shillong / Tura / Nongpoh): [...]\n• Access card / seating / internet / equipment / other: [...]\n• Date(s) affected: [...]\n• Who you already contacted (and any reference): [...]",
    keywords: ["hub", "access", "card", "seating", "internet", "wifi", "equipment", "shillong", "tura", "nongpoh", "facility"],
    iconKey: "hub",
  },
  {
    id: "mentorship",
    category: "Support",
    title: "Mentorship & networking",
    helper: "Mentor allocation, an unresponsive mentor, or sector-fit requests.",
    subjectPrefix: "Mentorship: ",
    descriptionScaffold:
      "• Sector you need a mentor in: [...]\n• Current mentor (if any): [...]\n• What support you are seeking: [...]\n• How long it has been pending: [...]",
    keywords: ["mentor", "mentorship", "networking", "guidance", "advisor"],
    iconKey: "mentorship",
  },
  {
    id: "events",
    category: "Events",
    title: "Events & workshops",
    helper: "Registration, certificates, scheduling, or access for a PRIME event.",
    subjectPrefix: "Event/Workshop: ",
    descriptionScaffold:
      "• Event name & date: [...]\n• Registration reference: [...]\n• Problem (registration / certificate / schedule / access / other): [...]\n• Outcome you want: [...]",
    keywords: ["event", "workshop", "registration", "certificate", "schedule", "bootcamp"],
    iconKey: "events",
  },
  {
    id: "portal",
    category: "Technical",
    title: "Portal / technical issue",
    helper: "Login, forms, document upload, or a broken page on the PRIME portal.",
    subjectPrefix: "Portal issue: ",
    descriptionScaffold:
      "• Page or feature affected (URL if known): [...]\n• What you were trying to do: [...]\n• What happened / exact error text: [...]\n• Device & browser: [...]\n(No attachments in this version — describe the screen instead. Never share passwords.)",
    keywords: ["portal", "website", "login", "error", "bug", "upload", "technical", "page", "form"],
    iconKey: "portal",
  },
  {
    id: "scheme",
    category: "Clarification",
    title: "Scheme eligibility & clarification",
    helper: "Am I eligible? Document requirements or deadline clarification.",
    subjectPrefix: "Scheme clarification: ",
    descriptionScaffold:
      "• Scheme / programme name: [...]\n• Your stage & sector: [...]\n• Your specific eligibility or document question: [...]\n• District (if relevant): [...]",
    keywords: ["scheme", "eligibility", "eligible", "document", "deadline", "clarification", "policy"],
    iconKey: "scheme",
  },
  {
    id: "conduct",
    category: "Concern",
    title: "Conduct, fairness or accessibility concern",
    helper: "Raise a concern about fairness, conduct, or accessibility, neutrally.",
    subjectPrefix: "Concern: ",
    descriptionScaffold:
      "• Date(s): [...]\n• Process or people involved: [...]\n• What happened: [...]\n• The resolution you are seeking: [...]",
    keywords: ["conduct", "fairness", "unfair", "accessibility", "complaint", "concern", "behaviour"],
    iconKey: "concern",
  },
  {
    id: "custom",
    category: "Other",
    title: "Custom / Something else",
    helper: "None of these fit — describe it in your own words.",
    subjectPrefix: "",
    descriptionScaffold:
      "Describe what happened, when, and what outcome you expect. Include any reference numbers (but not Aadhaar, bank or password details).",
    keywords: ["other", "custom", "general", "something else"],
    iconKey: "custom",
  },
];

export const CUSTOM_TEMPLATE_ID = "custom";

export function getTemplate(id: string | undefined): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
