import { z } from "zod";

export const itemTrackingPatchSchema = z.object({
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETE"]).optional(),
  ragStatus: z.enum(["GREEN", "AMBER", "RED"]).optional(),
  owner: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  phase: z.enum(["DAY1", "DAY100", "LONG_TERM", "ONGOING"]).nullable().optional(),
  content: z.object({ markdown: z.string() }).optional(),
});

export type ItemTrackingPatchInput = z.infer<typeof itemTrackingPatchSchema>;
