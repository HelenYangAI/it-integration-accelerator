import { NextResponse } from "next/server";
import { getActiveDeal } from "@/lib/deal";
import { buildRoadmapPptx } from "@/lib/export/pptx/roadmap";
import { buildGovernancePptx } from "@/lib/export/pptx/governance";
import { buildDay1ReadinessPptx } from "@/lib/export/pptx/day1-readiness";
import { slugFilename } from "@/lib/export/filename";

const BUILDERS: Record<string, { build: (dealName: string, dealId: string) => Promise<Buffer>; title: string }> = {
  "assessment-planning": { build: buildRoadmapPptx, title: "IT Integration Roadmap" },
  "governance-tracking": { build: buildGovernancePptx, title: "IT Integration Governance" },
  "day1-readiness": { build: buildDay1ReadinessPptx, title: "Day 1 Readiness Go-No-Go" },
};

export async function GET(
  request: Request,
  ctx: { params: Promise<{ categorySlug: string }> }
) {
  const { categorySlug } = await ctx.params;
  const format = new URL(request.url).searchParams.get("format");

  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  if (format !== "pptx") {
    return NextResponse.json({ error: "Only PPTX export is available at the category level" }, { status: 400 });
  }

  const builder = BUILDERS[categorySlug];
  if (!builder) {
    return NextResponse.json({ error: "No PPT export available for this category" }, { status: 400 });
  }

  const buffer = await builder.build(deal.name, deal.id);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="${slugFilename(builder.title)}.pptx"`,
    },
  });
}
