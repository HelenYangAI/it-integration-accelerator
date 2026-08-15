import { buttonVariants } from "@/components/ui/button";

type Props = {
  itemKey: string;
  formats: { format: string; label: string }[];
};

export function ExportMenu({ itemKey, formats }: Props) {
  if (formats.length === 0) return null;
  return (
    <div className="flex gap-2">
      {formats.map(({ format, label }) => (
        <a
          key={format}
          href={`/api/deal/export/${itemKey}?format=${format}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          {label}
        </a>
      ))}
    </div>
  );
}
