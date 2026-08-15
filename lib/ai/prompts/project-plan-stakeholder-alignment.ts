import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const projectPlanStakeholderAlignment: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are aligning the IT integration project plan with business stakeholders (not just IT) for an M&A deal. Write in " +
    "markdown with level-2 (`## `) headings, in this order: `## Key Business Stakeholders` (who beyond IT cares about this plan " +
    "and why — Finance, HR, Sales/CX, Operations), `## Alignment Risks` (where the IT timeline could conflict with business " +
    "priorities or the deal thesis), `## Alignment Approach` (how and how often IT syncs with business stakeholders), " +
    "`## Open Decisions Needing Business Input`.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the project plan / business stakeholder alignment narrative for this deal's IT integration.",
};
