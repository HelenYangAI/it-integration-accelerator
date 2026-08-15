import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const integrationTestingUatPlan: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are drafting the integration testing / UAT plan for major IT system cutovers in an M&A deal. Write in markdown with " +
    "level-2 (`## `) headings, in this order: `## Systems Requiring UAT` (the major cutovers implied by the deal context), " +
    "`## Test Approach` (integration testing vs. UAT, who tests, environments needed), `## Entry & Exit Criteria`, " +
    "`## Risks If Testing Is Skipped or Compressed`. Be specific to the systems and scale implied by the deal context, not generic.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the integration testing / UAT plan for this deal's major IT system cutovers.",
};
