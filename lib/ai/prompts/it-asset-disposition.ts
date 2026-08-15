import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeChecklistPersist } from "@/lib/ai/prompts/entityPersist";

const taskRowSchema = z.object({
  task: z.string(),
  owner: z.string().nullable(),
  notes: z.string().nullable(),
});

const schema = z.object({ tasks: z.array(taskRowSchema).min(3).max(8) });

export const itAssetDisposition: StructuredPromptConfig<typeof schema> = {
  kind: "CHECKLIST",
  schema,
  system:
    "You are an IT integration planner covering IT asset disposition — secure data wipe/destruction for decommissioned " +
    "hardware once systems are consolidated. Draft a concrete, ordered checklist covering secure data wipe standards (e.g. " +
    "NIST 800-88), certificate of destruction/chain of custody, and environmentally compliant disposal, appropriate to the " +
    "data sensitivity implied by the industry in context.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the IT asset disposition checklist for this deal.",
  persist: makeChecklistPersist(),
};
