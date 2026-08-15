import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getActiveDeal } from "@/lib/deal";
import { getItemByKey, getAssetInventoryItems } from "@/lib/catalog";
import { getEntityConfig } from "@/lib/entities/config";
import { getEntityRows, serializeRows, getRefOptionsForConfig } from "@/lib/entities/query";
import {
  ASSET_TYPE_LABELS,
  CRITICALITY_LABELS,
  DATA_SENSITIVITY_LABELS,
  COMPANY_ROLE_LABELS,
  TASK_STATUS_LABELS,
} from "@/lib/labels";
import "./print.css";

export default async function PrintItemPage({
  params,
}: {
  params: Promise<{ itemKey: string }>;
}) {
  const { itemKey } = await params;
  const deal = await getActiveDeal();
  if (!deal) notFound();

  const item = await getItemByKey(deal.id, itemKey);
  if (!item) notFound();

  const { template } = item;

  return (
    <div className="print-page">
      <h1>{template.title}</h1>
      <p className="print-subtitle">{template.description}</p>

      {template.renderKind === "NARRATIVE" && (
        <NarrativeBody content={item.content} />
      )}

      {template.renderKind === "TABLE" && template.linkedEntity === "AssetInventoryItem" && (
        <AssetInventoryBody dealId={deal.id} />
      )}

      {template.renderKind === "TABLE" && template.linkedEntity && template.linkedEntity !== "AssetInventoryItem" && (
        <GenericTableBody linkedEntity={template.linkedEntity} dealId={deal.id} />
      )}

      {template.renderKind === "CHECKLIST" && <ChecklistBody tasks={item.tasks} />}
    </div>
  );
}

function NarrativeBody({ content }: { content: unknown }) {
  const markdown =
    content && typeof content === "object" && "markdown" in content
      ? String((content as { markdown: unknown }).markdown ?? "")
      : "";
  if (!markdown) return <p>No content yet.</p>;
  return (
    <div className="print-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}

async function AssetInventoryBody({ dealId }: { dealId: string }) {
  const items = await getAssetInventoryItems(dealId);
  if (items.length === 0) return <p>No rows yet.</p>;
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Company</th>
          <th>Owner</th>
          <th>Business Unit</th>
          <th>Criticality</th>
          <th>Data Sensitivity</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {items.map((r) => (
          <tr key={r.id}>
            <td>{r.name}</td>
            <td>{ASSET_TYPE_LABELS[r.assetType] ?? r.assetType}</td>
            <td>{COMPANY_ROLE_LABELS[r.companySource] ?? r.companySource}</td>
            <td>{r.owner ?? ""}</td>
            <td>{r.businessUnit ?? ""}</td>
            <td>{r.criticality ? CRITICALITY_LABELS[r.criticality] : ""}</td>
            <td>{r.dataSensitivity ? DATA_SENSITIVITY_LABELS[r.dataSensitivity] : ""}</td>
            <td>{r.notes ?? ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

async function GenericTableBody({ linkedEntity, dealId }: { linkedEntity: string; dealId: string }) {
  const config = getEntityConfig(linkedEntity);
  if (!config) return <p>No rows yet.</p>;
  const rows = serializeRows(await getEntityRows(linkedEntity, dealId));
  if (rows.length === 0) return <p>No rows yet.</p>;
  const refOptions = await getRefOptionsForConfig(config, dealId);

  return (
    <table>
      <thead>
        <tr>
          {config.columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id as string}>
            {config.columns.map((col) => {
              const value = row[col.key];
              let display = value === null || value === undefined ? "" : String(value);
              if (col.type === "select" && col.options) {
                display = col.options.find((o) => o.value === value)?.label ?? display;
              }
              if (col.type === "referenceSelect" && col.refEntity) {
                display = refOptions[col.refEntity]?.find((o) => o.value === value)?.label ?? display;
              }
              if (col.type === "date" && typeof value === "string") display = value.slice(0, 10);
              if (col.type === "boolean") display = value ? "Yes" : "No";
              return <td key={col.key}>{display}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ChecklistBody({
  tasks,
}: {
  tasks: { task: string; status: string; owner: string | null; dueDate: Date | null }[];
}) {
  if (tasks.length === 0) return <p>No tasks yet.</p>;
  return (
    <table>
      <thead>
        <tr>
          <th>Task</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Due Date</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((t, i) => (
          <tr key={i}>
            <td>{t.task}</td>
            <td>{TASK_STATUS_LABELS[t.status] ?? t.status}</td>
            <td>{t.owner ?? ""}</td>
            <td>{t.dueDate ? t.dueDate.toISOString().slice(0, 10) : ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
