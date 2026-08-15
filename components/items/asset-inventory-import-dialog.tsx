"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { COMPANY_ROLE_LABELS } from "@/lib/labels";

type ParsedFile = {
  headers: string[];
  rows: Record<string, string>[];
  truncated: boolean;
  totalRows: number;
  suggestedMapping: Record<string, string | null>;
  targetFields: { key: string; label: string; required: boolean }[];
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: () => void;
};

export function AssetInventoryImportDialog({ open, onOpenChange, onImported }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<ParsedFile | null>(null);
  const [mapping, setMapping] = useState<Record<string, string | null>>({});
  const [companySource, setCompanySource] = useState<"ACQUIRER" | "TARGET">("ACQUIRER");
  const [isParsing, setIsParsing] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);

  function reset() {
    setParsed(null);
    setMapping({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/deal/asset-inventory/import/parse", {
        method: "POST",
        body: formData,
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error ?? "Failed to parse file");
        return;
      }
      setParsed(body);
      setMapping(body.suggestedMapping);
    } catch {
      toast.error("Failed to parse file");
    } finally {
      setIsParsing(false);
    }
  }

  async function handleCommit() {
    if (!parsed) return;
    setIsCommitting(true);
    try {
      const res = await fetch("/api/deal/asset-inventory/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: parsed.rows, mapping, companySource }),
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error ?? "Import failed");
        return;
      }
      toast.success(
        `Imported ${body.createdCount} row(s)${body.skippedCount ? `, skipped ${body.skippedCount} without a name` : ""}`
      );
      onImported();
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Import failed");
    } finally {
      setIsCommitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Application & Infrastructure Inventory</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel export from either company. Map its columns to the standard
            template below, then confirm.
          </DialogDescription>
        </DialogHeader>

        {!parsed ? (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              disabled={isParsing}
              className="text-sm"
            />
            {isParsing && <p className="text-sm text-muted-foreground">Parsing file…</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {parsed.totalRows} row(s) found{parsed.truncated ? " (showing first 2000)" : ""}. Choose which
              company this file belongs to, then confirm the column mapping.
            </p>

            <div>
              <label className="mb-1 block text-xs font-medium">This file belongs to</label>
              <select
                className="border-input h-8 w-full rounded-md border bg-transparent px-2 text-sm"
                value={companySource}
                onChange={(e) => setCompanySource(e.target.value as "ACQUIRER" | "TARGET")}
              >
                {Object.entries(COMPANY_ROLE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {parsed.targetFields.map((field) => (
                <div key={field.key} className="flex items-center gap-2">
                  <span className="w-40 shrink-0 text-xs">
                    {field.label}
                    {field.required && <span className="text-destructive"> *</span>}
                  </span>
                  <select
                    className="border-input h-8 w-full rounded-md border bg-transparent px-2 text-xs"
                    value={mapping[field.key] ?? ""}
                    onChange={(e) =>
                      setMapping((m) => ({ ...m, [field.key]: e.target.value || null }))
                    }
                  >
                    <option value="">— not mapped —</option>
                    {parsed.headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          {parsed && (
            <Button variant="outline" onClick={reset} disabled={isCommitting}>
              Choose a different file
            </Button>
          )}
          <Button
            onClick={handleCommit}
            disabled={!parsed || isCommitting || !mapping.name}
          >
            {isCommitting ? "Importing…" : "Import rows"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
