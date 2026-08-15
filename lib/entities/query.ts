import { prisma } from "@/lib/db";
import { toDelegateName, type EntityConfig } from "@/lib/entities/config";
import type { RefOption } from "@/components/items/generic-table-editor";

type Delegate = { findMany: (args: unknown) => Promise<Record<string, unknown>[]> };

function getDelegate(model: string): Delegate {
  return (prisma as unknown as Record<string, Delegate>)[toDelegateName(model)];
}

export async function getEntityRows(model: string, dealId: string) {
  return getDelegate(model).findMany({ where: { dealId }, orderBy: { createdAt: "asc" } });
}

/** Server Components pass Date props to Client Components fine via RSC, but this codebase's
 * convention (see item.dueDate) is to serialize explicitly to ISO strings for clarity. */
export function serializeRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([k, v]) => [k, v instanceof Date ? v.toISOString() : v])
    )
  );
}

/** Resolves every referenceSelect column's option list for a given entity config — shared by the
 * item page (dropdowns) and the generic xlsx exporter (id → label translation). */
export async function getRefOptionsForConfig(
  config: EntityConfig,
  dealId: string
): Promise<Record<string, RefOption[]>> {
  const refOptions: Record<string, RefOption[]> = {};
  const refEntities = Array.from(
    new Set(
      config.columns
        .filter((c) => c.type === "referenceSelect" && c.refEntity)
        .map((c) => c.refEntity as string)
    )
  );
  for (const refEntity of refEntities) {
    const refRows = serializeRows(await getEntityRows(refEntity, dealId));
    const labelField = config.columns.find((c) => c.refEntity === refEntity)?.refLabelField ?? "id";
    refOptions[refEntity] = refRows.map((r) => ({
      value: r.id as string,
      label: String(r[labelField] ?? r.id),
    }));
  }
  return refOptions;
}
