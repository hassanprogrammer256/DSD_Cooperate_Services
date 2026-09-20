import { Navigate, useParams } from "react-router-dom";

import { IncludedCard } from "@/components/common/IncludedCard";
import { Marquee } from "@/components/common/Marquee";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { QueryState } from "@/components/common/QueryState";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { ApiError } from "@/lib/api/client";
import { useComplianceAreaDetailQuery } from "@/lib/api/compliance";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function ComplianceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: area, isLoading, isError, error, refetch } = useComplianceAreaDetailQuery(slug ?? "");

  useDocumentTitle(area?.title ?? "Compliance");

  if (error instanceof ApiError && error.status === 404) {
    return <Navigate to="/compliance" replace />;
  }

  return (
    <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
      {area && (
        <>
          <PageHeroBanner image={area.heroImage} align="left" title={area.title} description={area.summary}>
            <p className="max-w-2xl text-white/80">{area.description}</p>
          </PageHeroBanner>

          <Marquee
            phrases={[
              "Licensing & Renewals Support",
              "Documentation Coordination",
              "Remote-Friendly Compliance",
              "Ongoing Corporate Support",
              "Stay Ahead Of Requirements",
            ]}
            ctaLabel="Book a Consultation"
            ctaTo="/contact"
          />

          {area.included.length > 0 && (
            <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
              <h2 className="font-display text-2xl font-bold capitalize text-accent md:text-3xl">What's Included</h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {area.included.map((item, index) => (
                  <IncludedCard key={item.title} item={item} index={index} />
                ))}
              </div>

              {(area.notes || area.sourceName) && (
                <div className="mt-10 max-w-3xl border-t border-border pt-6">
                  {area.notes && <p className="text-sm text-text-secondary">{area.notes}</p>}
                  {area.sourceName && <p className="mt-2 text-xs text-text-muted">Source: {area.sourceName}</p>}
                </div>
              )}

              <p className="mt-10 max-w-3xl rounded-lg bg-info-light px-4 py-3 text-sm text-info">
                General guidance, not legal or tax advice, always confirm your specific obligations with a
                qualified professional.
              </p>
            </div>
          )}

          <ClosingCta />
        </>
      )}
    </QueryState>
  );
}
