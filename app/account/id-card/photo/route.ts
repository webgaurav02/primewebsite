import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/user-session";
import { uploadUserImage, MAX_IMAGE_BYTES } from "@/lib/storage";

/**
 * Member photo upload for the PRIME ID card. Goes browser → server → R2 (so no
 * bucket CORS config is needed). Returns an opaque object key the request form
 * submits with the PRIME ID request.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const user = await requireUser();

  const form = await request.formData();
  const file = form.get("photo");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ ok: false, error: "Image must be under 5 MB." }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadUserImage("prime-id", user.id, buffer);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, key: result.key });
}
