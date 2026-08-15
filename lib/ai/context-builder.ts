import { prisma } from "@/lib/db";
import {
  DEAL_TYPE_LABELS,
  COMPANY_ROLE_LABELS,
  IT_FUNCTION_LABELS,
} from "@/lib/labels";

export type DealContext = {
  dealId: string;
  text: string;
};

/**
 * Assembles one consistent text block from the deal's intake data, reused by
 * every prompt template so generated items stay mutually consistent (e.g. the
 * RAID log can reference the same risks the due-diligence item raised).
 */
export async function buildDealContext(dealId: string): Promise<DealContext> {
  const deal = await prisma.deal.findUniqueOrThrow({
    where: { id: dealId },
    include: {
      companies: true,
      itOrgNodes: { orderBy: { level: "asc" } },
    },
  });

  const lines: string[] = [];
  lines.push(`Deal: ${deal.name}`);
  lines.push(`Deal type: ${DEAL_TYPE_LABELS[deal.dealType] ?? deal.dealType}`);
  lines.push(`Industry: ${deal.industry}`);
  lines.push(`Deal thesis: ${deal.dealThesis}`);
  lines.push(`Short-term goals: ${deal.shortTermGoals}`);
  lines.push(`Long-term goals: ${deal.longTermGoals}`);
  lines.push(`Current IT state (as described by the user): ${deal.currentStateDescription}`);

  if (deal.companies.length > 0) {
    lines.push("");
    lines.push("Companies:");
    for (const c of deal.companies) {
      const bits = [
        c.industry ? `industry: ${c.industry}` : null,
        c.size ? `size: ${c.size}` : null,
        c.employeeCount ? `~${c.employeeCount} employees` : null,
        c.revenue ? `revenue: ${c.revenue}` : null,
        c.headquarters ? `HQ: ${c.headquarters}` : null,
      ].filter(Boolean);
      lines.push(
        `- [${COMPANY_ROLE_LABELS[c.role] ?? c.role}] ${c.name}${bits.length ? ` (${bits.join(", ")})` : ""}`
      );
      if (c.description) lines.push(`  ${c.description}`);
    }
  }

  if (deal.itOrgNodes.length > 0) {
    lines.push("");
    lines.push("IT org structure (as provided by the user):");
    for (const n of deal.itOrgNodes) {
      const indent = "  ".repeat(n.level);
      const fn = n.function ? ` (${IT_FUNCTION_LABELS[n.function] ?? n.function})` : "";
      lines.push(`${indent}- [${n.scope}] ${n.title}${n.name ? ` — ${n.name}` : ""}${fn}`);
    }
  }

  return { dealId, text: lines.join("\n") };
}
