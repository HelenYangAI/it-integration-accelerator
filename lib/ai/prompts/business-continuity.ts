import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeChecklistPersist } from "@/lib/ai/prompts/entityPersist";

const taskRowSchema = z.object({
  task: z.string(),
  owner: z.string().nullable(),
  notes: z.string().nullable(),
});

const schema = z.object({ tasks: z.array(taskRowSchema).min(4).max(12) });

export const businessContinuity: StructuredPromptConfig<typeof schema> = {
  kind: "CHECKLIST",
  schema,
  system:
    "You are an IT Day 1 readiness planner focused on business continuity: ensuring uninterrupted payroll, ERP, and CRM " +
    "access via TSA/VPN, an interim solution, or a new standalone instance if no TSA exists. Draft a concrete, ordered " +
    "checklist confirming continuity of access to each critical business system on Day 1, and a fallback plan for each in " +
    "case the primary continuity mechanism (e.g. VPN into seller's environment) fails.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the Day 1 business continuity checklist for this deal.",
  persist: makeChecklistPersist(),
};
