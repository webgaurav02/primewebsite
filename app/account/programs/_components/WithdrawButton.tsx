"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { withdrawAction } from "../actions";

export default function WithdrawButton({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    if (!confirm("Withdraw this application? This can't be undone.")) return;
    setPending(true);
    const res = await withdrawAction(applicationId);
    if (res.ok) router.refresh();
    else setPending(false);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50"
    >
      {pending ? "Withdrawing…" : "Withdraw"}
    </button>
  );
}
