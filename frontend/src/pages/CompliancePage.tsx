import { Building, ClipboardCheck, Clock, FileCheck, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

import { ChecklistCard } from "@/components/common/ChecklistCard";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { QueryState } from "@/components/common/QueryState";
import { SectionHeading } from "@/components/common/SectionHeading";
import placeholderPhoto from "@/assets/images/placeholders/placeholder-photo.svg";
import { useComplianceAreasQuery } from "@/lib/api/compliance";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const REQUIREMENTS_DEPEND_ON = [
  "Your business activity (regulated activities carry extra obligations)",
  "Your legal structure — mainland vs. free zone",
  "Your annual revenue and taxable turnover",
  "Whether you employ UAE-resident staff",
  "Your ownership and shareholding structure",
];

const LIFECYCLE_STAGES = [
  { icon: Building, title: "Setup", description: "Trade licence issued, initial registrations opened." },
  { icon: ClipboardCheck, title: "Registration", description: "Corporate Tax, VAT, and UBO register filed against your deadlines." },
  { icon: Clock, title: "Ongoing Compliance", description: "Recurring returns filed, books kept current, AML obligations met." },
  { icon: FileCheck, title: "Renewal & Amendments", description: "Trade licence renewed annually; changes filed as they happen." },
];

const CONCLUSION_CHECKLIST = [
  "Confirm your Corporate Tax and VAT registration deadlines against your own licence dates",
  "Keep bookkeeping current rather than reconstructing it under deadline pressure",
  "Review your UBO register whenever ownership or control changes",
  "Track your trade licence renewal date well ahead of expiry",
];

export function CompliancePage() {
  useDocumentTitle("Compliance");
  const { data: complianceAreas, isLoading, isError, refetch } = useComplianceAreasQuery();

  return (
    <>
      <PageHeroBanner
        image={placeholderPhoto}
        eyebrow="Compliance"
        title="Staying Compliant in the UAE"
        description="A plain-English primer on the obligations that come with operating a UAE business — corporate tax, VAT, UBO, AML, licence renewal, and bookkeeping."
      />

      <div className="mx-auto max-w-3xl px-4 pt-10 md:px-6">
        <p className="rounded-lg bg-info-light px-4 py-3 text-center text-sm text-info">
          General guidance, not legal or tax advice — always confirm your specific obligations with a qualified
          professional. Nothing here substitutes for individual professional counsel.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <SectionHeading
          eyebrow="What Compliance Covers"
          title="Compliance isn't one obligation —"
          highlight="it's several, running in parallel."
          description="A UAE trade licence carries tax, reporting, and governance obligations that exist independently of each other and don't share a single deadline."
        />

        <h2 className="mt-14 text-center font-display text-xl font-semibold text-text-primary">
          What Your Requirements Depend On
        </h2>
        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
          {REQUIREMENTS_DEPEND_ON.map((item) => (
            <ChecklistCard key={item}>{item}</ChecklistCard>
          ))}
        </div>

        <h2 className="mt-16 text-center font-display text-xl font-semibold text-text-primary">
          Compliance Areas
        </h2>
        <div className="mt-6">
          <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {complianceAreas?.map((area) => (
                <Link
                  key={area.slug}
                  to={`/compliance/${area.slug}`}
                  className="rounded-xl border border-border bg-surface p-5 hover:border-primary"
                >
                  <p className="font-display text-base font-semibold text-text-primary">{area.title}</p>
                  <p className="mt-2 text-sm text-text-secondary">{area.summary}</p>
                </Link>
              ))}
            </div>
          </QueryState>
        </div>

        <h2 className="mt-16 text-center font-display text-xl font-semibold text-text-primary">
          The Compliance Lifecycle
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LIFECYCLE_STAGES.map((stage) => (
            <div key={stage.title} className="rounded-xl border border-border bg-surface p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <stage.icon size={20} />
              </div>
              <p className="mt-3 font-display text-base font-semibold text-text-primary">{stage.title}</p>
              <p className="mt-2 text-sm text-text-secondary">{stage.description}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl rounded-xl border border-warning bg-warning-light p-6">
          <div className="flex items-center gap-3">
            <ShieldAlert size={22} className="text-warning" />
            <p className="font-display text-base font-semibold text-text-primary">Consequences of Non-Compliance</p>
          </div>
          <p className="mt-3 text-sm text-text-secondary">
            Missed deadlines carry administrative penalties independent of whether any tax was actually owed. An
            expired trade licence can also affect immigration/establishment card standing and banking
            relationships — the risk isn't limited to the specific filing that was missed.
          </p>
        </div>

        <h2 className="mt-16 text-center font-display text-xl font-semibold text-text-primary">
          A Practical Starting Checklist
        </h2>
        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
          {CONCLUSION_CHECKLIST.map((item) => (
            <ChecklistCard key={item} tone="accent">
              {item}
            </ChecklistCard>
          ))}
        </div>
      </div>
    </>
  );
}
