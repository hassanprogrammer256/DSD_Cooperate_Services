import { Ban, Building2, CreditCard, FileX, IdCard, Landmark, Scale, Siren, Users, Wallet } from "lucide-react";

import { CtaButton } from "@/components/common/CtaButton";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { RegulatoryPrimer } from "@/components/common/RegulatoryPrimer";
import { RelatedTopicLink } from "@/components/common/RelatedTopicLink";
import heroImage from "@/assets/images/hero/legal_hero.jpg";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

// Direct-link landing page — deliberately not in the Navbar's top-level items (per
// explicit client instruction). Reachable from the Home hero's pillar quick-links,
// a contextual link on /compliance, and the Footer's Quick Links. Content condensed
// (not invented) from the client-supplied MOHRE.docx brief — see progress-tracker.md.
// No LeadForm here: the source doc is a compliance primer only, with no services
// pitch of its own, so none is invented — same "detail page, not a hub" shape as
// ComplianceDetailPage, which also has no embedded LeadForm.
export function MOHREPage() {
  useDocumentTitle("MOHRE Compliance");

  return (
    <>
      <PageHeroBanner
        image={heroImage}
        align="left"
        eyebrow="Labour Law Compliance"
        title="MOHRE Compliance & UAE Labour Law"
        description="The Ministry of Human Resources and Emiratisation (MOHRE) governs employment relationships, work permits, and workplace compliance across the UAE private sector."
      >
        <CtaButton to="/contact">Book a Consultation</CtaButton>
      </PageHeroBanner>

      <RegulatoryPrimer
        intro="The Ministry of Human Resources and Emiratisation (MOHRE) operates the UAE's labor framework, governing employment relationships, labor quotas, work permits, and workplace compliance. Governed primarily by Federal Decree-Law No. 33 of 2021 (as amended by Federal Decree-Law No. 9 of 2024), the system regulates private-sector employer obligations and employee rights across the UAE."
        pillars={[
          {
            icon: Building2,
            title: "Company Labor File & Establishment Card",
            description:
              "Once a business receives its immigration card, it must open a Labor Establishment File with MOHRE — generating the company's labor profile and enabling it to apply for employee labor quotas, issue work permits, and register electronic labor contracts.",
          },
          {
            icon: IdCard,
            title: "Work Permits",
            description:
              "Authorizations issued to employees before residency visa stamping. MOHRE issues full-time, part-time, temporary, freelance, and remote work permits.",
          },
          {
            icon: Wallet,
            title: "Wage Protection System (WPS)",
            description:
              "A mandatory electronic salary transfer system monitored by MOHRE to ensure employers pay salaries on time and through approved financial institutions.",
          },
          {
            icon: Users,
            title: "Emiratisation (Nafis Program)",
            description:
              "Statutory quota mandates requiring private-sector establishments with 50+ employees to meet specific annual targets for hiring UAE nationals into skilled roles.",
          },
        ]}
        authorities={[
          {
            icon: Landmark,
            name: "MOHRE — Ministry of Human Resources and Emiratisation",
            description:
              "The federal ministry overseeing labor relations, issuing work permits, managing employee-employer disputes, setting labor classifications, and monitoring private-sector workplace compliance nationwide.",
          },
        ]}
        penalties={[
          {
            icon: Ban,
            title: "Illegal Employment & Unpermitted Work",
            description:
              "Employing a worker without a valid MOHRE work permit, or issuing a permit and leaving the employee without actual work, incurs fines ranging from AED 100,000 to AED 1,000,000 per violation.",
          },
          {
            icon: FileX,
            title: "Fictitious Emiratisation",
            description:
              "Artificially hiring UAE nationals to meet regulatory quotas without genuine job duties carries fines between AED 100,000 and AED 1,000,000 per fake employee, alongside mandatory repayment of government subsidies.",
          },
          {
            icon: CreditCard,
            title: "Wage Protection System (WPS) Non-Compliance",
            description:
              "Failure to pay salaries on time triggers automated actions ranging from warning alerts to work permit freezes, administrative fines, and referral to judicial enforcement.",
          },
          {
            icon: Scale,
            title: "Dispute Resolution Authority",
            description:
              "Under Article 54, MOHRE has the legal authority to issue binding executive decisions on labor disputes involving claims up to AED 50,000, without requiring lengthy court litigation.",
          },
          {
            icon: Siren,
            title: "Safety & Midday Break Violations",
            description:
              "Breaching mandatory workplace safety rules or the annual summer midday break restriction results in fines starting at AED 5,000 per worker, capped at AED 50,000 per incident.",
          },
        ]}
        sourceName="Federal Decree-Law No. 33 of 2021 on the Regulation of Labour Relations, as amended by Federal Decree-Law No. 9 of 2024 — Ministry of Human Resources and Emiratisation (MOHRE)"
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <RelatedTopicLink
          icon={Scale}
          title="Explore UAE Compliance Essentials"
          description="Corporate tax, VAT, UBO filing, and other regulatory areas DSD supports beyond labour law."
          to="/compliance"
          ctaLabel="Visit Compliance Hub"
        />
      </div>
    </>
  );
}
