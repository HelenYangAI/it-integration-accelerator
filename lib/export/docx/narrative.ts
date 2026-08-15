import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

function markdownToParagraphs(markdown: string): Paragraph[] {
  const lines = markdown.split(/\r?\n/);
  const paragraphs: Paragraph[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line.trim() === "") continue;

    if (line.startsWith("### ")) {
      paragraphs.push(new Paragraph({ text: line.slice(4), heading: HeadingLevel.HEADING_3 }));
    } else if (line.startsWith("## ")) {
      paragraphs.push(new Paragraph({ text: line.slice(3), heading: HeadingLevel.HEADING_2 }));
    } else if (line.startsWith("# ")) {
      paragraphs.push(new Paragraph({ text: line.slice(2), heading: HeadingLevel.HEADING_1 }));
    } else if (/^[-*]\s+/.test(line)) {
      paragraphs.push(
        new Paragraph({
          text: line.replace(/^[-*]\s+/, ""),
          bullet: { level: 0 },
        })
      );
    } else {
      paragraphs.push(new Paragraph({ children: [new TextRun(line)] }));
    }
  }

  return paragraphs;
}

/** Renders any NARRATIVE item's markdown content as a Word document, given the item's title as a heading. */
export async function buildNarrativeDocx(title: string, markdown: string): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: title, heading: HeadingLevel.TITLE }),
          ...markdownToParagraphs(markdown),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
