import { z } from "zod";
import { MODES } from "@/lib/mentorship/types";

const UUID = z.string().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  "Invalid id",
);

/** Admin pairs a mentor with a mentee. */
export const assignMentorSchema = z
  .object({
    mentorId: UUID,
    menteeId: UUID,
  })
  .refine((d) => d.mentorId !== d.menteeId, {
    message: "A mentor and mentee must be different people.",
    path: ["menteeId"],
  });

/** Mentor logs a session against one of their assignments. */
export const logSessionSchema = z.object({
  assignmentId: UUID,
  durationMinutes: z.coerce
    .number()
    .int("Enter whole minutes.")
    .min(1, "Duration must be at least 1 minute.")
    .max(1440, "That's more than a day — check the minutes."),
  mode: z.enum(MODES as [string, ...string[]]),
  occurredAt: z.string().trim().optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
});
export type LogSessionInput = z.infer<typeof logSessionSchema>;
