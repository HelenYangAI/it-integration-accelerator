import { prisma } from "@/lib/db";
import { newDeck, addTitleSlide, addTableSlide, toBuffer, RAG_HEX } from "@/lib/export/pptx/common";
import { ITEM_STATUS_LABELS, RAG_STATUS_LABELS } from "@/lib/labels";

export async function buildDay1ReadinessPptx(dealName: string, dealId: string): Promise<Buffer> {
  const category = await prisma.integrationCategory.findUnique({
    where: { slug: "day1-readiness" },
    include: {
      templates: {
        orderBy: { order: "asc" },
        include: { items: { where: { dealId }, include: { tasks: true } } },
      },
    },
  });

  const pres = newDeck();
  addTitleSlide(pres, "Day 1 Readiness — Go/No-Go Summary", dealName);

  const rows = (category?.templates ?? []).map((t) => {
    const item = t.items[0];
    const totalTasks = item?.tasks.length ?? 0;
    const doneTasks = item?.tasks.filter((x) => x.status === "DONE").length ?? 0;
    const taskSummary = t.renderKind === "CHECKLIST" ? `${doneTasks}/${totalTasks} done` : "—";
    const rag = item?.ragStatus ?? "GREEN";
    return [
      t.title,
      item ? ITEM_STATUS_LABELS[item.status] : ITEM_STATUS_LABELS.NOT_STARTED,
      { text: RAG_STATUS_LABELS[rag], fill: RAG_HEX[rag] },
      taskSummary,
      item?.owner ?? "",
    ];
  });

  addTableSlide(pres, "Readiness Status", ["Item", "Status", "RAG", "Tasks", "Owner"], rows);

  return toBuffer(pres);
}
