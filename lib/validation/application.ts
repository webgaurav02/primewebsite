import { z } from "zod";
import { DISTRICT_LABELS, SECTOR_LABELS } from "@/lib/entrepreneurs-data";

/**
 * Server-side validation for the public "Apply to PRIME" entrepreneur wizard
 * (app/register). Mirrors the wizard's fields; district/sector arrive as the
 * canonical slug keys and are mapped to labels at intake.
 */
const districtKeys = Object.keys(DISTRICT_LABELS) as [string, ...string[]];
const sectorKeys = Object.keys(SECTOR_LABELS) as [string, ...string[]];

export const entrepreneurApplicationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(60),
  lastName: z.string().trim().min(1, "Last name is required.").max(60),
  email: z.email("Enter a valid email.").max(254),
  phone: z.string().trim().regex(/^\d{10}$/, "Enter a 10-digit mobile number."),
  district: z.enum(districtKeys, { error: "Select a district." }),
  gender: z.enum(["female", "male", "non-binary", ""]).optional().default(""),
  businessName: z.string().trim().min(1, "Business name is required.").max(120),
  sector: z.enum(sectorKeys, { error: "Select a sector." }),
  entityType: z.string().trim().min(1, "Select an entity type.").max(60),
  stage: z.string().trim().min(1, "Select a business stage.").max(60),
  yearEstablished: z.string().trim().max(4).optional().default(""),
  address: z.string().trim().max(300).optional().default(""),
  description: z.string().trim().min(1, "Describe your business.").max(5000),
  employment: z.string().trim().max(9).optional().default(""),
  livesImpacted: z.string().trim().max(9).optional().default(""),
  turnover: z.string().trim().max(100).optional().default(""),
  govtFunding: z.string().trim().max(100).optional().default(""),
  externalFunding: z.string().trim().max(100).optional().default(""),
  products: z.string().trim().min(1, "List your products or services.").max(2000),
  socialImpact: z.string().trim().max(2000).optional().default(""),
  declared: z.literal(true, { error: "You must accept the declaration." }),
});

export type EntrepreneurApplicationInput = z.infer<
  typeof entrepreneurApplicationSchema
>;
