import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/user-session";
import { PERSONAS } from "@/lib/users/types";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "My account — PRIME Meghalaya",
};

/**
 * Minimal authenticated landing. Proves the session works end-to-end; the full
 * member dashboard (timeline, ID card, programs, …) is built on top of this in
 * later phases.
 */
export default async function AccountPage() {
  const user = await requireUser("/account");
  const personaLabel =
    PERSONAS.find((p) => p.value === user.persona)?.label ?? user.persona;

  const rows: { label: string; value: string }[] = [
    { label: "Name", value: user.fullName },
    { label: "Email", value: user.email },
    { label: "Registered as", value: personaLabel },
    { label: "District", value: user.district ?? "—" },
    {
      label: "Account status",
      value: user.status === "active" ? "Active" : "Pending review",
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
        Welcome, {user.fullName.split(" ")[0]}. Your profile is{" "}
        {user.status === "active" ? "active" : "pending review by PRIME"}.
      </p>

      <dl className="mt-8 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between px-5 py-3.5 text-sm">
            <dt className="text-zinc-500">{r.label}</dt>
            <dd className="font-medium text-zinc-900">{r.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-sm text-zinc-500">
        A government-recognized PRIME ID can be issued once your profile is
        reviewed.{" "}
        <Link href="/" className="font-medium text-zinc-900 underline">
          Back to home
        </Link>
      </p>
    </main>
  );
}
