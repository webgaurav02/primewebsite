import type { Metadata } from "next";
import Link from "next/link";
import { getMyGrievances } from "@/lib/dal/grievances";
import { CATEGORY_LABELS } from "@/lib/grievance/types";

export const metadata: Metadata = { title: "My grievances — PRIME" };

const STATUS_STYLE: Record<string, string> = {
  submitted: "bg-zinc-100 text-zinc-700",
  under_review: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function MyGrievancesPage() {
  const items = await getMyGrievances();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">My grievances</h1>
        <Link href="/grievance-redressal" className="text-sm font-medium text-[#2D6A4F] underline">
          File new
        </Link>
      </div>
      <p className="mt-1 text-sm text-zinc-500">Grievances filed while signed in.</p>

      <div className="mt-6 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
        {items.map((g) => (
          <div key={g.ticketRef} className="flex items-start justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="font-mono text-xs text-zinc-500">{g.ticketRef}</p>
              <p className="mt-0.5 font-medium text-zinc-900">{g.subject}</p>
              <p className="mt-0.5 text-xs text-zinc-400">
                {CATEGORY_LABELS[g.category] ?? g.category} · {fmt(g.createdAt)}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[g.status] ?? "bg-zinc-100"}`}>
              {g.status.replace("_", " ")}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-zinc-400">
            You haven&apos;t filed any grievances while signed in.
          </p>
        )}
      </div>

      <p className="mt-4 text-center">
        <Link href="/account" className="text-sm text-zinc-500 underline">Back to account</Link>
      </p>
    </main>
  );
}
