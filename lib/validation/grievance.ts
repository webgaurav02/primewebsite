import { z } from "zod";
import { REGIONS } from "@/lib/auth/rbac";
import { GRIEVANCE_STATUSES, GRIEVANCE_CATEGORIES } from "@/lib/grievance/types";

/**
 * All untrusted input (searchParams, form data, action args) is parsed through
 * these schemas before the DAL touches it. Parse at the boundary, pass typed
 * values inward.
 */

export const grievanceStatusSchema = z.enum(GRIEVANCE_STATUSES);

export const regionSchema = z.enum(REGIONS as [string, ...string[]]);

/** Filters for the grievance list (from URL searchParams). */
export const listFiltersSchema = z.object({
  status: grievanceStatusSchema.optional(),
  region: regionSchema.optional(),
  q: z.string().trim().max(100).optional(),
});
export type ListFilters = z.infer<typeof listFiltersSchema>;

/** Status-change action input. */
export const updateStatusSchema = z.object({
  grievanceId: z.string().min(1).max(64),
  status: grievanceStatusSchema,
  note: z.string().trim().max(2000).optional(),
});
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

/**
 * Public citizen submission (the unauthenticated trust zone). Included here as
 * the data contract; the public-facing grievance form will validate against it
 * and the admin DAL must never trust anything from that path beyond these bounds.
 */
export const publicSubmissionSchema = z.object({
  region: regionSchema,
  category: z.enum(GRIEVANCE_CATEGORIES).optional().default("general"),
  subject: z.string().trim().min(5).max(200),
  description: z.string().trim().min(20).max(5000),
  complainantName: z.string().trim().min(2).max(120),
  complainantEmail: z.email().max(254),
  complainantPhone: z
    .string()
    .trim()
    .regex(/^[+0-9 ()-]{7,20}$/, "Invalid phone number"),
  // Optional, self-declared identifiers (blank ⇒ omitted). Not contact PII.
  primeId: z.string().trim().max(40).optional(),
  businessName: z.string().trim().max(200).optional(),
});
export type PublicSubmission = z.infer<typeof publicSubmissionSchema>;

/** Public tracking: ticket ref + the email used (prevents enumeration). */
export const trackSchema = z.object({
  ref: z.string().trim().min(3).max(40),
  email: z.email().max(254),
});

/** Admin: assign a grievance to an officer. */
export const assignSchema = z.object({
  grievanceId: z.string().uuid(),
  assigneeId: z.string().uuid(),
});

export const escalateSchema = z.object({
  grievanceId: z.string().uuid(),
});
