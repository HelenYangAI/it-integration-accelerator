import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeEntityPersist } from "@/lib/ai/prompts/entityPersist";

const rowSchema = z.object({
  service: z.string().describe("The specific IT service the seller/acquirer needs to provide on an interim basis, e.g. 'ERP hosting', 'Email/identity', 'Network access'"),
  provider: z.string().nullable().describe("Who provides it during the interim period, e.g. 'Seller IT'"),
  monthlyCost: z.number().nullable(),
  exitCriteria: z.string().nullable().describe("What needs to be true for the acquirer to exit this TSA service"),
});

const schema = z.object({ items: z.array(rowSchema).min(3).max(10) });

export const tsaRequirements: StructuredPromptConfig<typeof schema> = {
  kind: "TABLE",
  schema,
  system:
    "You are an IT integration analyst identifying Transition Services Agreement (TSA) requirements — interim IT services the " +
    "seller needs to keep providing to the acquired business after close, until the acquirer stands up its own capability. " +
    "Based on the deal type and current-state description, propose realistic TSA services if the deal structure suggests the " +
    "seller retains systems the target still depends on (common in carve-outs; less common in tuck-ins where the target already " +
    "has its own full stack). If the deal type and current state make a TSA unlikely to be needed, return a small number of " +
    "plausible items anyway with a clear exit criteria, or return an empty list if genuinely not applicable — do not force items.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the TSA requirements for this deal, if any are needed.",
  persist: makeEntityPersist("TsaRequirement", (r: z.infer<typeof rowSchema>) => ({
    service: r.service,
    provider: r.provider,
    monthlyCost: r.monthlyCost,
    exitCriteria: r.exitCriteria,
    status: "PLANNED",
  })),
};
