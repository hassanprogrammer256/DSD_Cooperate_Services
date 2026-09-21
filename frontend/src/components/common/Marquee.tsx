import { CtaButton } from "@/components/common/CtaButton";

type Props = {
  phrases: string[];
  ctaLabel: string;
  ctaTo: string;
};

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
                <span className="font-display text-xs font-semibold tracking-wide text-text-primary md:text-sm">{phrase}</span>
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
