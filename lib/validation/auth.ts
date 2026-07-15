import { z } from "zod";
import {
  LANGUAGES,
  HOW_HEARD,
  MEGHALAYA_DISTRICTS,
  REGISTRANT_TYPES,
  collectsBusinessDetails,
  type RegistrantType,
} from "@/lib/users/types";
import { SECTOR_LABELS } from "@/lib/entrepreneurs-data";
import { isMinorDob } from "@/lib/legal/policy";

/**
 * All untrusted auth input is parsed through these before the DAL touches it.
 * The register schema is the self-serve credentialed signup: identity
 * (registrant type), personal details, a real password + confirm, DPDP consent,
 * a conditional guardian block for minors, and a conditional business + impact
 * block collected ONLY from existing-business entrepreneurs.
 */

const password = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(200, "That password is too long.");

// Whole-number string from an <input type="number">. Empty = not provided.
// Capped at 15 digits so Number() coercion in the DAL stays lossless (< 2^53).
const wholeNumber = (max: number, msg: string) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((v) => v === "" || /^\d+$/.test(v), msg)
    .optional()
    .default("");

const registrantTypeValues = REGISTRANT_TYPES.map((r) => r.value) as [
  string,
  ...string[],
];
const sectorKeys = Object.keys(SECTOR_LABELS) as [string, ...string[]];

export const registerSchema = z
  .object({
    registrantType: z.enum(registrantTypeValues),
    fullName: z.string().trim().min(2, "Enter your full name.").max(80),
    email: z.email("Enter a valid email.").max(254),
    password,
    confirmPassword: z.string(),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required.")
      .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date.")
      .refine((v) => Date.parse(v) < Date.now(), "Date of birth must be in the past."),
    mobile: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Enter a 10-digit mobile number."),
    preferredLanguage: z.enum(LANGUAGES as unknown as [string, ...string[]]),
    district: z.enum(MEGHALAYA_DISTRICTS as unknown as [string, ...string[]]),
    howHeard: z.enum(HOW_HEARD as unknown as [string, ...string[]]),
    // Optional profile photo: the object KEY of a browser-uploaded staging
    // avatar (see lib/storage presignAvatarUpload). The photo bytes never travel
    // through this action; the DAL re-downloads + re-validates them by magic
    // bytes/size before attaching. Shape is enforced there (isPendingAvatarKey).
    photoKey: z.string().trim().max(200).optional().default(""),
    consent: z.literal(true, { error: "You must accept to continue." }),

    // Guardian block — required only for under-18 registrants (validated below).
    guardianName: z.string().trim().max(80).optional().default(""),
    guardianRelationship: z.string().trim().max(60).optional().default(""),
    guardianConsent: z.boolean().optional().default(false),

    // Business + impact — required only for existing-business entrepreneurs.
    businessName: z.string().trim().max(120).optional().default(""),
    sector: z.string().trim().optional().default(""),
    entityType: z.string().trim().max(60).optional().default(""),
    stage: z.string().trim().max(60).optional().default(""),
    yearEstablished: z.string().trim().max(4).optional().default(""),
    address: z.string().trim().max(300).optional().default(""),
    description: z.string().trim().max(5000).optional().default(""),
    employment: wholeNumber(9, "Enter a whole number."),
    livesImpacted: wholeNumber(9, "Enter a whole number."),
    turnover: wholeNumber(15, "Enter the annual turnover in whole rupees (digits only)."),
    govtFunding: wholeNumber(15, "Enter the amount in whole rupees (digits only)."),
    externalFunding: wholeNumber(15, "Enter the amount in whole rupees (digits only)."),
    products: z.string().trim().max(2000).optional().default(""),
    socialImpact: z.string().trim().max(2000).optional().default(""),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  })
  .superRefine((d, ctx) => {
    // Minors (DPDP s.9): a parent/guardian must be named and must consent.
    if (isMinorDob(d.dateOfBirth)) {
      if (!d.guardianName)
        ctx.addIssue({ code: "custom", path: ["guardianName"], message: "A parent/guardian's name is required for under-18 registrants." });
      if (!d.guardianRelationship)
        ctx.addIssue({ code: "custom", path: ["guardianRelationship"], message: "State the guardian's relationship to you." });
      if (d.guardianConsent !== true)
        ctx.addIssue({ code: "custom", path: ["guardianConsent"], message: "A parent/guardian must consent for under-18 registrants." });
    }
    // Existing-business entrepreneurs supply business + impact details.
    if (collectsBusinessDetails(d.registrantType as RegistrantType)) {
      if (!d.businessName)
        ctx.addIssue({ code: "custom", path: ["businessName"], message: "Business name is required." });
      if (!(sectorKeys as string[]).includes(d.sector))
        ctx.addIssue({ code: "custom", path: ["sector"], message: "Select a sector." });
      if (!d.entityType)
        ctx.addIssue({ code: "custom", path: ["entityType"], message: "Select an entity type." });
      if (!d.stage)
        ctx.addIssue({ code: "custom", path: ["stage"], message: "Select a business stage." });
      if (!d.description)
        ctx.addIssue({ code: "custom", path: ["description"], message: "Describe your business." });
      if (!d.products)
        ctx.addIssue({ code: "custom", path: ["products"], message: "List your products or services." });
    }
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email.").max(254),
  password: z.string().min(1, "Enter your password."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email.").max(254),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
