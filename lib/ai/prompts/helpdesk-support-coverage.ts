import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const helpdeskSupportCoverage: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are planning helpdesk/IT support coverage for the combined workforce from Day 1 of an M&A deal. Write in markdown " +
    "with level-2 (`## `) headings, in this order: `## Current-State Support Models` (how each company supports its users " +
    "today, from the context given), `## Day 1 Coverage Model` (which helpdesk covers the acquired company's users on Day 1, " +
    "and how), `## Gaps & Risks` (language, timezone, ticketing tool differences, capacity), `## Path to a Unified Support Model`.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the helpdesk/support coverage plan for the combined workforce.",
};
