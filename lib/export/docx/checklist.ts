import { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, WidthType } from "docx";
import { TASK_STATUS_LABELS } from "@/lib/labels";

export type ChecklistExportTask = {
  task: string;
  status: string;
  owner: string | null;
  dueDate: string | null;
  notes: string | null;
};

function headerCell(text: string): TableCell {
  return new TableCell({
    children: [new Paragraph({ text })],
    width: { size: 25, type: WidthType.PERCENTAGE },
  });
}

/** Renders any CHECKLIST item's tasks as a literal go/no-go checklist document. */
export async function buildChecklistDocx(title: string, tasks: ChecklistExportTask[]): Promise<Buffer> {
  const headerRow = new TableRow({
    children: [headerCell("Task"), headerCell("Status"), headerCell("Owner"), headerCell("Due Date")],
  });

  const rows = tasks.map(
    (t) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(t.task)] }),
          new TableCell({ children: [new Paragraph(TASK_STATUS_LABELS[t.status] ?? t.status)] }),
          new TableCell({ children: [new Paragraph(t.owner ?? "")] }),
          new TableCell({ children: [new Paragraph(t.dueDate ? t.dueDate.slice(0, 10) : "")] }),
        ],
      })
  );

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: title, heading: HeadingLevel.TITLE }),
          new Table({ rows: [headerRow, ...rows], width: { size: 100, type: WidthType.PERCENTAGE } }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
