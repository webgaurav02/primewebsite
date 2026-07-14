import type { Metadata } from "next";
import Link from "next/link";
import { getMyNotifications } from "@/lib/dal/events";
import { markReadAction, markAllReadAction } from "./actions";

export const metadata: Metadata = { title: "Notifications — PRIME" };

function timeAgo(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function NotificationsPage() {
  const { items, unread } = await getMyNotifications();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Notifications {unread > 0 && <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white align-middle">{unread}</span>}
        </h1>
        <div className="flex items-center gap-3">
          {unread > 0 && (
            <form action={markAllReadAction}>
              <button className="text-sm text-zinc-500 underline">Mark all read</button>
            </form>
          )}
          <Link href="/account" className="text-sm text-zinc-500 underline">Account</Link>
        </div>
      </div>

      <div className="mt-6 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
        {items.map((n) => (
          <div key={n.id} className={`flex items-start gap-3 px-5 py-4 ${n.readAt ? "" : "bg-emerald-50/40"}`}>
            {!n.readAt && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-medium text-zinc-900">{n.title}</p>
                <span className="shrink-0 text-xs text-zinc-400">{timeAgo(n.createdAt)}</span>
              </div>
              {n.body && <p className="mt-0.5 text-sm text-zinc-600">{n.body}</p>}
              {n.link && (
                <Link href={n.link} className="mt-1 inline-block text-sm font-medium text-[#2D6A4F] underline">
                  View
                </Link>
              )}
            </div>
            {!n.readAt && (
              <form action={markReadAction}>
                <input type="hidden" name="id" value={n.id} />
                <button className="shrink-0 rounded border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100">
                  Mark read
                </button>
              </form>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-zinc-400">No notifications yet.</p>
        )}
      </div>
    </main>
  );
}
