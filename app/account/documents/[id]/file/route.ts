import { getMyDocumentFile } from "@/lib/dal/documents";

/**
 * Serve a member's OWN document. Ownership is enforced by RLS inside the DAL —
 * a request for another member's document id resolves to null → 404. Never
 * cached (sensitive KYC material).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const file = await getMyDocumentFile(id);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(file.buffer), {
    headers: {
      "Content-Type": file.mime,
      "Content-Disposition": `inline; filename="${file.name.replace(/["\r\n]/g, "")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
