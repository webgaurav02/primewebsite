import { NextResponse } from "next/server";
import { processEmailOutbox } from "@/lib/email";

/**
 * Email outbox processor. Point a scheduler (Vercel Cron, external cron, etc.)
 * at this endpoint to send queued mail with retries. Protected by CRON_SECRET
 * in production (sent as the x-cron-secret header); open in dev for convenience.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (process.env.NODE_ENV === "production") {
    if (!secret || request.headers.get("x-cron-secret") !== secret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }
  const result = await processEmailOutbox();
  return NextResponse.json(result);
}
