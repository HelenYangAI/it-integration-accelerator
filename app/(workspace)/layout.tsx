import { redirect } from "next/navigation";
import { getActiveDeal } from "@/lib/deal";
import { getWorkspaceCategories } from "@/lib/catalog";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DealSidebarNav, type SidebarCategory } from "@/components/deal/sidebar-nav";
import { Separator } from "@/components/ui/separator";

export default async function WorkspaceLayout({ children }: LayoutProps<"/">) {
  const deal = await getActiveDeal();
  if (!deal) {
    redirect("/intake");
  }

  const categories = await getWorkspaceCategories(deal.id);
  const sidebarCategories: SidebarCategory[] = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    itemCount: c.templates.length,
    notStartedCount: c.templates.filter(
      (t) => (t.items[0]?.status ?? "NOT_STARTED") === "NOT_STARTED"
    ).length,
  }));

  return (
    <SidebarProvider>
      <DealSidebarNav dealName={deal.name} categories={sidebarCategories} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-muted-foreground">{deal.name}</span>
        </header>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
