import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeEntityPersist } from "@/lib/ai/prompts/entityPersist";

const rowSchema = z.object({
  runbookName: z.string().describe("Which cutover/migration this step belongs to, e.g. 'Email/Identity Cutover', 'ERP Cutover'"),
  stepOrder: z.number(),
  description: z.string(),
  owner: z.string().nullable(),
  rollbackPlan: z.string().nullable(),
});

const schema = z.object({ items: z.array(rowSchema).min(8).max(20) });

export const cutoverRunbooks: StructuredPromptConfig<typeof schema> = {
  kind: "TABLE",
  schema,
  system:
    "You are an IT integration cutover planner. Draft go-live runbook steps for the most likely major migrations implied by " +
    "the deal context (typically: Email/Identity cutover, and one or two of ERP/CRM/Infrastructure cutover depending on what's " +
    "mentioned). Produce a properly ordered, numbered sequence of concrete steps per runbook (pre-checks, execution, " +
    "validation, go/no-go, rollback trigger), with a rollback plan noted for the riskiest steps. Group steps under the correct " +
    "`runbookName` so multiple runbooks can be told apart, and number `stepOrder` starting at 1 within each runbook.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft cutover/go-live runbook steps for this deal's likely major migrations.",
  persist: makeEntityPersist("RunbookStep", (r: z.infer<typeof rowSchema>) => ({
    runbookName: r.runbookName,
    stepOrder: r.stepOrder,
    description: r.description,
    owner: r.owner,
    rollbackPlan: r.rollbackPlan,
    status: "NOT_STARTED",
  })),
};
