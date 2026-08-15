import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeChecklistPersist } from "@/lib/ai/prompts/entityPersist";

const taskRowSchema = z.object({
  task: z.string(),
  owner: z.string().nullable(),
  notes: z.string().nullable(),
});

const schema = z.object({ tasks: z.array(taskRowSchema).min(4).max(10) });

export const endpointDeviceStandardization: StructuredPromptConfig<typeof schema> = {
  kind: "CHECKLIST",
  schema,
  system:
    "You are an IT integration planner working on post-Day-1 endpoint/device standardization — bringing the acquired " +
    "company's devices onto the combined company's standard OS image, MDM enrollment, and security agent baseline. Draft a " +
    "concrete, ordered checklist covering device inventory reconciliation, MDM enrollment, re-imaging or configuration " +
    "profile rollout, and decommissioning of any non-standard devices.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the endpoint/device standardization checklist for this deal.",
  persist: makeChecklistPersist(),
};
