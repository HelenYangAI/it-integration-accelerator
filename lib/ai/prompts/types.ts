import type { z } from "zod";
import type { DealContext } from "@/lib/ai/context-builder";

type BasePromptConfig = {
  system: string;
  /** Async so a prompt can pull in its own prerequisite data (e.g. Rationalization needs existing AssetInventoryItem rows). */
  buildPrompt: (context: DealContext) => string | Promise<string>;
};

export type NarrativePromptConfig = BasePromptConfig & {
  kind: "NARRATIVE";
};

export type StructuredPromptConfig<Schema extends z.ZodTypeAny = z.ZodTypeAny> =
  BasePromptConfig & {
    kind: "TABLE" | "CHECKLIST";
    schema: Schema;
    /** Persists the validated model output for this item and reports how many rows were created. */
    persist: (params: {
      dealId: string;
      itemId: string;
      output: z.infer<Schema>;
    }) => Promise<{ createdCount: number }>;
  };

export type PromptConfig = NarrativePromptConfig | StructuredPromptConfig;
