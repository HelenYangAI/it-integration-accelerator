import type { ColumnConfig } from "@/lib/entities/config";

/** Generic row coercion/validation driven by column config, so we don't need a bespoke Zod schema per entity. */
export function coerceRow(
  input: Record<string, unknown>,
  columns: ColumnConfig[],
  mode: "create" | "update"
): { data: Record<string, unknown>; errors: string[] } {
  const data: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const col of columns) {
    const present = Object.prototype.hasOwnProperty.call(input, col.key);
    if (!present) {
      if (mode === "create" && col.required) errors.push(`${col.label} is required`);
      continue;
    }

    const raw = input[col.key];
    if (raw === null || raw === "") {
      if (col.required) errors.push(`${col.label} is required`);
      data[col.key] = null;
      continue;
    }

    switch (col.type) {
      case "number": {
        const n = Number(raw);
        if (Number.isNaN(n)) errors.push(`${col.label} must be a number`);
        else data[col.key] = n;
        break;
      }
      case "date": {
        const d = new Date(String(raw));
        if (Number.isNaN(d.getTime())) errors.push(`${col.label} must be a valid date`);
        else data[col.key] = d;
        break;
      }
      case "boolean":
        data[col.key] = Boolean(raw);
        break;
      case "select":
        if (col.options && !col.options.some((o) => o.value === raw)) {
          errors.push(`${col.label} has an invalid value`);
        } else {
          data[col.key] = raw;
        }
        break;
      case "text":
      case "textarea":
      case "referenceSelect":
      default:
        data[col.key] = String(raw);
        break;
    }
  }

  return { data, errors };
}
