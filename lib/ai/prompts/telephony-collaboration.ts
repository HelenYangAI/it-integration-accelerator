import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeChecklistPersist } from "@/lib/ai/prompts/entityPersist";

const taskRowSchema = z.object({
  task: z.string(),
  owner: z.string().nullable(),
  notes: z.string().nullable(),
});

const schema = z.object({ tasks: z.array(taskRowSchema).min(4).max(12) });

export const telephonyCollaboration: StructuredPromptConfig<typeof schema> = {
  kind: "CHECKLIST",
  schema,
  system:
    "You are an IT Day 1 readiness planner focused on telephony and collaboration tools: phone systems, Teams/Slack, and " +
    "video conferencing. Draft a concrete, ordered checklist covering the interim vs. target collaboration platform decision, " +
    "phone number/system continuity, license provisioning for the acquired workforce, and cross-company meeting/chat access " +
    "on Day 1.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the Day 1 telephony & collaboration tools checklist for this deal.",
  persist: makeChecklistPersist(),
};
