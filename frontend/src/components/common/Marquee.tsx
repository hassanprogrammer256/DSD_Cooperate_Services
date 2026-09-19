import { CtaButton } from "@/components/common/CtaButton";

type Props = {
  phrases: string[];
  ctaLabel: string;
  ctaTo: string;
};

// Infinite-scroll text strip that sits right under a page's hero, paired with a
// static CTA that never moves — same pure-CSS .animate-marquee technique as
// CompanyLogoMarquee (see index.css), just with text instead of logos. The phrase
// list renders twice back-to-back in one flex track translated by exactly -50%,
// so the loop never visibly resets. The track is aria-hidden since it's a decorative
// repeating loop; the sr-only paragraph carries the real content once for
// screen readers instead of announcing every duplicate.
export function Marquee({ phrases, ctaLabel, ctaTo }: Props) {
  const track = [...phrases, ...phrases];

  return (
    <section className="border-y border-border bg-surface-secondary">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 md:gap-6 md:px-6">
        <div
          className="min-w-0 flex-1 overflow-hidden"
          style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
        >
          <div className="flex w-max items-center gap-3 whitespace-nowrap animate-marquee" aria-hidden="true">
            {track.map((phrase, index) => (
              <span key={index} className="flex items-center gap-3">
                <span className="font-display text-xs font-semibold text-text-primary md:text-sm">{phrase}</span>
                <span className="text-accent">•</span>
              </span>
            ))}
          </div>
          <p className="sr-only">{phrases.join(". ")}</p>
        </div>
        <CtaButton to={ctaTo} size="sm" className="shrink-0">
          {ctaLabel}
        </CtaButton>
      </div>
    </section>
  );
}
