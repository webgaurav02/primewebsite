import { z } from "zod";

const UUID = z.string().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  "Invalid id",
);

export const documentKindSchema = z.enum([
  "aadhaar",
  "pan",
  "business_reg",
  "bank_statement",
  "gst",
  "other",
]);

export const rejectDocumentSchema = z.object({
  documentId: UUID,
  reason: z.string().trim().min(3, "Give a short reason.").max(500),
});
