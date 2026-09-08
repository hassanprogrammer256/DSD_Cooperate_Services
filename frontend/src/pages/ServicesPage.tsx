import { motion } from "framer-motion";

import { CtaButton } from "@/components/common/CtaButton";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { QueryState } from "@/components/common/QueryState";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ServiceCard } from "@/components/common/ServiceCard";
import placeholderPhoto from "@/assets/images/placeholders/placeholder-photo.svg";
import { TeamCarousel } from "@/components/sections/TeamCarousel";
import { servicePillarMeta, useServicesQuery } from "@/lib/api/services";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function ServicesPage() {
  useDocumentTitle("Services");
  const { data: services, isLoading, isError, refetch } = useServicesQuery();

  return (
    <>
      <PageHeroBanner
        image={placeholderPhoto}
        eyebrow="What We Do"
        title="Our Services"
        description="Every route to UAE residency DSD supports — choose the pathway that matches your situation."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
          {servicePillarMeta.map((pillar, pillarIndex) => {
            // Each servicePillarMeta entry's `pillar` value is a specific service slug
            // (see Navbar's dropdown, which links `/residency/${pillar.pillar}` directly
            // to that service) — not the backend Service.pillar category — so this
            // matches by slug, always at most one card per section.
            const service = services?.find((s) => s.slug === pillar.pillar);
            return (
              <div key={pillar.pillar} id={pillar.pillar} className="scroll-mt-24 not-first:mt-16">
                <SectionHeading align="left" title={pillar.label} description={pillar.description} />
                {service && (
                  <motion.div
                    className="mt-8 max-w-sm"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ServiceCard service={service} colorIndex={pillarIndex} detailed />
                  </motion.div>
                )}
              </div>
            );
          })}
        </QueryState>
      </div>

      <section
        className="relative bg-cover bg-center py-16 md:py-20"
        style={{ backgroundImage: `url(${placeholderPhoto})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(10,27,51,0.88) 0%, rgba(10,27,51,0.55) 60%, rgba(10,27,51,0.35) 100%)",
          }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center md:px-6">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Not sure which route fits your situation?
          </h2>
          <p className="max-w-xl text-white/80">
            Book a consultation and we'll scope the right residency, incorporation, or compliance path for you.
          </p>
          <CtaButton to="/contact" size="lg">
            Book a Consultation
          </CtaButton>
        </div>
      </section>

      <TeamCarousel />
    </>
  );
}
