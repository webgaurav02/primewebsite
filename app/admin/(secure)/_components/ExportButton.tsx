/**
 * "Export XLSX" link → the shared /admin/export route. Server component (plain
 * anchor); the route sets Content-Disposition so the browser downloads the file.
 * Pass the page's current filters so the export matches what's on screen.
 */
export default function ExportButton({
  dataset,
  params = {},
  label = "Export XLSX",
}: {
  dataset: string;
  params?: Record<string, string | undefined>;
  label?: string;
}) {
  const qs = new URLSearchParams({ dataset });
  for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);

  return (
    <a
      href={`/admin/export?${qs.toString()}`}
      className="inline-flex items-center gap-1.5 rounded border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <path d="M12 3v12" />
        <path d="M8 11l4 4 4-4" />
        <path d="M5 21h14" />
      </svg>
      {label}
    </a>
  );
}
