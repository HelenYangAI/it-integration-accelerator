import { prisma } from "@/lib/db";
import { newDeck, addTitleSlide, addTableSlide, toBuffer } from "@/lib/export/pptx/common";

export async function buildGovernancePptx(dealName: string, dealId: string): Promise<Buffer> {
  const entries = await prisma.raciEntry.findMany({ where: { dealId }, orderBy: { createdAt: "asc" } });

  const pres = newDeck();
  addTitleSlide(pres, "IT Integration Governance", dealName);
  addTableSlide(
    pres,
    "Governance Model (RACI)",
    ["Activity", "Responsible", "Accountable", "Consulted", "Informed", "Stakeholder Group"],
    entries.map((e) => [
      e.activity,
      e.responsible ?? "",
      e.accountable ?? "",
      e.consulted ?? "",
      e.informed ?? "",
      e.stakeholderGroup ?? "",
    ])
  );

  return toBuffer(pres);
}
