import { CompanyLogoMarquee } from "@/components/common/CompanyLogoMarquee";
import { QueryState } from "@/components/common/QueryState";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TestimonialsCarousel } from "@/components/common/TestimonialsCarousel";
import { useTestimonialsQuery } from "@/lib/api/testimonials";

export function Testimonials() {
  const { data: testimonials, isLoading, isError, refetch } = useTestimonialsQuery();

  return (
    <section className="bg-surface-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <SectionHeading eyebrow="Client Feedback" title="What clients say about working with DSD." highlight="" />

        <div className="mt-10">
          <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
            <TestimonialsCarousel testimonials={testimonials ?? []} />
          </QueryState>
        </div>
      </div>

      <div className="border-t border-border py-10">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-text-muted">
          Trusted by teams from
        </p>
        <div className="mt-6">
          <CompanyLogoMarquee />
        </div>
      </div>
    </section>
  );
}
