import { z } from "zod";

/**
 * A PRIME ID request. Most identity fields are taken server-side from the
 * signed-in user's profile; the applicant only chooses the credential framing
 * (holder type / category / venture name) and can add up to two custom detail
 * rows for the card back.
 */
export const primeIdRequestSchema = z.object({
  holderType: z.enum(["entrepreneur", "mentor", "other"]),
  customRoleLabel: z.string().trim().max(40).optional().default(""),
  category: z.enum(["startup", "nano", "livelihood"]).nullable().optional().default(null),
  ventureName: z.string().trim().max(120).optional().default(""),
  // Opaque R2 object key from the photo upload route (not a URL).
  photoPath: z.string().trim().max(300).optional().default(""),
  customDetails: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(30),
        value: z.string().trim().min(1).max(60),
      }),
    )
    .max(2)
    .optional()
    .default([]),
});

export type PrimeIdRequestInput = z.infer<typeof primeIdRequestSchema>;

/**
 * Admin direct-issue: an admin generates a PRIME ID for an existing user without
 * a member request. Identity (name/district/photo) is taken server-side from the
 * user's profile; the admin only chooses the credential framing.
 */
export const adminIssuePrimeIdSchema = z.object({
  userId: z.string().uuid(),
  holderType: z.enum(["entrepreneur", "mentor", "other"]),
  customRoleLabel: z.string().trim().max(40).optional().default(""),
  category: z.enum(["startup", "nano", "livelihood"]).nullable().optional().default(null),
  ventureName: z.string().trim().max(120).optional().default(""),
  customDetails: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(30),
        value: z.string().trim().min(1).max(60),
      }),
    )
    .max(2)
    .optional()
    .default([]),
});

export type AdminIssuePrimeIdInput = z.infer<typeof adminIssuePrimeIdSchema>;

export const revokeSchema = z.object({
  credentialId: z.string().trim().min(1).max(40),
  reason: z.string().trim().min(3).max(300),
});

export const rejectSchema = z.object({
  requestId: z.string().uuid(),
  reason: z.string().trim().min(3).max(300),
});
