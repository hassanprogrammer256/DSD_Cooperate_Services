import { ArrowUpRight} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import type { Service } from "@/types";

type Props = {
  service: Service;
  detailed?: boolean;
};

export function ServiceCard({ service, detailed = false }: Props) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative h-full"
    >
      <Link
        to={`/residency/${service.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-xl border border-accent/30 bg-surface transition-colors duration-300 group-hover:border-accent/50"
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={service.heroImage}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-lg font-bold capitalize text-accent">{service.title}</h3>
          <p className="mt-2 flex-1 text-sm text-text-secondary">{detailed ? service.description : service.summary}</p>

          <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
            {detailed ? "View Full Details" : "Learn More"}
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
