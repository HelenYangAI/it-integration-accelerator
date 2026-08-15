import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveDeal } from "@/lib/deal";
import { getItemByKey, getAssetInventoryItems } from "@/lib/catalog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RENDER_KIND_LABELS } from "@/lib/labels";
import { ItemTrackingControls } from "@/components/items/item-tracking-controls";
import { NarrativeEditor } from "@/components/items/narrative-editor";
import { AssetInventoryTable } from "@/components/items/asset-inventory-table";
import { ChecklistEditor } from "@/components/items/checklist-editor";
import { ExportMenu } from "@/components/items/export-menu";
import { GenericTableEditor } from "@/components/items/generic-table-editor";
import { getEntityConfig } from "@/lib/entities/config";
import { getEntityRows, serializeRows, getRefOptionsForConfig } from "@/lib/entities/query";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ itemKey: string }>;
}) {
  const { itemKey } = await params;
  const deal = await getActiveDeal();
  if (!deal) return null;

  const item = await getItemByKey(deal.id, itemKey);
  if (!item) notFound();

  const { template } = item;

  const assetInventoryItems =
    template.linkedEntity === "AssetInventoryItem" ? await getAssetInventoryItems(deal.id) : null;

  const genericTableConfig =
    template.renderKind === "TABLE" && template.linkedEntity && template.linkedEntity !== "AssetInventoryItem"
      ? getEntityConfig(template.linkedEntity)
      : undefined;

  let genericRows: Record<string, unknown>[] = [];
  let refOptions: Awaited<ReturnType<typeof getRefOptionsForConfig>> = {};
  if (genericTableConfig && template.linkedEntity) {
    genericRows = serializeRows(await getEntityRows(template.linkedEntity, deal.id));
    refOptions = await getRefOptionsForConfig(genericTableConfig, deal.id);
  }

  const exportFormats: { format: string; label: string }[] = [];
  if (template.renderKind === "NARRATIVE" && item.content) {
    exportFormats.push({ format: "docx", label: "Export Word (.docx)" });
  }
  if (assetInventoryItems && assetInventoryItems.length > 0) {
    exportFormats.push({ format: "xlsx", label: "Export Excel (.xlsx)" });
  }
  if (genericTableConfig && genericRows.length > 0) {
    exportFormats.push({ format: "xlsx", label: "Export Excel (.xlsx)" });
  }
  if (template.renderKind === "CHECKLIST" && item.tasks.length > 0) {
    exportFormats.push({ format: "docx", label: "Export Word (.docx)" });
  }
  const hasAnyContent =
    (template.renderKind === "NARRATIVE" && Boolean(item.content)) ||
    Boolean(assetInventoryItems && assetInventoryItems.length > 0) ||
    genericRows.length > 0 ||
    (template.renderKind === "CHECKLIST" && item.tasks.length > 0);
  if (hasAnyContent) {
    exportFormats.push({ format: "pdf", label: "Export PDF" });
  }

  return (
    <div className={template.renderKind === "TABLE" ? "max-w-5xl space-y-6" : "max-w-3xl space-y-6"}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/category/${template.category.slug}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← {template.category.name}
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{template.title}</h1>
            <Badge variant="outline">{RENDER_KIND_LABELS[template.renderKind]}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
        </div>
        <ExportMenu itemKey={item.itemKey} formats={exportFormats} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <ItemTrackingControls
            itemKey={item.itemKey}
            status={item.status}
            ragStatus={item.ragStatus}
            owner={item.owner}
            dueDate={item.dueDate ? item.dueDate.toISOString() : null}
            phase={item.phase}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {template.renderKind === "NARRATIVE" && (
            <NarrativeEditor
              itemKey={item.itemKey}
              initialMarkdown={
                item.content && typeof item.content === "object" && "markdown" in item.content
                  ? String((item.content as { markdown: unknown }).markdown ?? "")
                  : ""
              }
              hasContent={Boolean(item.content)}
            />
          )}
          {template.renderKind === "TABLE" && assetInventoryItems && (
            <AssetInventoryTable itemKey={item.itemKey} initialItems={assetInventoryItems} />
          )}
          {template.renderKind === "TABLE" && genericTableConfig && template.linkedEntity && (
            <GenericTableEditor
              itemKey={item.itemKey}
              entity={template.linkedEntity}
              columns={genericTableConfig.columns}
              initialRows={genericRows}
              refOptions={refOptions}
            />
          )}
          {template.renderKind === "TABLE" && !assetInventoryItems && !genericTableConfig && (
            <TableStub linkedEntity={template.linkedEntity} />
          )}
          {template.renderKind === "CHECKLIST" && (
            <ChecklistEditor
              itemKey={item.itemKey}
              initialTasks={item.tasks.map((t) => ({
                id: t.id,
                task: t.task,
                status: t.status,
                owner: t.owner,
                dueDate: t.dueDate ? t.dueDate.toISOString() : null,
                notes: t.notes,
              }))}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TableStub({ linkedEntity }: { linkedEntity: string | null }) {
  return (
    <p className="text-sm text-muted-foreground">
      This item is backed by the <code className="rounded bg-muted px-1">{linkedEntity}</code>{" "}
      table. A data grid with manual entry, AI-suggested rows, and (for Application &amp;
      Infrastructure Inventory) CSV/Excel import will be available here in Phase 2/3.
    </p>
  );
}

