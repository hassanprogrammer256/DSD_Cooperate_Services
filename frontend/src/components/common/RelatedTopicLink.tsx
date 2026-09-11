import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  ctaLabel: string;
};

// Small "related topic" link banner — connects a page to a related landing page
// that isn't part of the Navbar (MOHRE/Immigration) without building a full nav
// entry for it. Reused on CompliancePage, ServicesPage (Residency), and
// ImmigrationPage — the same "three similar uses" threshold ui-registry.md's
// LegalSection precedent already used to justify a shared component.
export function RelatedTopicLink({ icon: Icon, title, description, to, ctaLabel }: Props) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-surface-secondary p-5 transition-colors hover:border-primary"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
          <Icon size={20} />
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-text-primary">{title}</p>
          <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
        </div>
      </div>
      <span className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-primary group-hover:text-accent sm:flex">
        {ctaLabel} <ArrowUpRight size={16} />
      </span>
    </Link>
  );
}
