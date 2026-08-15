import { prisma } from "@/lib/db";
import { newDeck, addTitleSlide, addTableSlide, toBuffer, RAG_HEX } from "@/lib/export/pptx/common";

const PHASES: { key: string; label: string }[] = [
  { key: "DAY1", label: "Day 1 Milestones" },
  { key: "DAY100", label: "Day 100 Milestones" },
  { key: "LONG_TERM", label: "Long-Term Milestones" },
];

export async function buildRoadmapPptx(dealName: string, dealId: string): Promise<Buffer> {
  const milestones = await prisma.milestone.findMany({
    where: { dealId },
    orderBy: [{ phase: "asc" }, { dueDate: "asc" }],
  });

  const pres = newDeck();
  addTitleSlide(pres, "IT Integration Roadmap", dealName);

  for (const phase of PHASES) {
    const rows = milestones.filter((m) => m.phase === phase.key);
    if (rows.length === 0) continue;
    addTableSlide(
      pres,
      phase.label,
      ["Milestone", "Tag", "Due Date", "Owner", "Status", "RAG"],
      rows.map((m) => [
        m.title,
        m.tag ?? "",
        m.dueDate ? m.dueDate.toISOString().slice(0, 10) : "",
        m.owner ?? "",
        m.status,
        { text: m.ragStatus, fill: RAG_HEX[m.ragStatus] },
      ])
    );
  }

  return toBuffer(pres);
}
