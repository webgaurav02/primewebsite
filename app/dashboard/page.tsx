import type { Metadata } from "next";
import { getDashboardData } from "./data";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard — PRIME Meghalaya",
};

// Always render with the signed-in member's live data (never statically cached).
export const dynamic = "force-dynamic";

/**
 * Member dashboard. The /dashboard layout gate has already resolved the session;
 * here we assemble the member's real data server-side (app/dashboard/data.ts) and
 * hand it to the presentational client. Same design as before — real data now.
 */
export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
