import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { InsightCard } from "@/components/common/InsightCard";
import { QueryState } from "@/components/common/QueryState";
import placeholderPhoto from "@/assets/images/placeholders/placeholder-photo.svg";
import { useInsightsQuery } from "@/lib/api/insights";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function InsightsPage() {
  useDocumentTitle("Insights");
  const { data: insights, isLoading, isError, refetch } = useInsightsQuery();

  return (
    <>
      <PageHeroBanner
        image={placeholderPhoto}
        eyebrow="Insights"
        title="Residency & Compliance Insights"
        description="Articles on UAE residency pathways and compliance updates — written plainly, not as legal advice."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {insights?.map((article) => (
              <InsightCard key={article.slug} article={article} />
            ))}
          </div>
        </QueryState>
      </div>
    </>
  );
}
