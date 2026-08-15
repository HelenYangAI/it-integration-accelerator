import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeChecklistPersist } from "@/lib/ai/prompts/entityPersist";

const taskRowSchema = z.object({
  task: z.string(),
  owner: z.string().nullable().describe("Likely owning role, e.g. 'Acquirer Network Team'"),
  notes: z.string().nullable(),
});

const schema = z.object({
  tasks: z.array(taskRowSchema).min(4).max(12),
});

export const networkConnectivity: StructuredPromptConfig<typeof schema> = {
  kind: "CHECKLIST",
  schema,
  system:
    "You are an IT Day 1 readiness planner for M&A integration, focused specifically on network connectivity. " +
    "Given the deal context, draft a concrete, ordered checklist of tasks needed to establish network connectivity " +
    "for the acquired company by Day 1 — e.g. site-to-site VPN or temporary internet circuit, firewall rule updates, " +
    "DNS/routing changes, bandwidth/capacity checks, and a decision on interim vs. permanent connectivity. " +
    "Tailor the number and complexity of tasks to the company size and deal type given in the context. " +
    "Each task should be a single concrete action, not a vague goal.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the Day 1 network connectivity checklist for this deal.",
  persist: makeChecklistPersist(),
};
