"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ColumnConfig } from "@/lib/entities/config";

export type RefOption = { value: string; label: string };

type Props = {
  itemKey: string;
  entity: string;
  columns: ColumnConfig[];
  initialRows: Record<string, unknown>[];
  refOptions: Record<string, RefOption[]>;
};

const cellClass = "border-input h-8 w-full min-w-28 rounded-md border bg-transparent px-2 text-xs";

function toDateInputValue(value: unknown): string {
  if (typeof value === "string") return value.slice(0, 10);
  return "";
}

export function GenericTableEditor({ itemKey, entity, columns, initialRows, refOptions }: Props) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [, startTransition] = useTransition();

  async function patchRow(id: string, fields: Record<string, unknown>) {
    const res = await fetch(`/api/deal/entities/${entity}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Failed to update row");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function deleteRow(id: string) {
    const res = await fetch(`/api/deal/entities/${entity}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete row");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function addRow() {
    setIsAdding(true);
    try {
      // Pre-fill required referenceSelect columns with the first available option,
      // since the server can't guess which related row a new entry should point to.
      const prefill: Record<string, unknown> = {};
      for (const col of columns) {
        if (col.type === "referenceSelect" && col.required && col.refEntity) {
          const first = refOptions[col.refEntity]?.[0];
          if (first) prefill[col.key] = first.value;
        }
      }
      const res = await fetch(`/api/deal/entities/${entity}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefill),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "Failed to add row");
        return;
      }
      router.refresh();
    } finally {
      setIsAdding(false);
    }
  }

  async function suggestWithAi() {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/deal/items/${itemKey}/generate`, { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "AI suggestion failed");
        return;
      }
      toast.success(`Added ${body.createdCount} AI-suggested row(s) — review before relying on them`);
      router.refresh();
    } catch {
      toast.error("AI suggestion failed");
    } finally {
      setIsGenerating(false);
    }
  }

  function renderCell(row: Record<string, unknown>, col: ColumnConfig) {
    const id = row.id as string;
    const value = row[col.key];

    if (col.type === "boolean") {
      return (
        <input
          type="checkbox"
          defaultChecked={Boolean(value)}
          onChange={(e) => patchRow(id, { [col.key]: e.target.checked })}
        />
      );
    }

    if (col.type === "select") {
      return (
        <select
          className={cellClass}
          defaultValue={(value as string) ?? ""}
          onChange={(e) => patchRow(id, { [col.key]: e.target.value })}
        >
          {!col.required && <option value="">—</option>}
          {col.options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    }

    if (col.type === "referenceSelect") {
      const options = (col.refEntity && refOptions[col.refEntity]) || [];
      return (
        <select
          className={cellClass}
          defaultValue={(value as string) ?? ""}
          onChange={(e) => patchRow(id, { [col.key]: e.target.value })}
        >
          {!col.required && <option value="">—</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    }

    if (col.type === "date") {
      return (
        <input
          type="date"
          className={cellClass}
          defaultValue={toDateInputValue(value)}
          onBlur={(e) => patchRow(id, { [col.key]: e.target.value || null })}
        />
      );
    }

    if (col.type === "number") {
      return (
        <input
          type="number"
          className={cellClass}
          defaultValue={value === null || value === undefined ? "" : String(value)}
          onBlur={(e) => patchRow(id, { [col.key]: e.target.value === "" ? null : Number(e.target.value) })}
        />
      );
    }

    return (
      <input
        className={cellClass}
        defaultValue={(value as string) ?? ""}
        onBlur={(e) => {
          const current = (value as string) ?? "";
          if (e.target.value !== current) patchRow(id, { [col.key]: e.target.value || null });
        }}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={suggestWithAi} disabled={isGenerating}>
          {isGenerating ? "Suggesting…" : "Suggest rows with AI"}
        </Button>
        <Button type="button" variant="outline" onClick={addRow} disabled={isAdding}>
          {isAdding ? "Adding…" : "+ Add row"}
        </Button>
      </div>

      {initialRows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No rows yet. Suggest a starter list with AI, or add a row manually.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs" style={{ minWidth: `${columns.length * 130}px` }}>
            <thead className="bg-muted/50 text-left">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="p-2 font-medium whitespace-nowrap">{col.label}</th>
                ))}
                <th className="p-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {initialRows.map((row) => (
                <tr key={row.id as string} className="border-t">
                  {columns.map((col) => (
                    <td key={col.key} className="p-1">{renderCell(row, col)}</td>
                  ))}
                  <td className="p-1">
                    <button
                      type="button"
                      onClick={() => deleteRow(row.id as string)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Delete row"
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
