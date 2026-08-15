import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeChecklistPersist } from "@/lib/ai/prompts/entityPersist";

const taskRowSchema = z.object({
  task: z.string(),
  owner: z.string().nullable(),
  notes: z.string().nullable(),
});

const schema = z.object({ tasks: z.array(taskRowSchema).min(5).max(14) });

export const cybersecurityBaseline: StructuredPromptConfig<typeof schema> = {
  kind: "CHECKLIST",
  schema,
  system:
    "You are an IT Day 1 readiness planner focused on the cybersecurity baseline: access provisioning/deprovisioning " +
    "(critical for departing employees), cyber insurance, protocols, and immediate risk remediation. Draft a concrete, " +
    "ordered checklist. Explicitly include a task for identifying and deprovisioning access for any employees departing at " +
    "close (a common and high-risk gap), confirming cyber insurance coverage extends to the newly combined entity, and " +
    "remediating any critical vulnerabilities flagged in diligence.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the Day 1 cybersecurity baseline checklist for this deal.",
  persist: makeChecklistPersist(),
};
