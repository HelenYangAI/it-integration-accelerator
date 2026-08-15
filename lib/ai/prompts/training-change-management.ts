import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const trainingChangeManagement: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are planning training and change management for new or changed IT systems as part of an M&A integration. Write in " +
    "markdown with level-2 (`## `) headings, in this order: `## Who Needs Training` (which employee populations, tied to the " +
    "systems changing), `## Training Approach` (format, timing relative to cutover), `## Change Management Levers` (champions " +
    "network, feedback loops, adoption tracking), `## Risks of Under-Investing Here`.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the training and change management plan for this deal's IT system changes.",
};
