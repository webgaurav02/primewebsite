"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteDocumentAction } from "../actions";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    if (!confirm("Delete this document?")) return;
    setPending(true);
    const res = await deleteDocumentAction(id);
    if (res.ok) router.refresh();
    else setPending(false);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-xs font-medium text-zinc-500 underline hover:text-zinc-800 disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
