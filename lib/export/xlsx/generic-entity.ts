import ExcelJS from "exceljs";
import type { EntityConfig } from "@/lib/entities/config";
import type { RefOption } from "@/components/items/generic-table-editor";

function formatCell(
  value: unknown,
  col: EntityConfig["columns"][number],
  refOptions: Record<string, RefOption[]>
): string | number | boolean {
  if (value === null || value === undefined) return "";
  if (col.type === "select" && col.options) {
    const match = col.options.find((o) => o.value === value);
    return match ? match.label : String(value);
  }
  if (col.type === "referenceSelect" && col.refEntity) {
    const match = refOptions[col.refEntity]?.find((o) => o.value === value);
    return match ? match.label : String(value);
  }
  if (col.type === "date" && typeof value === "string") {
    return value.slice(0, 10);
  }
  if (col.type === "boolean") return Boolean(value);
  if (col.type === "number") return typeof value === "number" ? value : Number(value);
  return String(value);
}

export async function buildEntityXlsx(
  config: EntityConfig,
  rows: Record<string, unknown>[],
  refOptions: Record<string, RefOption[]> = {}
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(config.label.slice(0, 31));

  sheet.columns = config.columns.map((col) => ({
    header: col.label,
    key: col.key,
    width: col.type === "textarea" ? 40 : 18,
  }));

  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE9ECEF" } };
  sheet.autoFilter = {
    from: "A1",
    to: `${String.fromCharCode(64 + config.columns.length)}1`,
  };

  for (const row of rows) {
    const record: Record<string, unknown> = {};
    for (const col of config.columns) {
      record[col.key] = formatCell(row[col.key], col, refOptions);
    }
    sheet.addRow(record);
  }

  const written = await workbook.xlsx.writeBuffer();
  return Buffer.from(written as unknown as ArrayBuffer);
}
