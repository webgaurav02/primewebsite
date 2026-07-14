"use server";

import { headers } from "next/headers";
import { trackGrievance, type TrackResult } from "@/lib/dal/grievances";
import { slidingWindow } from "@/lib/security/rate-limit";

export type TrackState =
  | { status: "idle" }
  | { status: "rate_limited" }
  | { status: "done"; result: TrackResult };

export async function trackAction(
  _prev: TrackState,
  formData: FormData,
): Promise<TrackState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const rl = slidingWindow(`track:${ip ?? "unknown"}`, 20, 10 * 60 * 1000);
  if (!rl.ok) return { status: "rate_limited" };

  const result = await trackGrievance({
    ref: formData.get("ref"),
    email: formData.get("email"),
  });
  return { status: "done", result };
}
