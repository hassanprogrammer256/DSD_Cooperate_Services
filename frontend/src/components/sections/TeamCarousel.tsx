import { useRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { QueryState } from "@/components/common/QueryState";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TeamMemberCard } from "@/components/common/TeamMemberCard";
import { useTeamQuery } from "@/lib/api/team";

const CARD_SCROLL_WIDTH = 304; // md:w-72 (288px) + gap-4 (16px)

export function TeamCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: team, isLoading, isError, refetch } = useTeamQuery();

  function scrollBy(direction: -1 | 1) {
    scrollRef.current?.scrollBy({ left: direction * CARD_SCROLL_WIDTH, behavior: "smooth" });
  }

  return (
    <section id="team" className="scroll-mt-24 bg-surface-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="flex items-center justify-between gap-4">
          <SectionHeading align="left" eyebrow="Our People" title="Meet the" highlight="Team." />
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll team left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-primary hover:border-primary"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll team right"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-primary hover:border-primary"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-8">
          <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
            <div ref={scrollRef} className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
              {team?.map((member) => (
                <TeamMemberCard key={member.slug} member={member} />
              ))}
            </div>
          </QueryState>
        </div>
      </div>
    </section>
  );
}
