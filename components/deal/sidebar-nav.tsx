"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground">IT Integration Accelerator</p>
          <p className="truncate text-sm font-semibold">{dealName}</p>
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
                  render={<Link href="/">Dashboard</Link>}
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((c) => (
                <SidebarMenuItem key={c.slug}>
                  <SidebarMenuButton
                    isActive={pathname === `/category/${c.slug}`}
                    render={<Link href={`/category/${c.slug}`}>{c.name}</Link>}
                  />
                  {c.notStartedCount > 0 && (
                    <SidebarMenuBadge>{c.notStartedCount}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
