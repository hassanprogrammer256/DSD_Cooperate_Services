import { motion } from "framer-motion";

import { CtaButton } from "@/components/common/CtaButton";
import type { ServiceIncludedItem } from "@/types";

type Props = {
  item: ServiceIncludedItem;
  index: number;
};

export function IncludedCard({ item, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative h-full"
    >


      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-colors duration-300 group-hover:border-accent/50">
        <div className="aspect-video overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-base font-semibold text-text-primary">{item.title}</h3>
          <p className="mt-2 flex-1 text-sm text-text-secondary">{item.description}</p>
          {/* <CtaButton to="/contact" size="sm" sx={{ mt: 3, alignSelf: "flex-start" }}>
            Book a Consultation
          </CtaButton> */}
        </div>
      </div>
    </motion.div>
  );
}
