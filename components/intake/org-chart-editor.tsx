"use client";

import { useFieldArray, useWatch, type Control, type UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IT_FUNCTION_LABELS } from "@/lib/labels";
import type { DealIntakeInput } from "@/lib/schemas/deal";
import { Trash2, Plus } from "lucide-react";

type Props = {
  scope: "ACQUIRER" | "TARGET";
  label: string;
  control: Control<DealIntakeInput>;
  register: UseFormRegister<DealIntakeInput>;
};

export function OrgChartEditor({ scope, label, control, register }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: "itOrgNodes" });
  const watchedNodes = useWatch({ control, name: "itOrgNodes" }) ?? [];

  const scopedIndices = fields
    .map((field, index) => ({ field, index }))
    .filter(({ field }) => field.scope === scope);

  const titleByClientId = new Map(watchedNodes.map((n) => [n.clientId, n.title]));

  function addNode() {
    append({
      clientId: crypto.randomUUID(),
      parentClientId: "",
      scope,
      title: "",
      name: "",
      function: "",
      notes: "",
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{label} IT Org</h3>
        <Button type="button" variant="outline" size="sm" onClick={addNode}>
          <Plus className="size-4" /> Add role
        </Button>
      </div>

      {scopedIndices.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No roles added yet. Add the CIO/IT lead down through the key functions.
        </p>
      )}

      <div className="space-y-3">
        {scopedIndices.map(({ field, index }) => {
          const parentOptions = scopedIndices.filter(({ field: f }) => f.clientId !== field.clientId);
          return (
            <div key={field.id} className="rounded-md border p-3">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Title (e.g. CIO)" {...register(`itOrgNodes.${index}.title` as const)} />
                <Input placeholder="Name (optional)" {...register(`itOrgNodes.${index}.name` as const)} />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <select
                  className="border-input h-9 rounded-md border bg-transparent px-3 text-sm"
                  {...register(`itOrgNodes.${index}.function` as const)}
                  defaultValue=""
                >
                  <option value="">Function (optional)</option>
                  {Object.entries(IT_FUNCTION_LABELS).map(([value, text]) => (
                    <option key={value} value={value}>
                      {text}
                    </option>
                  ))}
                </select>
                <select
                  className="border-input h-9 rounded-md border bg-transparent px-3 text-sm"
                  {...register(`itOrgNodes.${index}.parentClientId` as const)}
                  defaultValue=""
                >
                  <option value="">Reports to: (none — top of IT org)</option>
                  {parentOptions.map(({ field: f }) => (
                    <option key={f.clientId} value={f.clientId}>
                      {titleByClientId.get(f.clientId) || "(untitled)"}
                    </option>
                  ))}
                </select>
              </div>
              <Textarea
                className="mt-2"
                placeholder="Notes (optional)"
                rows={2}
                {...register(`itOrgNodes.${index}.notes` as const)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" /> Remove
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
