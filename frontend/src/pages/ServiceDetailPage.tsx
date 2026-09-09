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
            <CtaButton to="/contact">Book a Consultation</CtaButton>
            <Link
              to="/pricing"
              className="rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:border-white"
            >
              View Pricing
            </Link>
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

          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
            <div className="rounded-lg bg-navy-elevated px-6 py-12 text-center md:px-10 md:py-16">
          
              <h2 className="mt-2 font-display text-2xl font-bold text-accent md:text-3xl">{service.philosophy_title}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-white/80">{service.description}</p>
              <div className="mt-6">
                <CtaButton to="/pricing">Get Started</CtaButton>
              </div>
            </div>

            <h2 className="mt-14 font-display text-xl font-semibold text-text-primary">What's Included</h2>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {service.included.map((item, index) => (
                <IncludedCard key={item.title} item={item} index={index} />
              ))}
            </div>

            <ProcessSteps
              steps={service.process}
              title={`How We Help You Reach Your ${service.title} Goals`}
            />

            {service.faqs.length > 0 && (
              <div className="mt-14">
                <SectionHeading title="Frequently Asked" highlight="Questions" />
                <div className="mx-auto mt-8 max-w-3xl">
                  <FaqAccordion faqs={service.faqs} />
                </div>
              </div>
            )}

            {relatedInsights.length > 0 && (
              <>
                <h2 className="mt-14 font-display text-xl font-semibold text-text-primary">Related Insights</h2>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedInsights.map((article) => (
                    <InsightCard key={article.slug} article={article} />
                  ))}
                </div>
              </>
            )}
          </div>

          <ClosingCta />
        </>
      )}
    </QueryState>
  );
}
