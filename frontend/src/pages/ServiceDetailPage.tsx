import { Link, Navigate, useLocation, useParams } from "react-router-dom";

import { CtaButton } from "@/components/common/CtaButton";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { IncludedCard } from "@/components/common/IncludedCard";
import { InsightCard } from "@/components/common/InsightCard";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { ProcessSteps } from "@/components/common/ProcessSteps";
import { QueryState } from "@/components/common/QueryState";
import { SectionHeading } from "@/components/common/SectionHeading";
import { StatCounter } from "@/components/common/StatCounter";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { ApiError } from "@/lib/api/client";
import { useInsightsQuery } from "@/lib/api/insights";
import { canonicalServicePath, useServiceDetailQuery } from "@/lib/api/services";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { Testimonials } from "@/components/sections/Testimonials";

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const serviceQuery = useServiceDetailQuery(slug ?? "");
  const insightsQuery = useInsightsQuery();

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

  const relatedInsights = insightsQuery.data?.filter((article) => service?.relatedInsightSlugs.includes(article.slug)) ?? [];

  return (
    <QueryState
      isLoading={serviceQuery.isLoading}
      isError={serviceQuery.isError}
      onRetry={() => void serviceQuery.refetch()}
    >
      {service && (
        <>
          <PageHeroBanner image={service.heroImage} align="left" title={service.title} description={service.summary}>
            <h4 className=" max-w-2xl text-white/80">{service.description}</h4>
              <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
                <CtaButton to="/pricing">Get Started</CtaButton>
              
              </div>
          </PageHeroBanner>

          {service.stats.length > 0 && (
            <div className="bg-primary">
              <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-10 px-4 py-10 md:px-6">
                {service.stats.map((stat) => (
                  <StatCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
                ))}
              </div>
            </div>
          )}

          <ClosingCta />
          <Testimonials />
        </>
      )}
    </QueryState>
  );
}
