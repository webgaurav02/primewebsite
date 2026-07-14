import { getDocumentFileAdmin } from "@/lib/dal/documents";

/**
 * Serve a document to a verifying admin. requireAdmin + assertCan("document:verify")
 * live inside the DAL; the access is audited. Never cached.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const file = await getDocumentFileAdmin(id);
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
