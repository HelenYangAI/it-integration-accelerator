import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveDeal } from "@/lib/deal";
import { getCategoryBySlug } from "@/lib/catalog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ITEM_STATUS_LABELS,
  RAG_STATUS_COLORS,
  RENDER_KIND_LABELS,
} from "@/lib/labels";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{category.templates.length} items</p>
      </div>

      <div className="space-y-2">
        {category.templates.map((t) => {
          const item = t.items[0];
          const status = item?.status ?? "NOT_STARTED";
          const rag = item?.ragStatus ?? "GREEN";
          return (
            <Link key={t.key} href={`/item/${t.key}`}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardContent className="flex items-center gap-4 py-4">
                  <span
                    className={`size-2.5 shrink-0 rounded-full ${RAG_STATUS_COLORS[rag]}`}
                    title={rag}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{t.title}</p>
                    <p className="truncate text-sm text-muted-foreground">{t.description}</p>
                  </div>
                  <Badge variant="outline">{RENDER_KIND_LABELS[t.renderKind]}</Badge>
                  <Badge variant="secondary">{ITEM_STATUS_LABELS[status]}</Badge>
                  {item?.owner && (
                    <span className="hidden shrink-0 text-sm text-muted-foreground sm:inline">
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
