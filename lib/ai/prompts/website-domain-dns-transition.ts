import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeChecklistPersist } from "@/lib/ai/prompts/entityPersist";

const taskRowSchema = z.object({
  task: z.string(),
  owner: z.string().nullable(),
  notes: z.string().nullable(),
});

const schema = z.object({ tasks: z.array(taskRowSchema).min(3).max(10) });

export const websiteDomainDnsTransition: StructuredPromptConfig<typeof schema> = {
  kind: "CHECKLIST",
  schema,
  system:
    "You are an IT integration planner covering website/domain/DNS transition, if applicable to this deal (e.g. rebranding " +
    "the acquired company's site, redirecting domains, consolidating email domains). Draft a concrete, ordered checklist " +
    "covering DNS record inventory, domain ownership/registrar transfer, SSL certificate continuity, redirect strategy, and " +
    "SEO/email-deliverability risk during cutover. If the deal context gives no signal a rebrand or domain change is planned, " +
    "still produce a reasonable checklist assuming domains are kept separate but DNS/email routing needs review.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the website/domain/DNS transition checklist for this deal.",
  persist: makeChecklistPersist(),
};
