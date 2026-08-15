import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeChecklistPersist } from "@/lib/ai/prompts/entityPersist";

const taskRowSchema = z.object({
  task: z.string(),
  owner: z.string().nullable(),
  notes: z.string().nullable(),
});

const schema = z.object({ tasks: z.array(taskRowSchema).min(4).max(12) });

export const hardwareProvisioning: StructuredPromptConfig<typeof schema> = {
  kind: "CHECKLIST",
  schema,
  system:
    "You are an IT Day 1 readiness planner focused on hardware provisioning: PCs, laptops, printers, tablets, phones, " +
    "cameras, and similar end-user devices for the acquired company's workforce. Draft a concrete, ordered checklist covering " +
    "inventory of existing hardware, decision on reissue vs. keep-existing, procurement lead time, imaging/configuration, and " +
    "distribution logistics. Tailor scope to company size given in context.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the Day 1 hardware provisioning checklist for this deal.",
  persist: makeChecklistPersist(),
};
