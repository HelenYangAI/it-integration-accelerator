"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TASK_STATUS_LABELS } from "@/lib/labels";

export type ChecklistTaskRow = {
  id: string;
  task: string;
  status: string;
  owner: string | null;
  dueDate: string | null;
  notes: string | null;
};

type Props = {
  itemKey: string;
  initialTasks: ChecklistTaskRow[];
};

const inputClass = "border-input h-8 w-full rounded-md border bg-transparent px-2 text-xs";
const selectClass = inputClass;

export function ChecklistEditor({ itemKey, initialTasks }: Props) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [, startTransition] = useTransition();

  async function patchTask(taskId: string, fields: Record<string, unknown>) {
    const res = await fetch(`/api/deal/items/${itemKey}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) {
      toast.error("Failed to update task");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function deleteTask(taskId: string) {
    const res = await fetch(`/api/deal/items/${itemKey}/tasks/${taskId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete task");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function addTask() {
    setIsAdding(true);
    try {
      const res = await fetch(`/api/deal/items/${itemKey}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "New task" }),
      });
      if (!res.ok) {
        toast.error("Failed to add task");
        return;
      }
      router.refresh();
    } finally {
      setIsAdding(false);
    }
  }

  async function draftWithAi() {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/deal/items/${itemKey}/generate`, { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "AI drafting failed");
        return;
      }
      toast.success(`Added ${body.createdCount} AI-drafted task(s)`);
      router.refresh();
    } catch {
      toast.error("AI drafting failed");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={draftWithAi} disabled={isGenerating}>
          {isGenerating ? "Drafting…" : "Draft tasks with AI"}
        </Button>
        <Button type="button" variant="outline" onClick={addTask} disabled={isAdding}>
          {isAdding ? "Adding…" : "+ Add task"}
        </Button>
      </div>

      {initialTasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tasks yet. Draft a starter checklist with AI, or add tasks manually.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[640px] text-xs">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-2 font-medium">Task</th>
                <th className="p-2 font-medium">Status</th>
                <th className="p-2 font-medium">Owner</th>
                <th className="p-2 font-medium">Due date</th>
                <th className="p-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {initialTasks.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-1">
                    <input
                      className={inputClass}
                      defaultValue={t.task}
                      onBlur={(e) => e.target.value !== t.task && patchTask(t.id, { task: e.target.value })}
                    />
                  </td>
                  <td className="p-1">
                    <select
                      className={selectClass}
                      defaultValue={t.status}
                      onChange={(e) => patchTask(t.id, { status: e.target.value })}
                    >
                      {Object.entries(TASK_STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-1">
                    <input
                      className={inputClass}
                      defaultValue={t.owner ?? ""}
                      onBlur={(e) => e.target.value !== (t.owner ?? "") && patchTask(t.id, { owner: e.target.value || null })}
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="date"
                      className={inputClass}
                      defaultValue={t.dueDate ? t.dueDate.slice(0, 10) : ""}
                      onBlur={(e) => patchTask(t.id, { dueDate: e.target.value || null })}
                    />
                  </td>
                  <td className="p-1">
                    <button
                      type="button"
                      onClick={() => deleteTask(t.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Delete task"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
