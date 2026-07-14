import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/user-session";
import { unreadNotificationCount } from "@/lib/dal/events";
import { REGISTRANT_TYPE_LABELS, PERSONAS } from "@/lib/users/types";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "My account — PRIME Meghalaya",
};

const NAV: { href: string; label: string; desc: string }[] = [
  { href: "/account/id-card", label: "PRIME ID", desc: "Request or download your ID card" },
  { href: "/account/programs", label: "Programs", desc: "Pre-Incubation, Funding, Office Space & more" },
  { href: "/account/mentorship", label: "Mentorship", desc: "Your mentor, mentees & sessions" },
  { href: "/account/documents", label: "Documents", desc: "Upload & verify your documents" },
  { href: "/account/timeline", label: "Timeline", desc: "Your PRIME journey & announcements" },
  { href: "/account/notifications", label: "Notifications", desc: "Approvals & updates" },
  { href: "/account/grievances", label: "Grievances", desc: "Track grievances you filed" },
];

/**
 * Member hub — links into the ID card, timeline, and notifications. The full
 * dashboard (programs, funding, …) is built on top of this in later phases.
 */
export default async function AccountPage() {
  const user = await requireUser("/account");
  const unread = await unreadNotificationCount();
  const registeredAs = user.registrantType
    ? REGISTRANT_TYPE_LABELS[user.registrantType]
    : (PERSONAS.find((p) => p.value === user.persona)?.label ?? "Member");

  const rows: { label: string; value: string }[] = [
    { label: "Name", value: user.fullName },
    { label: "Email", value: user.email },
    { label: "Registered as", value: registeredAs },
    { label: "District", value: user.district ?? "—" },
    {
      label: "Email status",
      value: user.emailVerified ? "Verified" : "Unverified",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">My account</h1>
        <form action={logoutAction}>
          <button className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100">
            Sign out
          </button>
        </form>
      </div>

      <p className="mt-2 text-sm text-zinc-600">
        Welcome, {user.fullName.split(" ")[0]}. Your PRIME account is active — apply for a PRIME ID,
        programmes, and more below.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-zinc-900">{n.label}</span>
              {n.href === "/account/notifications" && unread > 0 && (
                <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-medium text-white">{unread}</span>
              )}
            </div>
            <p className="mt-1 text-xs text-zinc-500">{n.desc}</p>
          </Link>
        ))}
      </div>

      <dl className="mt-6 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between px-5 py-3.5 text-sm">
            <dt className="text-zinc-500">{r.label}</dt>
            <dd className="font-medium text-zinc-900">{r.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-sm text-zinc-500">
        <Link href="/" className="font-medium text-zinc-900 underline">
          Back to home
        </Link>
      </p>
    </main>
  );
}
