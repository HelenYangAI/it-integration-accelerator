import { NextResponse } from "next/server";
import { generateText, streamText, Output } from "ai";
import { prisma } from "@/lib/db";
import { getActiveDeal } from "@/lib/deal";
import { buildDealContext } from "@/lib/ai/context-builder";
import { getPromptConfig } from "@/lib/ai/prompts";
import { aiModel } from "@/lib/ai/client";

export async function POST(
  request: Request,
  ctx: { params: Promise<{ key: string }> }
) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set. Add it to .env and restart the server." },
      { status: 500 }
    );
  }

  const { key } = await ctx.params;
  const deal = await getActiveDeal();
  if (!deal) {
    return NextResponse.json({ error: "No active deal" }, { status: 404 });
  }

  const item = await prisma.integrationItem.findUnique({
    where: { dealId_itemKey: { dealId: deal.id, itemKey: key } },
  });
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const config = getPromptConfig(key);
  if (!config) {
    return NextResponse.json(
      { error: "AI generation is not yet available for this item" },
      { status: 400 }
    );
  }

  const context = await buildDealContext(deal.id);
  const prompt = await config.buildPrompt(context);

  if (config.kind === "NARRATIVE") {
    const result = streamText({
      model: aiModel,
      system: config.system,
      prompt,
      onFinish: async ({ text }) => {
        if (item.content) {
          await prisma.itemVersion.create({
            data: { itemId: item.id, content: item.content },
          });
        }
        await prisma.integrationItem.update({
          where: { id: item.id },
          data: {
            content: { markdown: text },
            generatedAt: new Date(),
            status: item.status === "NOT_STARTED" ? "IN_PROGRESS" : item.status,
          },
        });
      },
      onError: ({ error }) => {
        console.error(`Narrative generation failed for item "${key}":`, error);
      },
    });

    return result.toTextStreamResponse();
  }

  // TABLE / CHECKLIST: generate structured rows and append them (never
  // overwrites or deletes existing manually-entered or imported rows).
  const { output } = await generateText({
    model: aiModel,
    system: config.system,
    prompt,
    output: Output.object({ schema: config.schema }),
  });

  const { createdCount } = await config.persist({
    dealId: deal.id,
    itemId: item.id,
    output,
  });

  await prisma.integrationItem.update({
    where: { id: item.id },
    data: {
      generatedAt: new Date(),
      status: item.status === "NOT_STARTED" ? "IN_PROGRESS" : item.status,
    },
  });

  return NextResponse.json({ createdCount });
}
