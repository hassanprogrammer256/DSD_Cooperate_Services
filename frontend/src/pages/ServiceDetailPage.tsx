import { Navigate, useLocation, useParams } from "react-router-dom";

import { IncludedCard } from "@/components/common/IncludedCard";
import { Marquee } from "@/components/common/Marquee";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { QueryState } from "@/components/common/QueryState";
import { StatCounter } from "@/components/common/StatCounter";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { ApiError } from "@/lib/api/client";
import { canonicalServicePath, useServiceDetailQuery } from "@/lib/api/services";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const serviceQuery = useServiceDetailQuery(slug ?? "");


  const service = serviceQuery.data;
  useDocumentTitle(service?.title ?? "Service");

  if (serviceQuery.error instanceof ApiError && serviceQuery.error.status === 404) {
    return <Navigate to="/residency" replace />;
  }

  if (service) {
    const canonicalPath = canonicalServicePath(service);
    if (location.pathname !== canonicalPath) {
      return <Navigate to={canonicalPath} replace />;
    }
  }


  return (
    <QueryState
      isLoading={serviceQuery.isLoading}
      isError={serviceQuery.isError}
      onRetry={() => void serviceQuery.refetch()}
    >
      {service && (
        <>
          <PageHeroBanner image={service.heroImage} align="left" title={service.title} description={service.summary}>
            {service.philosophy_title && (
              <p className="max-w-2xl font-display text-2xl font-semibold leading-snug text-white md:text-3xl">
                {service.philosophy_title}
              </p>
            )}
            <p className="max-w-2xl text-white/80">{service.description}</p>
            {service.stats.length > 0 && (
              <div className="flex flex-wrap justify-center gap-8 lg:justify-start">
                {service.stats.map((stat) => (
                  <StatCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
                ))}
              </div>
            )}
          </PageHeroBanner>

          <Marquee
            phrases={[
              "Handled By One Advisory Team",
              "Remote-Friendly Process",
              "Transparent Documentation",
              "Ongoing Support After Completion",
              "Start From Wherever You Are",
            ]}
            ctaLabel={service.ctaLabel || (service.pillar === "business-incorporation" ? "Start Your Setup" : "Get Started")}
            ctaTo="/pricing"
          />

          {service.included.length > 0 && (
            <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
              <h2 className="font-display text-2xl font-bold capitalize text-accent md:text-3xl">What's Included</h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {service.included.map((item, index) => (
                  <IncludedCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          )}

          <ClosingCta />
        </>
      )}
    </QueryState>
  );
}
