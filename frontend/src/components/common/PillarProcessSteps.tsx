import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/common/SectionHeading";

type Step = { icon: LucideIcon; title: string; description: string };

type Props = {
  title?: string;
  description?: string;
  steps: Step[];
};

// Shared 6-step "Our Process" row for the redesigned pillar hub pages — new
// 2026-09-09. Distinct from ProcessSteps.tsx (used by ServiceDetailPage over a
// service's own dynamic, DB-driven `process` field) — this one takes fixed,
// per-pillar-authored steps with icons, matching the reference images.
export function PillarProcessSteps({ title = "Our Process", description, steps }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <SectionHeading title={title} description={description} />
      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
              <step.icon size={20} />
            </div>
            <p className="mt-3 font-mono text-xs font-semibold text-accent">{String(index + 1).padStart(2, "0")}</p>
            <p className="mt-1 font-display text-sm font-semibold text-text-primary">{step.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
