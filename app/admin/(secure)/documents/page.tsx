import { listDocuments } from "@/lib/dal/documents";
import { getCurrentAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import type { DocumentStatus } from "@/lib/documents/types";
import { DOCUMENT_KIND_LABELS, DOCUMENT_STATUS_LABELS } from "@/lib/documents/types";
import { verifyDocumentAction, rejectDocumentAction } from "./actions";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  verified: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};
const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Verified", value: "verified" },
  { label: "Rejected", value: "rejected" },
];

export default async function AdminDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin || !can(admin, "document:verify")) {
    return <p className="text-sm text-zinc-500">You don&apos;t have access to documents.</p>;
  }
  const sp = await searchParams;
  const status = (["pending", "verified", "rejected"] as const).includes(sp.status as DocumentStatus)
    ? (sp.status as DocumentStatus)
    : undefined;

  const docs = await listDocuments({ status });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Documents</h1>
      <p className="mt-1 text-sm text-zinc-500">{docs.length} document(s). Verify or reject uploaded KYC / business documents.</p>

      <div className="mt-4 flex gap-2">
        {FILTERS.map((f) => (
          <a
            key={f.value}
            href={f.value ? `/admin/documents?status=${f.value}` : "/admin/documents"}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              (status ?? "") === f.value ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {docs.map((d) => (
          <div key={d.id} className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-zinc-900">{d.ownerName}</span>
              <span className="text-sm text-zinc-500">· {DOCUMENT_KIND_LABELS[d.kind]}</span>
              <span className={`ml-auto rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[d.status]}`}>
                {DOCUMENT_STATUS_LABELS[d.status]}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              {d.originalName ? `${d.originalName} · ` : ""}{d.mime}
              {d.rejectionReason ? ` · ${d.rejectionReason}` : ""}
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <a
                href={`/admin/documents/${d.id}/file`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-100"
              >
                View file
              </a>
              {d.status !== "verified" && (
                <form action={verifyDocumentAction}>
                  <input type="hidden" name="documentId" value={d.id} />
                  <button className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700">
                    Verify
                  </button>
                </form>
              )}
              {d.status !== "rejected" && (
                <form action={rejectDocumentAction} className="flex items-end gap-1">
                  <input type="hidden" name="documentId" value={d.id} />
                  <input name="reason" placeholder="Reason" required className="w-40 rounded border border-zinc-300 px-2 py-1 text-xs" />
                  <button className="rounded border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50">
                    Reject
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
        {docs.length === 0 && (
          <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-10 text-center text-zinc-400">
            No documents found.
          </p>
        )}
      </div>
    </div>
  );
}
