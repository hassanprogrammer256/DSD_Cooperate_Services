import { ClipboardCheck, FileCheck, Handshake, Landmark, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

type Principle = {
  icon: LucideIcon;
  title: string;
  description: string;
};

// DSD's own four differentiators, referenced against the reference site's
// four-principle framing but written in DSD's own voice — see project-overview.md.
const PRINCIPLES: Principle[] = [
  {
    icon: Landmark,
    title: "Domain Experience",
    description: "Years spent inside UAE residency, incorporation, and compliance rules — not generalist advice applied to a specialist problem.",
  },
  {
    icon: Handshake,
    title: "Collaborative Approach",
    description: "One advisor across your whole engagement, not a handoff between departments every time your situation changes.",
  },
  {
    icon: FileCheck,
    title: "Evidence-Led Advice",
    description: "Recommendations grounded in your actual documents and circumstances, not a generic template applied to every client.",
  },
  {
    icon: ClipboardCheck,
    title: "Execution Awareness",
    description: "We know what actually happens at the counter, not just what the regulation says on paper.",
  },
];

export function PhilosophyStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20 bg-navy-elevated rounded-lg text-white">
      <h2 className="text-md font-bold text-center text-left text-accent">Our Philosophical Principles</h2>
<h4 className="text-5xl font-medium text-center text-white text-left max-w-3xl">Strategic Interventions that Transform our Clients' Business
Trajectory</h4>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map((principle, index) => (
          <motion.div
            key={principle.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="rounded-lg border border-navy hover:from-navy-elevated hover:to-navy bg-gradient-to-br from-navy to-navy-elevated p-6"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg  text-accent">
              <principle.icon size={40} />
            </div>
            <h3 className="mt-4 font-display text-base font-semibold ">{principle.title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{principle.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
