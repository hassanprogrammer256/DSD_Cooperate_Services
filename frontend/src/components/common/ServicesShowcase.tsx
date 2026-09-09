import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { SectionHeading } from "@/components/common/SectionHeading";

type ShowcaseItem = { icon: LucideIcon; title: string; description: string; to: string };
type PhotoCard = { image: string; title: string; description: string; ctaLabel: string; ctaTo: string };

type Props = {
  title: string;
  description: string;
  items: ShowcaseItem[];
  photoCard: PhotoCard;
};

// Shared "Our [Pillar] Services" section for the redesigned hub pages — new
// 2026-09-09. 2x2 icon-card grid + one large photo card, matching the client-supplied
// reference images' layout exactly.
export function ServicesShowcase({ title, description, items, photoCard }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <SectionHeading align="left" title={title} description={description} />
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={item.to}
                className="block h-full rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <item.icon size={18} />
                </div>
                <p className="mt-3 font-display text-sm font-semibold text-text-primary">{item.title}</p>
                <p className="mt-1 text-xs text-text-secondary">{item.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="relative min-h-[280px] overflow-hidden rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${photoCard.image})` }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(0deg, rgba(10,27,51,0.92) 10%, rgba(10,27,51,0.35) 70%)" }}
          />
          <div className="relative flex h-full flex-col justify-end p-6">
            <p className="font-display text-lg font-semibold text-white">{photoCard.title}</p>
            <p className="mt-2 text-sm text-white/80">{photoCard.description}</p>
            <Link to={photoCard.ctaTo} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white hover:text-accent">
              {photoCard.ctaLabel} <ArrowUpRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
