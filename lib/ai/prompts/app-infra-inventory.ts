import { z } from "zod";
import { prisma } from "@/lib/db";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";

const assetRowSchema = z.object({
  assetType: z.enum(["APP", "SERVER", "DATACENTER", "CLOUD_SERVICE", "NETWORK"]),
  name: z.string(),
  owner: z.string().nullable().describe("Likely owning team or role, if inferable"),
  businessUnit: z.string().nullable(),
  criticality: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).nullable(),
  companySource: z
    .enum(["ACQUIRER", "TARGET"])
    .describe("Which of the two companies this asset most plausibly belongs to"),
  dataSensitivity: z.enum(["LOW", "MEDIUM", "HIGH", "RESTRICTED"]).nullable(),
  notes: z
    .string()
    .nullable()
    .describe("One sentence noting this is an AI-suggested placeholder to validate, not confirmed data"),
});

const schema = z.object({
  items: z.array(assetRowSchema).min(6).max(18),
});

export const appInfraInventory: StructuredPromptConfig<typeof schema> = {
  kind: "TABLE",
  schema,
  system:
    "You are an IT integration analyst building a starter Application & Infrastructure Inventory for an M&A deal, " +
    "before either company's real inventory export has been collected. Your job is to propose a realistic, industry-appropriate " +
    "draft list of applications and infrastructure assets likely to exist at each company, purely so the user has something " +
    "concrete to correct and validate against — not a source of truth. Cover a mix of asset types (APP, SERVER, DATACENTER, " +
    "CLOUD_SERVICE, NETWORK) and include assets for both companies. Keep the list to a manageable size. " +
    "Always note in the `notes` field that the row is an AI-suggested placeholder pending validation.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Propose a starter application & infrastructure inventory for this deal.",
  persist: async ({ dealId, output }) => {
    const rows = output.items;
    await prisma.assetInventoryItem.createMany({
      data: rows.map((r) => ({
        dealId,
        assetType: r.assetType,
        name: r.name,
        owner: r.owner,
        businessUnit: r.businessUnit,
        criticality: r.criticality,
        companySource: r.companySource,
        dataSensitivity: r.dataSensitivity,
        notes: r.notes,
      })),
    });
    return { createdCount: rows.length };
  },
};
