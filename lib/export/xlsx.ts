import "server-only";
import ExcelJS from "exceljs";

/**
 * Minimal server-side XLSX builder for admin exports. Kept dependency-thin: one
 * sheet, a styled header row, auto-ish column widths. Cells accept string /
 * number / boolean / null — everything else should be stringified by the caller.
 */

export interface XlsxColumn {
  header: string;
  width?: number;
}

export type XlsxCell = string | number | boolean | null;

export async function toXlsxBuffer(
  sheetName: string,
  columns: XlsxColumn[],
  rows: XlsxCell[][],
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "PRIME Meghalaya";
  wb.created = new Date();
  // Excel caps sheet names at 31 chars and forbids : \ / ? * [ ].
  const ws = wb.addWorksheet(sheetName.replace(/[:\\/?*[\]]/g, " ").slice(0, 31) || "Export");

  ws.columns = columns.map((c) => ({
    header: c.header,
    width: c.width ?? Math.min(Math.max(c.header.length + 4, 12), 60),
  }));

  for (const r of rows) ws.addRow(r);

  const header = ws.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1B4332" } };
  header.alignment = { vertical: "middle" };
  header.height = 20;
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } };

  const out = await wb.xlsx.writeBuffer();
  return Buffer.from(out);
}
