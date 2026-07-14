import { z } from "zod";
import { REVIEW_STATUSES } from "@/lib/programs/types";

const UUID = z.string().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  "Invalid id",
);

/**
 * A member's application to a program cycle. The questionnaire is intentionally
 * small for v1: a summary of the venture and what they hope to gain. Stored as
 * the `answers` jsonb.
 */
export const applyToProgramSchema = z.object({
  cycleId: UUID,
  summary: z.string().trim().min(20, "Tell us a little more (min 20 characters).").max(2000),
  objective: z.string().trim().min(10, "What do you hope to gain?").max(2000),
});
export type ApplyToProgramInput = z.infer<typeof applyToProgramSchema>;

/** Admin decision on an application. */
export const reviewApplicationSchema = z.object({
  applicationId: UUID,
  status: z.enum(REVIEW_STATUSES as [string, ...string[]]),
  note: z.string().trim().max(2000).optional().default(""),
});

/** Admin creates an intake window for a program. */
export const createCycleSchema = z.object({
  programId: UUID,
  label: z.string().trim().min(3, "Give the cycle a label.").max(120),
  opensAt: z.string().trim().optional().default(""),
  closesAt: z.string().trim().optional().default(""),
});

export const cycleStatusSchema = z.object({
  cycleId: UUID,
  status: z.enum(["draft", "open", "closed"]),
});
