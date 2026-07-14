import type { Metadata } from "next";
import Image from "next/image";
import { listPublicEvents } from "@/lib/dal/events";

export const metadata: Metadata = {
  title: "Events & Announcements — PRIME Meghalaya",
};

// Public, DB-backed — render per request.
export const dynamic = "force-dynamic";

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function EventsPage() {
  const events = await listPublicEvents();

  return (
    <main className="min-h-screen bg-[#f9f9f9] px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex justify-center">
          <Image src="/logo-color.png" alt="PRIME Meghalaya" width={676} height={183} className="h-9 w-auto" priority />
        </div>
        <h1 className="text-center text-3xl font-black tracking-tight text-[#1B4332]">Events &amp; Announcements</h1>
        <p className="mt-2 text-center text-sm text-black/50">The latest from PRIME Meghalaya.</p>

        <div className="mt-10 space-y-4">
          {events.map((e) => (
            <div key={e.id} className="rounded-xl border border-black/[0.08] bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-[#2D6A4F]">{fmt(e.at)}</p>
              <h2 className="mt-1 text-lg font-bold text-black">{e.title}</h2>
              {e.body && <p className="mt-1 text-sm leading-relaxed text-black/60">{e.body}</p>}
            </div>
          ))}
          {events.length === 0 && (
            <p className="py-12 text-center text-sm text-black/40">No announcements yet. Check back soon.</p>
          )}
        </div>
      </div>
    </main>
  );
}
