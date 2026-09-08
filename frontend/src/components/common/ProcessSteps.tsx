import { SectionHeading } from "@/components/common/SectionHeading";
import type { ServiceProcessStep } from "@/types";

type Props = {
  steps: ServiceProcessStep[];
  title?: string;
  description?: string;
};

export function ProcessSteps({ steps, title = "How We Help You Get There", description }: Props) {
  if (steps.length === 0) return null;

  return (
    <div className="mt-14">
      <SectionHeading align="left" eyebrow="Our Process" title={title} description={description} />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-lg border border-border bg-surface p-5">
            <span className="font-mono text-sm font-semibold text-accent">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 font-display text-base font-semibold text-text-primary">{step.title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
