import type { Metadata } from "next";
import Link from "next/link";
import { getMyDocuments } from "@/lib/dal/documents";
import { DOCUMENT_KIND_LABELS, DOCUMENT_STATUS_LABELS } from "@/lib/documents/types";
import UploadForm from "./_components/UploadForm";
import DeleteButton from "./_components/DeleteButton";

export const metadata: Metadata = { title: "Documents — My account" };

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  verified: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function DocumentsPage() {
  const docs = await getMyDocuments();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Documents</h1>
        <Link href="/account" className="text-sm text-zinc-500 underline">Back to account</Link>
      </div>
      <p className="mt-1 text-sm text-zinc-500">
        Upload KYC and business documents for PRIME to verify. Files are private to you and PRIME.
      </p>

      <div className="mt-6">
        <UploadForm />
      </div>

      <div className="mt-6 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
        {docs.map((d) => (
          <div key={d.id} className="flex items-start justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="font-medium text-zinc-900">{DOCUMENT_KIND_LABELS[d.kind]}</p>
              <p className="mt-0.5 text-xs text-zinc-400">
                {d.originalName ? `${d.originalName} · ` : ""}{fmtSize(d.sizeBytes)} · {fmt(d.uploadedAt)}
              </p>
              {d.status === "rejected" && d.rejectionReason && (
                <p className="mt-1 text-sm text-red-700">{d.rejectionReason}</p>
              )}
              <div className="mt-1.5 flex items-center gap-3">
                <a
                  href={`/account/documents/${d.id}/file`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#2D6A4F] underline"
                >
                  View
                </a>
                <DeleteButton id={d.id} />
              </div>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[d.status] ?? "bg-zinc-100"}`}>
              {DOCUMENT_STATUS_LABELS[d.status]}
            </span>
          </div>
        ))}
        {docs.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-zinc-400">You haven&apos;t uploaded any documents yet.</p>
        )}
      </div>
    </main>
  );
}
