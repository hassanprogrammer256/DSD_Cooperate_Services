import type { LucideIcon } from "lucide-react";

type Item = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  items: Item[];
  columns?: 2 | 3 | 5;
  note?: string;
  noteTitle?: string;
  background?: "surface" | "surface-secondary";
};

const COLUMN_CLASSES: Record<NonNullable<Props["columns"]>, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  5: "lg:grid-cols-5",
};

export function WhyChooseDsd({
  eyebrow,
  title,
  description,
  items,
  columns = 3,
  note,
  noteTitle = "A Clear Process",
  background,
}: Props) {
  return (
    <div className={`${background === "surface-secondary" ? "bg-surface-secondary" : ""} py-16 md:py-20`}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">
          {eyebrow}
        </span>
        <h2 className="mt-2 font-display text-2xl font-bold text-text-primary md:text-3xl">{title}</h2>
        {description && <p className="mt-4 max-w-3xl text-text-secondary">{description}</p>}
        <div className={`mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 ${COLUMN_CLASSES[columns]}`}>
          {items.map(({ icon: Icon, title: itemTitle, description: itemDescription }) => (
            <div key={itemTitle} className="rounded-lg border border-accent/30 bg-surface p-5">
              <Icon size={22} className="text-primary" />
              <p className="mt-3 font-display text-sm font-bold capitalize text-accent">{itemTitle}</p>
              <p className="mt-1 text-xs text-text-secondary">{itemDescription}</p>
            </div>
          ))}
        </div>
        {note && (
          <div className="mt-12 rounded-xl border border-accent/30 bg-surface-secondary p-6">
            <h3 className="font-display text-lg font-bold capitalize text-accent">{noteTitle}</h3>
            <p className="mt-3 text-sm font-medium text-text-primary">{note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
