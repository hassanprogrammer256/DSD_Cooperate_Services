import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import aboutImage from "@/assets/images/about/about_teaser.webp";

export function AboutTeaser() {
  return (
    <section className="bg-surface-secondary">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-2">
        <motion.img
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          src={aboutImage}
          alt="DSD Corporate Services"
          className="aspect-[4/3] w-full rounded-xl object-cover"
        />
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">About DSD</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-text-primary md:text-4xl">
            A Dubai advisory built around one relationship, not three.
          </h2>
          <p className="mt-4 text-text-secondary">
            DSD Corporate Services helps founders, investors, and relocating professionals enter and operate in
            the UAE market with confidence — residency, incorporation, and compliance handled by one advisory
            team instead of three separate consultants who don't talk to each other.
          </p>
          <Link to="/about" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-80">
            Learn More About Us →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
