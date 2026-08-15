import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveDeal } from "@/lib/deal";
import { getCategoryBySlug } from "@/lib/catalog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  ITEM_STATUS_LABELS,
  ITEM_STATUS_BADGE_CLASSES,
  RAG_STATUS_COLORS,
  RAG_STATUS_LABELS,
  RENDER_KIND_LABELS,
} from "@/lib/labels";
import { getCategoryStyle } from "@/lib/category-styles";

const PPTX_EXPORT_CATEGORIES = new Set(["assessment-planning", "governance-tracking", "day1-readiness"]);

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const deal = await getActiveDeal();
  if (!deal) return null;

  const category = await getCategoryBySlug(deal.id, categorySlug);
  if (!category) notFound();

  const style = getCategoryStyle(categorySlug);
  const Icon = style.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${style.iconWrap}`}>
            <Icon className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{category.templates.length} items</p>
          </div>
        </div>
        {PPTX_EXPORT_CATEGORIES.has(categorySlug) && (
          <a
            href={`/api/deal/export/category/${categorySlug}?format=pptx`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Export PowerPoint (.pptx)
          </a>
        )}
      </div>

      <div className="space-y-2">
        {category.templates.map((t) => {
          const item = t.items[0];
          const status = item?.status ?? "NOT_STARTED";
          const rag = item?.ragStatus ?? "GREEN";
          return (
            <Link key={t.key} href={`/item/${t.key}`}>
              <Card className="border-l-4 border-l-transparent transition-all hover:border-l-primary hover:shadow-sm">
                <CardContent className="flex items-center gap-4 py-4">
                  <span
                    className={`size-2.5 shrink-0 rounded-full ${RAG_STATUS_COLORS[rag]}`}
                    title={RAG_STATUS_LABELS[rag]}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{t.title}</p>
                    <p className="truncate text-sm text-muted-foreground">{t.description}</p>
                  </div>
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    {RENDER_KIND_LABELS[t.renderKind]}
                  </Badge>
                  <Badge className={`border-transparent ${ITEM_STATUS_BADGE_CLASSES[status]}`}>
                    {ITEM_STATUS_LABELS[status]}
                  </Badge>
                  {item?.owner && (
                    <span className="hidden shrink-0 text-sm text-muted-foreground md:inline">
                      {item.owner}
                    </span>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
