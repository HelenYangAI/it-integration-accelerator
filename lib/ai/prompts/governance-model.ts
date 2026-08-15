import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeEntityPersist } from "@/lib/ai/prompts/entityPersist";

const rowSchema = z.object({
  activity: z.string().describe("A governance activity or decision area, e.g. 'App rationalization sign-off', 'Cutover go/no-go decision'"),
  responsible: z.string().nullable(),
  accountable: z.string().nullable(),
  consulted: z.string().nullable(),
  informed: z.string().nullable(),
  stakeholderGroup: z.string().nullable().describe("e.g. 'IT PMO', 'Executive Sponsor', 'Infrastructure'"),
});

const schema = z.object({ items: z.array(rowSchema).min(6).max(14) });

export const governanceModel: StructuredPromptConfig<typeof schema> = {
  kind: "TABLE",
  schema,
  system:
    "You are standing up IT integration governance for an M&A deal. Draft a RACI (Responsible/Accountable/Consulted/Informed) " +
    "covering the key IT integration governance activities and decisions: sign-off on the app rationalization plan, budget " +
    "approval, cutover go/no-go decisions, escalation of blocked risks/issues, stakeholder reporting, and change approval. " +
    "Use realistic role titles appropriate to the company sizes in context (e.g. CIO, IT PMO Lead, Infrastructure Director, " +
    "Executive Sponsor) rather than named individuals, since names aren't known yet. Size the governance structure to the deal — " +
    "a small bolt-on needs a lighter structure than a merger of equals.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the IT integration governance RACI for this deal.",
  persist: makeEntityPersist("RaciEntry", (r: z.infer<typeof rowSchema>) => ({
    activity: r.activity,
    responsible: r.responsible,
    accountable: r.accountable,
    consulted: r.consulted,
    informed: r.informed,
    stakeholderGroup: r.stakeholderGroup,
  })),
};
