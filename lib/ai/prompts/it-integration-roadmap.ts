import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeEntityPersist, toDateOrUndefined } from "@/lib/ai/prompts/entityPersist";

const rowSchema = z.object({
  title: z.string(),
  tag: z.string().nullable().describe("Short workstream tag, e.g. 'Infrastructure', 'Applications', 'Security'"),
  phase: z.enum(["DAY1", "DAY100", "LONG_TERM"]),
  dueDate: z.string().nullable().describe("ISO date, approximate is fine"),
});

const schema = z.object({ items: z.array(rowSchema).min(8).max(20) });

export const itIntegrationRoadmap: StructuredPromptConfig<typeof schema> = {
  kind: "TABLE",
  schema,
  system:
    "You are an IT integration program manager building the master IT Integration Roadmap for an M&A deal — the single " +
    "timeline spanning Day 1 must-haves, Day 100 milestones, and long-term (12-24 month) integration work. Draft a realistic " +
    "set of milestones spanning all three phases (include several of each), tailored to deal type and company size. Give each " +
    "milestone an approximate due date relative to close (assume close is today) and a short workstream tag.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the IT integration roadmap milestones for this deal.",
  persist: makeEntityPersist("Milestone", (r: z.infer<typeof rowSchema>) => ({
    title: r.title,
    tag: r.tag,
    phase: r.phase,
    dueDate: toDateOrUndefined(r.dueDate),
  })),
};
