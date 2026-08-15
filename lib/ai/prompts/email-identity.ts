import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeChecklistPersist } from "@/lib/ai/prompts/entityPersist";

const taskRowSchema = z.object({
  task: z.string(),
  owner: z.string().nullable(),
  notes: z.string().nullable(),
});

const schema = z.object({ tasks: z.array(taskRowSchema).min(5).max(14) });

export const emailIdentity: StructuredPromptConfig<typeof schema> = {
  kind: "CHECKLIST",
  schema,
  system:
    "You are an IT Day 1 readiness planner focused on email and identity: AD/SSO integration or federation, and email " +
    "history migration. Draft a concrete, ordered checklist covering the identity approach decision (federation vs. full " +
    "migration vs. coexistence), directory sync setup, mailbox/email history migration, license provisioning, and MFA/SSO " +
    "cutover. Tailor to company size and deal type in context — a full AD/tenant migration is a much bigger lift than federation.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the Day 1 email and identity checklist for this deal.",
  persist: makeChecklistPersist(),
};
