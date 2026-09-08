import { Navigate, useParams } from "react-router-dom";

import { ChecklistCard } from "@/components/common/ChecklistCard";
import { CtaButton } from "@/components/common/CtaButton";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { QueryState } from "@/components/common/QueryState";
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
            <CtaButton to="/contact">Book a Consultation</CtaButton>
          </PageHeroBanner>

          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
            <p className="max-w-3xl text-text-secondary">{area.description}</p>

            <h2 className="mt-10 font-display text-xl font-semibold text-text-primary">Obligations</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {area.obligations.map((item) => (
                <ChecklistCard key={item}>{item}</ChecklistCard>
              ))}
            </div>

            {(area.notes || area.sourceName) && (
              <div className="mt-10 max-w-3xl border-t border-border pt-6">
                {area.notes && <p className="text-sm text-text-secondary">{area.notes}</p>}
                {area.sourceName && <p className="mt-2 text-xs text-text-muted">— {area.sourceName}</p>}
              </div>
            )}

            <p className="mt-10 max-w-3xl rounded-lg bg-info-light px-4 py-3 text-sm text-info">
              General guidance, not legal or tax advice — always confirm your specific obligations with a qualified
              professional.
            </p>
          </div>
        </>
      )}
    </QueryState>
  );
}
