import { motion } from "framer-motion";
import { Briefcase, Building2, Handshake, IdCard, ShieldCheck, UserCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { SentenceText } from "@/components/common/SentenceText";
import heroBg from "@/assets/images/hero/home_hero-bg.png";

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const TAGLINE = "Plan with a clear strategy • Structure for stability • Grow with long term vision";

const PILLAR_LINKS = [
  { to: "/incorporation", label: "Incorporation", icon: Building2 },
  { to: "/residency", label: "Residency", icon: IdCard },
  { to: "/compliance", label: "Compliance", icon: ShieldCheck },
  { to: "/partner-with-us", label: "Partner with Us", icon: Handshake },
  { to: "/mohre", label: "MOHRE", icon: Briefcase },
  { to: "/immigration", label: "Immigration", icon: Users },
  { to: "/local-sponsorship", label: "Local Sponsorship", icon: UserCheck },
];

export function Hero() {
  return (
    <section
      className="relative flex min-h-150 items-center bg-[#0a1b33] bg-[length:100%_auto] bg-center bg-no-repeat pt-24 md:min-h-150"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(10,27,51,0.88) 0%, rgba(10,27,51,0.55) 60%, rgba(10,27,51,0.35) 100%)",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative mx-auto max-w-7xl px-4 py-16 md:px-6"
      >
   
        <motion.h1
          variants={itemVariants}
          className="mt-4 max-w-2xl font-display text-4xl font-bold text-white md:text-5xl md:leading-[1.15]"
        >
        Strategic Advisory,
        <br />
        Straightforward Execution
        </motion.h1>
        <motion.div variants={itemVariants} className="mt-4 max-w-xl text-white/82">
          <SentenceText text="DSD Corporate Services guides businesses, founders, investors, innovators, startups and relocating professionals with end to end guidance across UAE Company setup, compliance and residency pathways. We believe in empowering our clients with transparent and practical insights ensuring you make confident decisions without the typical industry run around." />
        </motion.div>
        <motion.p
          variants={itemVariants}
          className="mt-4 hidden max-w-xl text-sm text-white/70 sm:block"
        >
          {TAGLINE}
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-3">
          {PILLAR_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:border-accent hover:bg-white/15"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
