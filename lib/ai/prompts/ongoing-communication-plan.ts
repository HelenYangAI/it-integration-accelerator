import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const ongoingCommunicationPlan: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are drafting the ongoing (post-Day-1) IT communication plan for major cutover milestones through the rest of the " +
    "integration. Write in markdown with level-2 (`## `) headings, in this order: `## Communication Principles` (cadence, tone, " +
    "who communicates), `## Milestone Communication Map` (which upcoming cutovers need advance comms and to whom), " +
    "`## Channels & Owners`, `## Feedback Loop` (how employees raise issues with changes as they roll out).",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the ongoing communication plan for major post-Day-1 IT cutover milestones.",
};
