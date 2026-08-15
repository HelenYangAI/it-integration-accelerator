import Link from "next/link";
import { ListChecks, CircleDashed, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { getActiveDeal } from "@/lib/deal";
import { getWorkspaceCategories } from "@/lib/catalog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEAL_TYPE_LABELS } from "@/lib/labels";
import { getCategoryStyle } from "@/lib/category-styles";

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
        <StatTile label="Items" value={totals.total} icon={ListChecks} tone="neutral" />
        <StatTile label="Not started" value={totals.notStarted} icon={CircleDashed} tone="neutral" />
        <StatTile label="In progress" value={totals.inProgress} icon={Clock} tone="info" />
        <StatTile label="Complete" value={totals.complete} icon={CheckCircle2} tone="success" />
        <StatTile
          label="Red / Amber"
          value={totals.red + totals.amber}
          icon={AlertTriangle}
          tone={totals.red + totals.amber > 0 ? "warn" : "neutral"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const catTotal = c.templates.length;
          const catComplete = c.templates.filter((t) => t.items[0]?.status === "COMPLETE").length;
          const pct = catTotal > 0 ? Math.round((catComplete / catTotal) * 100) : 0;
          const style = getCategoryStyle(c.slug);
          const Icon = style.icon;
          return (
            <Link key={c.slug} href={`/category/${c.slug}`}>
              <Card className={`h-full border-t-2 transition-shadow hover:shadow-md ${style.border}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base font-medium">
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${style.iconWrap}`}>
                      <Icon className="size-4.5" />
                    </span>
                    <span className="flex-1">{c.name}</span>
                    <Badge variant="secondary">
                      {catComplete}/{catTotal}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{catTotal} items · {pct}% complete</p>
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
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "neutral" | "info" | "success" | "warn";
}) {
  const toneClasses: Record<typeof tone, string> = {
    neutral: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
    info: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    warn: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-3 pt-6">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
          <Icon className="size-4.5" />
        </span>
        <div>
          <p className="text-2xl leading-none font-semibold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
