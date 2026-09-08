import { Link, Navigate, useParams } from "react-router-dom";

import { InsightCard } from "@/components/common/InsightCard";
import { QueryState } from "@/components/common/QueryState";
import { ApiError } from "@/lib/api/client";
import { useInsightDetailQuery, useInsightsQuery } from "@/lib/api/insights";
import { useServicesQuery } from "@/lib/api/services";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function InsightDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const articleQuery = useInsightDetailQuery(slug ?? "");
  const insightsQuery = useInsightsQuery();
  const servicesQuery = useServicesQuery();

  const article = articleQuery.data;
  useDocumentTitle(article?.title ?? "Insight");

  if (articleQuery.error instanceof ApiError && articleQuery.error.status === 404) {
    return <Navigate to="/insights" replace />;
  }

  const relatedServices = servicesQuery.data?.filter((service) => article?.relatedServiceSlugs.includes(service.slug)) ?? [];
  const relatedInsights = insightsQuery.data?.filter((item) => article?.relatedInsightSlugs.includes(item.slug)) ?? [];

  return (
    <QueryState
      isLoading={articleQuery.isLoading}
      isError={articleQuery.isError}
      onRetry={() => void articleQuery.refetch()}
    >
      {article && (
        <>
          <img src={article.coverImage} alt={article.title} className="h-64 w-full object-cover md:h-96" />

          <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">{article.category}</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-text-primary md:text-4xl">{article.title}</h1>
            <p className="mt-2 font-mono text-sm text-text-muted">
              {new Date(article.publishDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {article.body.map((paragraph, index) => (
                <p key={index} className="text-text-secondary">
                  {paragraph}
                </p>
              ))}
            </div>

            {article.touchesCompliance && (
              <p className="mt-10 rounded-lg bg-info-light px-4 py-3 text-sm text-info">
                General guidance, not legal or tax advice — always confirm your specific obligations with a qualified
                professional.
              </p>
            )}

            {(relatedServices.length > 0 || relatedInsights.length > 0) && (
              <div className="mt-14 border-t border-border pt-10">
                {relatedServices.length > 0 && (
                  <>
                    <h2 className="font-display text-lg font-semibold text-text-primary">Related Services</h2>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {relatedServices.map((service) => (
                        <li key={service.slug}>
                          <Link
                            to={`/services/${service.slug}`}
                            className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-primary hover:border-primary"
                          >
                            {service.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {relatedInsights.length > 0 && (
                  <>
                    <h2 className="mt-8 font-display text-lg font-semibold text-text-primary">Related Insights</h2>
                    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {relatedInsights.map((item) => (
                        <InsightCard key={item.slug} article={item} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </article>
        </>
      )}
    </QueryState>
  );
}
