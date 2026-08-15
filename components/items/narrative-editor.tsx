"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  itemKey: string;
  initialMarkdown: string;
  hasContent: boolean;
};

export function NarrativeEditor({ itemKey, initialMarkdown, hasContent }: Props) {
  const router = useRouter();
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const [dirty, setDirty] = useState(false);

  async function handleGenerate() {
    setIsGenerating(true);
    setMarkdown("");
    setDirty(false);
    try {
      const res = await fetch(`/api/deal/items/${itemKey}/generate`, { method: "POST" });
      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Generation failed");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMarkdown(acc);
      }
      router.refresh();
    } catch {
      toast.error("Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSave() {
    startSaving(async () => {
      const res = await fetch(`/api/deal/items/${itemKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: { markdown } }),
      });
      if (!res.ok) {
        toast.error("Failed to save");
        return;
      }
      setDirty(false);
      toast.success("Saved");
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button type="button" onClick={handleGenerate} disabled={isGenerating} variant={hasContent ? "outline" : "default"}>
            {isGenerating ? "Generating…" : hasContent ? "Regenerate" : "Generate with AI"}
          </Button>
          <Button type="button" onClick={handleSave} disabled={!dirty || isSaving}>
            {isSaving ? "Saving…" : "Save edits"}
          </Button>
        </div>
        {dirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">Markdown (editable)</p>
          <Textarea
            value={markdown}
            onChange={(e) => {
              setMarkdown(e.target.value);
              setDirty(true);
            }}
            disabled={isGenerating}
            rows={18}
            className="font-mono text-xs"
            placeholder="No content yet. Click Generate with AI, or write your own."
          />
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">Preview</p>
          <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border p-4 min-h-[24rem]">
            {markdown ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            ) : (
              <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
