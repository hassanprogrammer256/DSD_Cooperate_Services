import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/common/SectionHeading";

type WhyItem = { icon: LucideIcon; title: string; description: string };

type Props = {
  title: string;
  description: string;
  items: WhyItem[];
};

// Shared "Why X" 4-icon strip for the redesigned pillar hub pages — new 2026-09-09.
// Same card recipe as ProcessSteps/ChecklistCard (border-border/bg-surface/rounded-lg),
// not PhilosophyStrip's navy-gradient treatment, since this sits on the page's default
// background, not a dark band.
export function WhyStrip({ title, description, items }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <SectionHeading title={title} description={description} />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="rounded-lg border border-border bg-surface p-6 text-center"
          >
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
              <item.icon size={20} />
            </div>
            <p className="mt-4 font-display text-base font-semibold text-text-primary">{item.title}</p>
            <p className="mt-2 text-sm text-text-secondary">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
