import { ArrowUpRight} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// import { serviceIcons } from "@/lib/icons";
// import { badgeColorAt, type BadgeColor } from "@/lib/utils";
import type { Service } from "@/types";

type Props = {
  service: Service;
  colorIndex: number;
  detailed?: boolean;
};

// const BADGE_CLASSES: Record<BadgeColor, string> = {
//   primary: "bg-primary-light text-primary",
//   accent: "bg-accent-light text-accent",
//   success: "bg-success-light text-success",
//   warning: "bg-warning-light text-warning",
//   info: "bg-info-light text-info",
// };

export function ServiceCard({ service,  detailed = false }: Props) {
  // const Icon = serviceIcons[service.icon];
  // const badgeClass = BADGE_CLASSES[badgeColorAt(colorIndex)];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative h-full"
    >


      <Link
        to={`/residency/${service.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors duration-300 group-hover:border-accent/50"
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={service.heroImage}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* <div className={`absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg ${badgeClass}`}>
            {Icon && <Icon size={20} />}
          </div> */}
        </div>

     <div className="flex flex-1 flex-col p-6"> 
          <h3 className="font-display text-lg font-semibold text-accent">{service.title}</h3> 
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
