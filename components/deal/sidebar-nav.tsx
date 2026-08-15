"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getCategoryStyle } from "@/lib/category-styles";
import { ResetDealDialog } from "@/components/deal/reset-deal-dialog";

export type SidebarCategory = {
  slug: string;
  name: string;
  itemCount: number;
  notStartedCount: number;
};

export function DealSidebarNav({
  dealName,
  categories,
}: {
  dealName: string;
  categories: SidebarCategory[];
}) {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading text-sm font-semibold">
            {dealName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">IT Integration Accelerator</p>
            <p className="truncate text-sm font-semibold">{dealName}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/"}
                  render={
                    <Link href="/">
                      <LayoutDashboard className="text-muted-foreground" />
                      Dashboard
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((c) => {
                const style = getCategoryStyle(c.slug);
                return (
                  <SidebarMenuItem key={c.slug}>
                    <SidebarMenuButton
                      isActive={pathname === `/category/${c.slug}`}
                      render={
                        <Link href={`/category/${c.slug}`}>
                          <span className={`size-1.5 shrink-0 rounded-full ${style.dot}`} />
                          {c.name}
                        </Link>
                      }
                    />
                    {c.notStartedCount > 0 && (
                      <SidebarMenuBadge>{c.notStartedCount}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ResetDealDialog dealName={dealName} />
      </SidebarFooter>
    </Sidebar>
  );
}
