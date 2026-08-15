import { z } from "zod";
import { prisma } from "@/lib/db";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";

const rowSchema = z.object({
  assetName: z.string().describe("Must exactly match one of the asset names listed in the prompt"),
  recommendation: z.enum(["KEEP", "RETIRE", "CONSOLIDATE", "MIGRATE"]),
  rationale: z.string(),
  confidence: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable(),
});

const schema = z.object({ items: z.array(rowSchema) });

export const appRationalizationPlan: StructuredPromptConfig<typeof schema> = {
  kind: "TABLE",
  schema,
  system:
    "You are an IT integration analyst producing an Application Rationalization Plan (keep/retire/consolidate/migrate) " +
    "for an M&A deal. You will be given a list of assets already captured in the Application & Infrastructure Inventory, each " +
    "with its type, owning company, and (where known) criticality. For each asset, recommend KEEP (leave as-is), RETIRE " +
    "(decommission with no replacement), CONSOLIDATE (merge into the equivalent system at the other company), or MIGRATE " +
    "(move to a new platform). Base your call on: obvious duplication between the two companies' stacks, criticality, and the " +
    "deal thesis. Give a one-sentence rationale per asset. Use the `assetName` values exactly as given — do not invent assets.",
  buildPrompt: async (context) => {
    const assets = await prisma.assetInventoryItem.findMany({ where: { dealId: context.dealId } });
    if (assets.length === 0) {
      return (
        `Here is the deal context:\n\n${context.text}\n\n` +
        "No assets have been captured in the Application & Infrastructure Inventory yet — respond with an empty items array."
      );
    }
    const assetList = assets
      .map((a) => `- ${a.name} [${a.assetType}, ${a.companySource}${a.criticality ? `, criticality: ${a.criticality}` : ""}]`)
      .join("\n");
    return (
      `Here is the deal context:\n\n${context.text}\n\n` +
      `Here are the assets currently in the inventory:\n${assetList}\n\n` +
      "Recommend keep/retire/consolidate/migrate for each asset above."
    );
  },
  persist: async ({ dealId, output }) => {
    const assets = await prisma.assetInventoryItem.findMany({ where: { dealId } });
    const byName = new Map(assets.map((a) => [a.name.toLowerCase().trim(), a]));
    const existing = await prisma.rationalizationItem.findMany({
      where: { dealId },
      select: { assetInventoryItemId: true },
    });
    const alreadyRationalized = new Set(existing.map((r) => r.assetInventoryItemId));

    let createdCount = 0;
    for (const row of output.items) {
      const asset = byName.get(row.assetName.toLowerCase().trim());
      if (!asset || alreadyRationalized.has(asset.id)) continue;
      await prisma.rationalizationItem.create({
        data: {
          dealId,
          assetInventoryItemId: asset.id,
          recommendation: row.recommendation,
          rationale: row.rationale,
          confidence: row.confidence,
        },
      });
      alreadyRationalized.add(asset.id);
      createdCount += 1;
    }
    return { createdCount };
  },
};
