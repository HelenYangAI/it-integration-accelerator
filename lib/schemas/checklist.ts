import { z } from "zod";

export const checklistTaskCreateSchema = z.object({
  task: z.string().min(1),
  owner: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const checklistTaskUpdateSchema = z.object({
  task: z.string().min(1).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE", "BLOCKED"]).optional(),
  owner: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});
