import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeEntityPersist } from "@/lib/ai/prompts/entityPersist";

const rowSchema = z.object({
  vendor: z.string(),
  contractName: z.string(),
  rationalizationAction: z.enum(["KEEP", "RETIRE", "CONSOLIDATE", "MIGRATE"]),
  annualCost: z.number().nullable(),
  renewalDate: z.string().nullable().describe("ISO date, approximate is fine"),
});

const schema = z.object({ items: z.array(rowSchema).min(5).max(15) });

export const licenseReconciliationContractConsolidation: StructuredPromptConfig<typeof schema> = {
  kind: "TABLE",
  schema,
  system:
    "You are an IT integration analyst doing post-Day-1 software license reconciliation and vendor contract consolidation — " +
    "the execution-phase follow-through on rationalization decisions made earlier. Propose realistic license/contract line items " +
    "that would need reconciling once systems actually start consolidating (seat count true-ups after user overlap is removed, " +
    "combining two vendor agreements into one at better volume pricing, letting duplicate contracts lapse at renewal). Include a " +
    "renewal date where plausible so timing can be tracked.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the license reconciliation & contract consolidation line items for this deal.",
  persist: makeEntityPersist("ContractLicenseItem", (r: z.infer<typeof rowSchema>) => ({
    vendor: r.vendor,
    contractName: r.contractName,
    rationalizationAction: r.rationalizationAction,
    annualCost: r.annualCost,
    renewalDate: r.renewalDate ? new Date(r.renewalDate) : undefined,
  })),
};
