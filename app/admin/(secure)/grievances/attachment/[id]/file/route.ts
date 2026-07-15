import { getGrievanceAttachmentFileAdmin } from "@/lib/dal/grievances";

/**
 * Serve a grievance attachment to an authorized admin. requireAdmin +
 * assertCan("grievance:read") + region scoping (via RLS) live inside the DAL;
 * the access is audited. Never cached; sniffing disabled.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const file = await getGrievanceAttachmentFileAdmin(id);
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
