import type { LucideIcon } from "lucide-react";

type PrimerItem = { icon: LucideIcon; title: string; description: string };
type Authority = { icon: LucideIcon; name: string; description: string };

type Props = {
  intro: string;
  pillarsHeading?: string;
  pillars: PrimerItem[];
  authoritiesHeading?: string;
  authorities: Authority[];
  penaltiesHeading?: string;
  penalties: PrimerItem[];
  sourceName: string;
};

// Shared "compliance primer" content block — intro, operational pillars, regulatory
// authority(ies), and legal compliance & penalties. Used by both MOHREPage and
// ImmigrationRegulationsPage, which are built from the same client-supplied docx
// template (Main Pillars & Corporate Integration / Regulatory Authority / Legal
// Compliance & Penalties) — one component, two content payloads, rather than
// duplicating this section shape twice. The penalty cards reuse CompliancePage's
// existing border-warning/bg-warning-light full-card treatment (see ui-registry.md's
// Phase 4 note) — the one other place on the site a warning tone covers a whole card,
// not just a badge, since these are genuine caution callouts, not routine content.
export function RegulatoryPrimer({
  intro,
  pillarsHeading = "Main Pillars & Corporate Integration",
  pillars,
  authoritiesHeading = "Regulatory Authority",
  authorities,
  penaltiesHeading = "Legal Compliance & Penalties",
  penalties,
  sourceName,
}: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
      <p className="max-w-3xl text-text-secondary">{intro}</p>

      <h2 className="mt-12 font-display text-xl font-semibold text-text-primary">{pillarsHeading}</h2>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {pillars.map((item) => (
          <div key={item.title} className="rounded-lg border border-border bg-surface p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
              <item.icon size={18} />
            </div>
            <p className="mt-3 font-display text-sm font-semibold text-text-primary">{item.title}</p>
            <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-xl font-semibold text-text-primary">{authoritiesHeading}</h2>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {authorities.map((authority) => (
          <div
            key={authority.name}
            className="flex items-start gap-3 rounded-lg border border-border bg-surface-secondary p-5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
              <authority.icon size={18} />
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-text-primary">{authority.name}</p>
              <p className="mt-1 text-sm text-text-secondary">{authority.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-xl font-semibold text-text-primary">{penaltiesHeading}</h2>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {penalties.map((item) => (
          <div key={item.title} className="flex items-start gap-3 rounded-lg border border-warning bg-warning-light p-3.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-warning">
              <item.icon size={14} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">{item.title}</p>
              <p className="mt-0.5 text-sm text-text-secondary">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 max-w-3xl border-t border-border pt-6">
        <p className="text-xs text-text-muted">— {sourceName}</p>
      </div>

      <p className="mt-6 max-w-3xl rounded-lg bg-info-light px-4 py-3 text-sm text-info">
        General guidance, not legal or tax advice — always confirm your specific obligations with a qualified
        professional.
      </p>
    </div>
  );
}
