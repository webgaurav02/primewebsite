import type { Metadata } from "next";
import Link from "next/link";
import { getMyTimeline } from "@/lib/dal/events";

export const metadata: Metadata = { title: "My timeline — PRIME" };

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function TimelinePage() {
  const items = await getMyTimeline();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Your PRIME journey</h1>
        <Link href="/account" className="text-sm text-zinc-500 underline">Account</Link>
      </div>
      <p className="mt-1 text-sm text-zinc-500">Your milestones and PRIME announcements, newest first.</p>

      <ol className="mt-8 space-y-0">
        {items.map((e, i) => (
          <li key={e.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${e.visibility === "public" ? "bg-[#2D6A4F]" : "bg-zinc-800"}`} />
              {i < items.length - 1 && <span className="w-px flex-1 bg-zinc-200" />}
            </div>
            <div className="pb-6">
              <div className="flex items-baseline gap-2">
                <p className="font-medium text-zinc-900">{e.title}</p>
                {e.visibility === "public" && (
                  <span className="rounded-full bg-[#2D6A4F]/10 px-2 py-0.5 text-[10px] font-medium text-[#2D6A4F]">PRIME</span>
                )}
              </div>
              {e.body && <p className="mt-0.5 text-sm text-zinc-600">{e.body}</p>}
              <p className="mt-1 text-xs text-zinc-400">{fmt(e.at)}</p>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <p className="py-10 text-center text-sm text-zinc-400">Nothing here yet.</p>
        )}
      </ol>
    </main>
  );
}
