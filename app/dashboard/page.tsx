import type { Metadata } from "next";
import { getDashboardData } from "./data";
import DashboardClient from "./DashboardClient";
import { getCurrentUser } from "@/lib/auth/user-session";
import IdentifyUser from "@/components/analytics/IdentifyUser";

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
  // getCurrentUser() is request-cached (getDashboardData already resolved it), so
  // this is free — it just gives us the DB primary key that DashUser omits, which
  // is what analytics must identify on (never the email).
  const user = await getCurrentUser();
  return (
    <>
      {user && (
        <IdentifyUser
          user={{
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            registrantType: user.registrantType,
            district: user.district,
            status: user.status,
          }}
        />
      )}
      <DashboardClient data={data} />
    </>
  );
}
