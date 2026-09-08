import { QueryState } from "@/components/common/QueryState";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TestimonialCard } from "@/components/common/TestimonialCard";
import { useTestimonialsQuery } from "@/lib/api/testimonials";

export function Testimonials() {
  const { data: testimonials, isLoading, isError, refetch } = useTestimonialsQuery();

  return (
    <section className="bg-surface-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <SectionHeading eyebrow="Client Feedback" title="What clients say" highlight="about working with DSD." />

        <div className="mt-10">
          <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials?.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </QueryState>
        </div>
      </div>
    </section>
  );
}
