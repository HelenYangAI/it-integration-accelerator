"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ResetDealDialog({ dealName }: { dealName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  async function handleReset() {
    setIsResetting(true);
    try {
      const res = await fetch("/api/deal/reset", { method: "POST" });
      if (!res.ok) {
        toast.error("Failed to reset workspace");
        return;
      }
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to reset workspace");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-center gap-2 border-primary/30 font-medium text-primary hover:border-primary hover:bg-primary/10 hover:text-primary"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        New Deal
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a new deal?</DialogTitle>
            <DialogDescription>
              This permanently deletes <strong>{dealName}</strong> and everything in it — every
              generated document, table row, and tracking status. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isResetting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset} disabled={isResetting}>
              {isResetting ? "Deleting…" : "Delete and start over"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
