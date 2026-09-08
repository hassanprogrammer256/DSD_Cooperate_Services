import { motion } from "framer-motion";

import { QueryState } from "@/components/common/QueryState";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ServiceCard } from "@/components/common/ServiceCard";
import { useServicesQuery } from "@/lib/api/services";


const FEATURED_SLUGS = ["residency-by-property", "start-a-new-business", "corporate-tax-advisory"];

export function ServicesOverview() {
  const { data: services, isLoading, isError, refetch } = useServicesQuery();
  const featured = FEATURED_SLUGS.map((slug) => services?.find((service) => service.slug === slug)).filter(
    (service) => service !== undefined,
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeading
        eyebrow="What We Do"
        title="Every UAE move, one"
        highlight="advisory relationship."
        description="Residency, incorporation, and compliance — DSD scopes the route that actually fits your situation."
      />

      <div className="mt-10">
        <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featured.map((service, index) => (
              <motion.div
                key={service.slug}
                className="h-full"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ServiceCard service={service} colorIndex={index} />
              </motion.div>
            ))}
          </div>
        </QueryState>
      </div>
    </section>
  );
}
