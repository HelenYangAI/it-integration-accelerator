import Link from "next/link";
import { getActiveDeal } from "@/lib/deal";
import { getWorkspaceCategories } from "@/lib/catalog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEAL_TYPE_LABELS } from "@/lib/labels";

export default async function WorkspaceHomePage() {
  const deal = await getActiveDeal();
  if (!deal) return null;

  const categories = await getWorkspaceCategories(deal.id);

  const totals = categories.reduce(
    (acc, c) => {
      for (const t of c.templates) {
        const item = t.items[0];
        acc.total += 1;
        if (!item || item.status === "NOT_STARTED") acc.notStarted += 1;
        else if (item.status === "IN_PROGRESS") acc.inProgress += 1;
        else if (item.status === "COMPLETE") acc.complete += 1;
        if (item?.ragStatus === "RED") acc.red += 1;
        else if (item?.ragStatus === "AMBER") acc.amber += 1;
      }
      return acc;
    },
    { total: 0, notStarted: 0, inProgress: 0, complete: 0, red: 0, amber: 0 }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{deal.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {DEAL_TYPE_LABELS[deal.dealType]} · {deal.industry}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatTile label="Items" value={totals.total} />
        <StatTile label="Not started" value={totals.notStarted} />
        <StatTile label="In progress" value={totals.inProgress} />
        <StatTile label="Complete" value={totals.complete} />
        <StatTile label="Red / Amber" value={totals.red + totals.amber} tone="warn" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const catTotal = c.templates.length;
          const catComplete = c.templates.filter((t) => t.items[0]?.status === "COMPLETE").length;
          return (
            <Link key={c.slug} href={`/category/${c.slug}`}>
              <Card className="h-full transition-colors hover:bg-accent/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    {c.name}
                    <Badge variant="secondary">
                      {catComplete}/{catTotal}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {catTotal} items
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "warn";
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p
          className={
            "text-2xl font-semibold " + (tone === "warn" && value > 0 ? "text-amber-600" : "")
          }
        >
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
