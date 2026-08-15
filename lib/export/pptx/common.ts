import PptxGenJS from "pptxgenjs";

export const RAG_HEX: Record<string, string> = {
  GREEN: "D1E7DD",
  AMBER: "FFF3CD",
  RED: "F8D7DA",
};

export function newDeck(): PptxGenJS {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
  pres.layout = "WIDE";
  return pres;
}

export function addTitleSlide(pres: PptxGenJS, title: string, subtitle: string) {
  const slide = pres.addSlide();
  slide.addText(title, {
    x: 0.6, y: 2.6, w: 12.1, h: 1.2, fontSize: 32, bold: true, fontFace: "Arial",
  });
  slide.addText(subtitle, {
    x: 0.6, y: 3.7, w: 12.1, h: 0.6, fontSize: 16, color: "666666", fontFace: "Arial",
  });
}

export function addTableSlide(
  pres: PptxGenJS,
  heading: string,
  header: string[],
  rows: (string | { text: string; fill?: string })[][]
) {
  const slide = pres.addSlide();
  slide.addText(heading, { x: 0.4, y: 0.3, w: 12.5, h: 0.6, fontSize: 20, bold: true, fontFace: "Arial" });

  const tableRows = [
    header.map((h) => ({ text: h, options: { bold: true, fill: { color: "E9ECEF" }, fontSize: 10 } })),
    ...rows.map((row) =>
      row.map((cell) => {
        const isObj = typeof cell === "object";
        return {
          text: isObj ? cell.text : cell,
          options: {
            fontSize: 9,
            fill: isObj && cell.fill ? { color: cell.fill } : undefined,
          },
        };
      })
    ),
  ];

  slide.addTable(tableRows, {
    x: 0.4,
    y: 1.0,
    w: 12.5,
    fontFace: "Arial",
    border: { type: "solid", color: "CCCCCC", pt: 0.5 },
    autoPage: true,
    autoPageLineWeight: -1,
  });
}

export async function toBuffer(pres: PptxGenJS): Promise<Buffer> {
  const out = await pres.write({ outputType: "nodebuffer" });
  return out as Buffer;
}
