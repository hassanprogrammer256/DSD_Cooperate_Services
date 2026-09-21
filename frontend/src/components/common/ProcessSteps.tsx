import type { LucideIcon } from "lucide-react";

type Step = {
  step: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

type Props = {
  eyebrow: string;
  title: string;
  steps: Step[];
  background?: "surface" | "surface-secondary";
};

export function ProcessSteps({ eyebrow, title, steps, background = "surface-secondary" }: Props) {
  return (
    <div className={`${background === "surface-secondary" ? "bg-surface-secondary" : ""} py-16 md:py-20`}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">
          {eyebrow}
        </span>
        <h2 className="mt-2 font-display text-2xl font-bold text-text-primary md:text-3xl">{title}</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, icon: Icon, title: stepTitle, description }) => (
            <div key={step} className="rounded-xl border border-accent/30 bg-surface p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-display font-bold text-primary">
                  {step}
                </span>
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold capitalize text-accent">{stepTitle}</h3>
              <p className="mt-2 text-sm text-text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
