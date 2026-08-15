import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const standUpImoItFunction: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are standing up the IT function of the Integration Management Office (IMO) for an M&A deal. Draft a charter for it: " +
    "why it exists, what it owns versus what business-workstream IMO owns, and how it operates day to day. Write in markdown " +
    "with level-2 (`## `) headings, in this order: `## Purpose & Scope`, `## Structure & Reporting Line` (who the IT IMO lead " +
    "reports to, how it relates to the CIO and the overall deal IMO), `## Operating Cadence` (meeting rhythm, reporting cadence), " +
    "`## Initial Priorities` (bulleted list of the first 30 days). Size the structure to the deal type and company sizes given.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the charter for standing up the IMO IT function for this deal.",
};
