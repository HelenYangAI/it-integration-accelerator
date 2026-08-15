"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ITEM_STATUS_LABELS,
  RAG_STATUS_LABELS,
  ITEM_PHASE_LABELS,
} from "@/lib/labels";

type Props = {
  itemKey: string;
  status: string;
  ragStatus: string;
  owner: string | null;
  dueDate: string | null;
  phase: string | null;
};

export function ItemTrackingControls({
  itemKey,
  status,
  ragStatus,
  owner,
  dueDate,
  phase,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [ownerValue, setOwnerValue] = useState(owner ?? "");

  async function patch(fields: Record<string, unknown>) {
    const res = await fetch(`/api/deal/items/${itemKey}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) {
      toast.error("Failed to update item");
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          className="border-input mt-1 h-9 w-full rounded-md border bg-transparent px-3 text-sm"
          defaultValue={status}
          disabled={isPending}
          onChange={(e) => patch({ status: e.target.value })}
        >
          {Object.entries(ITEM_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="rag">RAG</Label>
        <select
          id="rag"
          className="border-input mt-1 h-9 w-full rounded-md border bg-transparent px-3 text-sm"
          defaultValue={ragStatus}
          disabled={isPending}
          onChange={(e) => patch({ ragStatus: e.target.value })}
        >
          {Object.entries(RAG_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="phase">Phase</Label>
        <select
          id="phase"
          className="border-input mt-1 h-9 w-full rounded-md border bg-transparent px-3 text-sm"
          defaultValue={phase ?? ""}
          disabled={isPending}
          onChange={(e) => patch({ phase: e.target.value || null })}
        >
          <option value="">—</option>
          {Object.entries(ITEM_PHASE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="dueDate">Due date</Label>
        <Input
          id="dueDate"
          type="date"
          className="mt-1"
          disabled={isPending}
          defaultValue={dueDate ? dueDate.slice(0, 10) : ""}
          onBlur={(e) => patch({ dueDate: e.target.value || null })}
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="owner">Owner</Label>
        <Input
          id="owner"
          className="mt-1"
          disabled={isPending}
          value={ownerValue}
          onChange={(e) => setOwnerValue(e.target.value)}
          onBlur={(e) => patch({ owner: e.target.value || null })}
        />
      </div>
    </div>
  );
}
