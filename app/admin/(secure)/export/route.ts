import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { EXPORTS } from "@/lib/export/datasets";
import { toXlsxBuffer } from "@/lib/export/xlsx";

/**
 * One route for every admin XLSX export: /admin/export?dataset=<name>&<filters>.
 * requireAdmin gates authentication; each dataset declares the permission it
 * needs, and the underlying DAL re-enforces authz + RLS + audit.
 */
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(); // redirects to /admin/login if anonymous

  const url = new URL(req.url);
  const dataset = url.searchParams.get("dataset") ?? "";
  const spec = EXPORTS[dataset];
  if (!spec) return new Response("Unknown export.", { status: 404 });
  if (!can(admin, spec.permission)) return new Response("Forbidden.", { status: 403 });

  const { columns, rows } = await spec.build(url.searchParams);
  const buf = await toXlsxBuffer(spec.sheet, columns, rows);
  const date = new Date().toISOString().slice(0, 10);

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${spec.filenameBase}-${date}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
