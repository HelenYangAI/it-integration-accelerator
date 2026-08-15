import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveDeal } from "@/lib/deal";
import { getAssetInventoryItems } from "@/lib/catalog";
import { buildNarrativeDocx } from "@/lib/export/docx/narrative";
import { buildAssetInventoryXlsx } from "@/lib/export/xlsx/asset-inventory";
import { buildEntityXlsx } from "@/lib/export/xlsx/generic-entity";
import { buildChecklistDocx } from "@/lib/export/docx/checklist";
import { getEntityConfig } from "@/lib/entities/config";
import { getEntityRows, serializeRows, getRefOptionsForConfig } from "@/lib/entities/query";
import { renderPdf } from "@/lib/export/pdf/render";
import { slugFilename } from "@/lib/export/filename";

export async function GET(
  request: Request,
  ctx: { params: Promise<{ key: string }> }
) {
  const { key } = await ctx.params;
  const format = new URL(request.url).searchParams.get("format");

  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const item = await prisma.integrationItem.findUnique({
    where: { dealId_itemKey: { dealId: deal.id, itemKey: key } },
    include: { template: true, tasks: { orderBy: { order: "asc" } } },
  });
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  if (format === "docx" && item.template.renderKind === "NARRATIVE") {
    const markdown =
      item.content && typeof item.content === "object" && "markdown" in item.content
        ? String((item.content as { markdown: unknown }).markdown ?? "")
        : "";
    if (!markdown) {
      return NextResponse.json({ error: "Nothing to export yet — generate or write content first" }, { status: 400 });
    }
    const buffer = await buildNarrativeDocx(item.template.title, markdown);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${slugFilename(item.template.title)}.docx"`,
      },
    });
  }

  if (format === "xlsx" && item.template.linkedEntity === "AssetInventoryItem") {
    const items = await getAssetInventoryItems(deal.id);
    if (items.length === 0) {
      return NextResponse.json({ error: "Nothing to export yet — add or generate inventory rows first" }, { status: 400 });
    }
    const buffer = await buildAssetInventoryXlsx(items);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${slugFilename(item.template.title)}.xlsx"`,
      },
    });
  }

  if (format === "xlsx" && item.template.linkedEntity && item.template.linkedEntity !== "AssetInventoryItem") {
    const config = getEntityConfig(item.template.linkedEntity);
    if (config) {
      const rows = serializeRows(await getEntityRows(item.template.linkedEntity, deal.id));
      if (rows.length === 0) {
        return NextResponse.json({ error: "Nothing to export yet — add or generate rows first" }, { status: 400 });
      }
      const refOptions = await getRefOptionsForConfig(config, deal.id);
      const buffer = await buildEntityXlsx(config, rows, refOptions);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${slugFilename(item.template.title)}.xlsx"`,
        },
      });
    }
  }

  if (format === "docx" && item.template.renderKind === "CHECKLIST") {
    if (item.tasks.length === 0) {
      return NextResponse.json({ error: "Nothing to export yet — add or generate tasks first" }, { status: 400 });
    }
    const buffer = await buildChecklistDocx(
      item.template.title,
      item.tasks.map((t) => ({
        task: t.task,
        status: t.status,
        owner: t.owner,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
        notes: t.notes,
      }))
    );
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${slugFilename(item.template.title)}.docx"`,
      },
    });
  }

  if (format === "pdf") {
    const printUrl = new URL(`/print/${key}`, request.url).toString();
    const buffer = await renderPdf(printUrl, item.template.renderKind === "TABLE");
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${slugFilename(item.template.title)}.pdf"`,
      },
    });
  }

  return NextResponse.json(
    { error: `Export format "${format}" is not yet available for this item` },
    { status: 400 }
  );
}
