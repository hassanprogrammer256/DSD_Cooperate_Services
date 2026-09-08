import { CircleCheck, type LucideIcon } from "lucide-react";

type Props = {
  icon?: LucideIcon;
  tone?: "primary" | "accent";
  surface?: "surface" | "surface-secondary";
  children: string;
};

const TONE_CLASSES: Record<NonNullable<Props["tone"]>, string> = {
  primary: "bg-primary-light text-primary",
  accent: "bg-accent-light text-accent",
};

export function ChecklistCard({ icon: Icon = CircleCheck, tone = "primary", surface = "surface", children }: Props) {
  return (
    <div className={`flex items-start gap-3 rounded-lg border border-border p-3.5 ${surface === "surface" ? "bg-surface" : "bg-surface-secondary"}`}>
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${TONE_CLASSES[tone]}`}>
        <Icon size={14} />
      </div>
      <span className="text-sm text-text-secondary">{children}</span>
    </div>
  );
}
