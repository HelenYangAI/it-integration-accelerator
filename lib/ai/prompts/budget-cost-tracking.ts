import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeEntityPersist } from "@/lib/ai/prompts/entityPersist";

const rowSchema = z.object({
  category: z.string().describe("e.g. 'Infrastructure migration', 'License true-up', 'Contractor labor', 'Security tooling'"),
  description: z.string(),
  estimatedCost: z.number(),
  costType: z.enum(["CAPEX", "OPEX"]),
  timing: z.enum(["ONE_TIME", "RUN_RATE"]),
  phase: z.enum(["DAY1", "DAY100", "LONG_TERM", "ONGOING"]).nullable(),
});

const schema = z.object({ items: z.array(rowSchema).min(6).max(16) });

export const budgetCostTracking: StructuredPromptConfig<typeof schema> = {
  kind: "TABLE",
  schema,
  system:
    "You are an IT integration budget analyst. Draft a starter IT integration budget/cost-tracking sheet: line items covering " +
    "Day 1 stabilization costs, Day 100 quick wins, and longer-term integration work, split across capex vs. opex and one-time " +
    "vs. run-rate. Include realistic categories (network/VPN setup, hardware provisioning, license consolidation/true-up, " +
    "contractor/migration labor, security tooling, cloud migration, decommissioning). Scale amounts to the company sizes given " +
    "in context — this is a planning estimate, not a final budget.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the IT integration budget & cost tracking line items for this deal.",
  persist: makeEntityPersist("BudgetLineItem", (r: z.infer<typeof rowSchema>) => ({
    category: r.category,
    description: r.description,
    estimatedCost: r.estimatedCost,
    costType: r.costType,
    timing: r.timing,
    phase: r.phase,
  })),
};
