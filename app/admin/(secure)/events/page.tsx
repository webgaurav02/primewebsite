import { listPublicEvents } from "@/lib/dal/events";
import PublishForm from "./_components/PublishForm";

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminEventsPage() {
  const events = await listPublicEvents();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Events &amp; Announcements</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Published events appear on the public /events page and in every member&apos;s timeline.
      </p>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <PublishForm />

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Published</h2>
          <div className="mt-2 space-y-3">
            {events.map((e) => (
              <div key={e.id} className="rounded-lg border border-zinc-200 bg-white p-4">
                <p className="text-xs font-medium text-[#2D6A4F]">{fmt(e.at)}</p>
                <p className="mt-0.5 font-medium text-zinc-900">{e.title}</p>
                {e.body && <p className="mt-0.5 text-sm text-zinc-600">{e.body}</p>}
              </div>
            ))}
            {events.length === 0 && (
              <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-8 text-center text-sm text-zinc-400">
                Nothing published yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
