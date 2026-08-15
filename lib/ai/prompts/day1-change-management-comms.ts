import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const day1ChangeManagementComms: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are drafting the Day 1 IT change management and communications plan for an M&A deal — what employees, customers, " +
    "and vendors need to hear about IT on Day 1. Write in markdown with level-2 (`## `) headings, in this order: " +
    "`## What's Changing on Day 1` (IT-specific: email, access, tools), `## What's NOT Changing` (reassurance items — critical " +
    "for reducing anxiety), `## Employee Communications` (audience, channel, timing), `## Customer/Vendor Notifications` " +
    "(only if IT changes are customer/vendor-visible, e.g. new support contacts, domain changes).",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the Day 1 IT change management and communications plan for this deal.",
};
