"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ASSET_TYPE_LABELS,
  CRITICALITY_LABELS,
  DATA_SENSITIVITY_LABELS,
  COMPANY_ROLE_LABELS,
} from "@/lib/labels";
import { AssetInventoryImportDialog } from "@/components/items/asset-inventory-import-dialog";

export type AssetInventoryRow = {
  id: string;
  assetType: string;
  name: string;
  owner: string | null;
  businessUnit: string | null;
  users: number | null;
  annualCost: number | null;
  criticality: string | null;
  dataSensitivity: string | null;
  companySource: string;
  notes: string | null;
};

type Props = {
  itemKey: string;
  initialItems: AssetInventoryRow[];
};

const selectClass =
  "border-input h-8 w-full rounded-md border bg-transparent px-2 text-xs";
const inputClass = "border-input h-8 w-full rounded-md border bg-transparent px-2 text-xs";

export function AssetInventoryTable({ itemKey, initialItems }: Props) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [, startTransition] = useTransition();

  async function patchRow(id: string, fields: Record<string, unknown>) {
    const res = await fetch(`/api/deal/asset-inventory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) {
      toast.error("Failed to update row");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function deleteRow(id: string) {
    const res = await fetch(`/api/deal/asset-inventory/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete row");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function addRow() {
    setIsAdding(true);
    try {
      const res = await fetch("/api/deal/asset-inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetType: "APP",
          name: "New asset",
          companySource: "ACQUIRER",
        }),
      });
      if (!res.ok) {
        toast.error("Failed to add row");
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

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={suggestWithAi} disabled={isGenerating}>
          {isGenerating ? "Suggesting…" : "Suggest rows with AI"}
        </Button>
        <Button type="button" variant="outline" onClick={() => setImportOpen(true)}>
          Import from CSV/Excel
        </Button>
        <Button type="button" variant="outline" onClick={addRow} disabled={isAdding}>
          {isAdding ? "Adding…" : "+ Add row"}
        </Button>
      </div>

      {initialItems.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No assets yet. Suggest a starter list with AI, import a file, or add a row manually.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[900px] text-xs">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-2 font-medium">Name</th>
                <th className="p-2 font-medium">Type</th>
                <th className="p-2 font-medium">Company</th>
                <th className="p-2 font-medium">Owner</th>
                <th className="p-2 font-medium">Business Unit</th>
                <th className="p-2 font-medium">Users</th>
                <th className="p-2 font-medium">Annual Cost</th>
                <th className="p-2 font-medium">Criticality</th>
                <th className="p-2 font-medium">Data Sensitivity</th>
                <th className="p-2 font-medium">Notes</th>
                <th className="p-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {initialItems.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="p-1">
                    <input
                      className={inputClass}
                      defaultValue={row.name}
                      onBlur={(e) => e.target.value !== row.name && patchRow(row.id, { name: e.target.value })}
                    />
                  </td>
                  <td className="p-1">
                    <select
                      className={selectClass}
                      defaultValue={row.assetType}
                      onChange={(e) => patchRow(row.id, { assetType: e.target.value })}
                    >
                      {Object.entries(ASSET_TYPE_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-1">
                    <select
                      className={selectClass}
                      defaultValue={row.companySource}
                      onChange={(e) => patchRow(row.id, { companySource: e.target.value })}
                    >
                      {Object.entries(COMPANY_ROLE_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-1">
                    <input
                      className={inputClass}
                      defaultValue={row.owner ?? ""}
                      onBlur={(e) => e.target.value !== (row.owner ?? "") && patchRow(row.id, { owner: e.target.value || null })}
                    />
                  </td>
                  <td className="p-1">
                    <input
                      className={inputClass}
                      defaultValue={row.businessUnit ?? ""}
                      onBlur={(e) => e.target.value !== (row.businessUnit ?? "") && patchRow(row.id, { businessUnit: e.target.value || null })}
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      className={inputClass}
                      defaultValue={row.users ?? ""}
                      onBlur={(e) => patchRow(row.id, { users: e.target.value ? Number(e.target.value) : null })}
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      className={inputClass}
                      defaultValue={row.annualCost ?? ""}
                      onBlur={(e) => patchRow(row.id, { annualCost: e.target.value ? Number(e.target.value) : null })}
                    />
                  </td>
                  <td className="p-1">
                    <select
                      className={selectClass}
                      defaultValue={row.criticality ?? ""}
                      onChange={(e) => patchRow(row.id, { criticality: e.target.value || null })}
                    >
                      <option value="">—</option>
                      {Object.entries(CRITICALITY_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-1">
                    <select
                      className={selectClass}
                      defaultValue={row.dataSensitivity ?? ""}
                      onChange={(e) => patchRow(row.id, { dataSensitivity: e.target.value || null })}
                    >
                      <option value="">—</option>
                      {Object.entries(DATA_SENSITIVITY_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-1">
                    <input
                      className={inputClass}
                      defaultValue={row.notes ?? ""}
                      onBlur={(e) => e.target.value !== (row.notes ?? "") && patchRow(row.id, { notes: e.target.value || null })}
                    />
                  </td>
                  <td className="p-1">
                    <button
                      type="button"
                      onClick={() => deleteRow(row.id)}
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

      <AssetInventoryImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={() => router.refresh()}
      />
    </div>
  );
}
