import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeEntityPersist } from "@/lib/ai/prompts/entityPersist";

const rowSchema = z.object({
  category: z.enum(["LICENSE_CONSOLIDATION", "INFRA_CONSOLIDATION", "CONTRACT_RENEGOTIATION", "HEADCOUNT_OVERLAP", "OTHER"]),
  description: z.string(),
  annualValue: z.number().nullable().describe("Estimated annual synergy value in USD"),
  oneTimeCostToAchieve: z.number().nullable().describe("Estimated one-time cost in USD to realize this synergy"),
  realizationYear: z.number().nullable().describe("Year 1, 2, or 3 post-close when this is expected to be fully realized"),
  rationale: z.string().nullable(),
});

const schema = z.object({ items: z.array(rowSchema).min(5).max(12) });

export const budgetSynergyCostToAchieve: StructuredPromptConfig<typeof schema> = {
  kind: "TABLE",
  schema,
  system:
    "You are an IT integration finance analyst estimating IT cost synergies and their cost-to-achieve for an M&A deal. " +
    "IT synergies are almost always cost synergies (not revenue): license consolidation, infrastructure/datacenter consolidation, " +
    "vendor contract renegotiation from combined scale, and IT headcount overlap. For each synergy, estimate a plausible annual " +
    "value and the one-time cost required to achieve it (migration labor, dual-running costs, contract exit fees), given the " +
    "company sizes and deal type in context. Mark realistic realization timing — most IT synergies take 1-2 years, not immediate. " +
    "Every estimate starts as NOT_VALIDATED until the workstream confirms it.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the IT synergy list and cost-to-achieve estimate for this deal.",
  persist: makeEntityPersist("SynergyItem", (r: z.infer<typeof rowSchema>) => ({
    category: r.category,
    description: r.description,
    annualValue: r.annualValue,
    oneTimeCostToAchieve: r.oneTimeCostToAchieve,
    realizationYear: r.realizationYear,
    rationale: r.rationale,
    validationStatus: "NOT_VALIDATED",
  })),
};
