import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { CtaButton } from "@/components/common/CtaButton";

const containerVariants = { animate: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

type QuickLink = { icon: LucideIcon; label: string; to: string };

type Props = {
  image: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  quickLinks: QuickLink[];
  primaryCta: { label: string; to: string };
  secondaryCta: { label: string; to: string };
};

// Shared hero template for the 3 redesigned pillar hub pages (Incorporation/Residency/
// Compliance) — new 2026-09-09, matching the client-supplied reference images. Distinct
// from Home's own Hero.tsx (which keeps its own dual-CTA/tagline layout) and from
// PageHeroBanner (used by every other non-Home page) — this one carries a quick-link
// icon row and two CTAs the plainer PageHeroBanner has no slot for.
export function PillarHero({ image, eyebrow, title, highlight, description, quickLinks, primaryCta, secondaryCta }: Props) {
  return (
    <section className="relative flex min-h-[520px] items-center bg-cover bg-center pt-24" style={{ backgroundImage: `url(${image})` }}>
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(120deg, rgba(10,27,51,0.9) 0%, rgba(10,27,51,0.6) 60%, rgba(10,27,51,0.4) 100%)",
        }}
      />
      <motion.div variants={containerVariants} initial="initial" animate="animate" className="relative mx-auto max-w-7xl px-4 py-16 md:px-6">
        <motion.span variants={itemVariants} className="text-xs font-semibold uppercase tracking-wide text-accent">
          {eyebrow}
        </motion.span>
        <motion.h1 variants={itemVariants} className="mt-3 max-w-2xl font-display text-3xl font-bold text-white md:text-5xl">
          {title} <span className="text-accent">{highlight}</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-4 max-w-xl text-white/82">
          {description}
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-4">
          <CtaButton to={primaryCta.to} size="lg">
            {primaryCta.label}
          </CtaButton>
          <Link
            to={secondaryCta.to}
            className="rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:border-white"
          >
            {secondaryCta.label}
          </Link>
        </motion.div>
        <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-6">
          {quickLinks.map(({ icon: Icon, label, to }) => (
            <Link key={label} to={to} className="flex flex-col items-center gap-2 text-white/85 hover:text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                <Icon size={18} />
              </span>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
