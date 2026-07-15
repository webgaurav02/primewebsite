import { NextResponse } from "next/server";
import { listPublicEvents } from "@/lib/dal/events";

// Public, DB-backed — never cache.
export const dynamic = "force-dynamic";

/** Upcoming public events for the homepage ticker. */
export async function GET(): Promise<NextResponse> {
  try {
    const events = await listPublicEvents(100);
    const now = Date.now();
    const upcoming = events
      .filter((e) => new Date(e.at).getTime() >= now)
      .sort((a, b) => a.at.localeCompare(b.at))
      .slice(0, 5)
      .map(({ id, title, at }) => ({ id, title, at }));
    return NextResponse.json(upcoming);
  } catch {
    // Ticker is decorative — degrade to no events rather than erroring.
    return NextResponse.json([]);
  }
}
