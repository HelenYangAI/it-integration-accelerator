import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeEntityPersist } from "@/lib/ai/prompts/entityPersist";

const rowSchema = z.object({
  vendor: z.string(),
  contractName: z.string(),
  overlapFlag: z.boolean().describe("True if this vendor/tool category plausibly exists at both companies (e.g. both likely have a CRM, an MDM, a video conferencing tool)"),
  rationalizationAction: z.enum(["KEEP", "RETIRE", "CONSOLIDATE", "MIGRATE"]),
  annualCost: z.number().nullable(),
});

const schema = z.object({ items: z.array(rowSchema).min(5).max(15) });

export const vendorContractRationalization: StructuredPromptConfig<typeof schema> = {
  kind: "TABLE",
  schema,
  system:
    "You are an IT integration analyst deduping overlapping SaaS/vendor tools between the acquirer and target as part of " +
    "Org & Change Management planning. Propose the vendor/SaaS categories most likely to be duplicated across both companies " +
    "(collaboration tools, CRM, HRIS, MDM/endpoint management, ITSM, video conferencing, etc.) based on the industry and " +
    "company sizes in context, flag them as overlapping, and recommend a rationalization action for each.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft a starter vendor/contract rationalization list focused on overlapping SaaS tools for this deal.",
  persist: makeEntityPersist("ContractLicenseItem", (r: z.infer<typeof rowSchema>) => ({
    vendor: r.vendor,
    contractName: r.contractName,
    overlapFlag: r.overlapFlag,
    rationalizationAction: r.rationalizationAction,
    annualCost: r.annualCost,
  })),
};
