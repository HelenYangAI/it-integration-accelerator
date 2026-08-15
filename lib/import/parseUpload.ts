import Papa from "papaparse";
import ExcelJS from "exceljs";

export type ParsedUpload = {
  headers: string[];
  rows: Record<string, string>[];
};

export async function parseUploadedFile(
  buffer: Buffer,
  filename: string
): Promise<ParsedUpload> {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".csv")) {
    return parseCsv(buffer.toString("utf-8"));
  }
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
    return parseXlsx(buffer);
  }
  throw new Error("Unsupported file type. Please upload a .csv or .xlsx file.");
}

function parseCsv(text: string): ParsedUpload {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  const headers = result.meta.fields ?? [];
  const rows = result.data.filter((r) => Object.values(r).some((v) => v && v.trim() !== ""));
  return { headers, rows };
}

async function parseXlsx(buffer: Buffer): Promise<ParsedUpload> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) return { headers: [], rows: [] };

  const headerRow = sheet.getRow(1);
  const headers: string[] = [];
  headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    headers[colNumber - 1] = String(cell.value ?? "").trim();
  });

  const rows: Record<string, string>[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const record: Record<string, string> = {};
    let hasValue = false;
    headers.forEach((header, i) => {
      if (!header) return;
      const cell = row.getCell(i + 1);
      const value = cell.value;
      const text =
        value === null || value === undefined
          ? ""
          : typeof value === "object" && "text" in (value as object)
            ? String((value as { text: unknown }).text ?? "")
            : String(value);
      if (text.trim() !== "") hasValue = true;
      record[header] = text;
    });
    if (hasValue) rows.push(record);
  });

  return { headers: headers.filter(Boolean), rows };
}
