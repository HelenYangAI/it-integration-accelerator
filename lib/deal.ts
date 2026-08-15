import { prisma } from "@/lib/db";
import type { DealIntakeInput } from "@/lib/schemas/deal";

export function getActiveDeal() {
  return prisma.deal.findFirst({
    include: { companies: true, itOrgNodes: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function createDeal(input: DealIntakeInput) {
  const existing = await prisma.deal.findFirst();
  if (existing) {
    throw new Error("A deal already exists. This is a single-deal workspace for v1.");
  }

  return prisma.$transaction(async (tx) => {
    const deal = await tx.deal.create({
      data: {
        name: input.name,
        dealType: input.dealType,
        industry: input.industry,
        dealThesis: input.dealThesis,
        shortTermGoals: input.shortTermGoals,
        longTermGoals: input.longTermGoals,
        currentStateDescription: input.currentStateDescription,
        companies: {
          create: input.companies.map((c) => ({
            role: c.role,
            name: c.name,
            size: c.size || null,
            revenue: c.revenue || null,
            employeeCount: c.employeeCount ? parseInt(c.employeeCount, 10) : null,
            industry: c.industry || null,
            description: c.description || null,
            headquarters: c.headquarters || null,
          })),
        },
      },
    });

    // IT org nodes form a tree via client-generated ids; create parents before
    // children since Prisma can't reference a not-yet-created row's real id.
    const remaining = [...input.itOrgNodes];
    const realIdByClientId = new Map<string, string>();
    const levelByClientId = new Map<string, number>();
    let guard = 0;
    while (remaining.length > 0) {
      guard += 1;
      if (guard > 1000) {
        throw new Error("IT org chart has a cycle or an unresolved parent reference");
      }
      const idx = remaining.findIndex(
        (n) => !n.parentClientId || realIdByClientId.has(n.parentClientId)
      );
      if (idx === -1) {
        throw new Error("IT org chart has a cycle or an unresolved parent reference");
      }
      const node = remaining.splice(idx, 1)[0];
      const level = node.parentClientId ? (levelByClientId.get(node.parentClientId) ?? 0) + 1 : 0;
      const created = await tx.itOrgNode.create({
        data: {
          dealId: deal.id,
          scope: node.scope,
          parentId: node.parentClientId ? realIdByClientId.get(node.parentClientId)! : null,
          title: node.title,
          name: node.name || null,
          function: node.function || null,
          level,
          notes: node.notes || null,
        },
      });
      realIdByClientId.set(node.clientId, created.id);
      levelByClientId.set(node.clientId, level);
    }

    const templates = await tx.itemTemplate.findMany({ select: { key: true } });
    await tx.integrationItem.createMany({
      data: templates.map((t) => ({ dealId: deal.id, itemKey: t.key })),
    });

    return deal.id;
  });
}
