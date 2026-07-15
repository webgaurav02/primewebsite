import { z } from "zod";
import { LANGUAGES, MEGHALAYA_DISTRICTS } from "@/lib/users/types";
import { SECTOR_LABELS } from "@/lib/entrepreneurs-data";

/**
 * Self-serve profile editor input. Members may edit a few identity fields and
 * their (optional) business + impact snapshot. Immutable anchors — email, date
 * of birth, registrant type, consent — are NOT editable here.
 *
 * Impact financials are whole-rupee digit strings (coerced to bigint in the
 * DAL), matching the registration schema.
 */

const sectorKeys = Object.keys(SECTOR_LABELS) as [string, ...string[]];

const wholeNumber = (max: number, msg: string) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((v) => v === "" || /^\d+$/.test(v), msg)
    .optional()
    .default("");

export const updateProfileSchema = z
  .object({
    // Editable identity
    fullName: z.string().trim().min(2, "Enter your full name.").max(80),
    mobile: z.string().trim().regex(/^\d{10}$/, "Enter a 10-digit mobile number."),
    gender: z.enum(["male", "female", "other"]),
    preferredLanguage: z.enum(LANGUAGES as unknown as [string, ...string[]]),
    district: z.enum(MEGHALAYA_DISTRICTS as unknown as [string, ...string[]]),

    // Business + impact (optional; validated when a business name is given)
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
  .superRefine((d, ctx) => {
    // A business name turns on the full business requirement (same as signup).
    if (d.businessName) {
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

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
