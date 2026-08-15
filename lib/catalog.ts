import { prisma } from "@/lib/db";

export function getWorkspaceCategories(dealId: string) {
  return prisma.integrationCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      templates: {
        orderBy: { order: "asc" },
        include: {
          items: { where: { dealId } },
        },
      },
    },
  });
}

export function getCategoryBySlug(dealId: string, slug: string) {
  return prisma.integrationCategory.findUnique({
    where: { slug },
    include: {
      templates: {
        orderBy: { order: "asc" },
        include: { items: { where: { dealId } } },
      },
    },
  });
}

export function getItemByKey(dealId: string, key: string) {
  return prisma.integrationItem.findUnique({
    where: { dealId_itemKey: { dealId, itemKey: key } },
    include: {
      template: { include: { category: true } },
      tasks: { orderBy: { order: "asc" } },
    },
  });
}

export function getAssetInventoryItems(dealId: string) {
  return prisma.assetInventoryItem.findMany({
    where: { dealId },
    orderBy: { createdAt: "asc" },
  });
}
