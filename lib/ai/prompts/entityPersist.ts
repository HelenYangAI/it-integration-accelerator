import { prisma } from "@/lib/db";
import { toDelegateName } from "@/lib/entities/config";

type Delegate = { createMany: (args: unknown) => Promise<unknown> };

function getDelegate(model: string): Delegate {
  return (prisma as unknown as Record<string, Delegate>)[toDelegateName(model)];
}

/**
 * Shared persist for TABLE prompt configs backed by a flat ENTITY_CONFIGS entity: inserts
 * AI-suggested rows via createMany. Always additive — never overwrites or deletes existing
 * manually-entered or previously-suggested rows.
 */
export function makeEntityPersist<T extends Record<string, unknown>>(
  model: string,
  mapRow: (row: T) => Record<string, unknown>
) {
  return async ({ dealId, output }: { dealId: string; itemId: string; output: { items: T[] } }) => {
    const rows = output.items;
    await getDelegate(model).createMany({
      data: rows.map((r) => ({ dealId, ...mapRow(r) })),
    });
    return { createdCount: rows.length };
  };
}

export function toDateOrUndefined(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

type ChecklistOutput = { tasks: { task: string; owner: string | null; notes: string | null }[] };

/** Shared persist for CHECKLIST prompt configs: appends AI-drafted tasks after any existing ones. */
export function makeChecklistPersist() {
  return async ({ itemId, output }: { dealId: string; itemId: string; output: ChecklistOutput }) => {
    const existingCount = await prisma.checklistTask.count({ where: { itemId } });
    await prisma.checklistTask.createMany({
      data: output.tasks.map((t, i) => ({
        itemId,
        task: t.task,
        owner: t.owner,
        notes: t.notes,
        order: existingCount + i,
      })),
    });
    return { createdCount: output.tasks.length };
  };
}
