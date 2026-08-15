import { NextResponse } from "next/server";
import { getActiveDeal } from "@/lib/deal";
import { parseUploadedFile } from "@/lib/import/parseUpload";
import { ASSET_INVENTORY_TARGET_FIELDS, suggestColumnMapping } from "@/lib/import/columnMapping";

const MAX_ROWS = 2000;

export async function POST(request: Request) {
  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  let parsed;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    parsed = await parseUploadedFile(buffer, file.name);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to parse file";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (parsed.headers.length === 0) {
    return NextResponse.json({ error: "No columns found in the uploaded file" }, { status: 400 });
  }
  if (parsed.rows.length === 0) {
    return NextResponse.json({ error: "No data rows found in the uploaded file" }, { status: 400 });
  }

  const rows = parsed.rows.slice(0, MAX_ROWS);
  const suggestedMapping = suggestColumnMapping(parsed.headers, ASSET_INVENTORY_TARGET_FIELDS);

  return NextResponse.json({
    headers: parsed.headers,
    rows,
    truncated: parsed.rows.length > MAX_ROWS,
    totalRows: parsed.rows.length,
    suggestedMapping,
    targetFields: ASSET_INVENTORY_TARGET_FIELDS.map(({ key, label, required }) => ({
      key,
      label,
      required: Boolean(required),
    })),
  });
}
