import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/user-session";
import { uploadDocument } from "@/lib/dal/documents";
import { MAX_DOCUMENT_BYTES } from "@/lib/storage";

/**
 * Member document upload (browser → server → R2). Thin: the DAL validates the
 * kind, magic-byte-checks the file, uploads, and replaces any same-kind document.
 */
export async function POST(request: Request): Promise<NextResponse> {
  await requireUser();

  const form = await request.formData();
  const kind = form.get("kind");
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_DOCUMENT_BYTES) {
    return NextResponse.json({ ok: false, error: "File must be under 10 MB." }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const res = await uploadDocument(kind, buffer, file.name);
  if (!res.ok) return NextResponse.json(res, { status: 400 });
  return NextResponse.json({ ok: true });
}
