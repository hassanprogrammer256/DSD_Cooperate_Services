import { BadgeCheck, Ban, Building2, Clock, FileX, Gavel, IdCard, Landmark, Plane, Siren } from "lucide-react";

import { CtaButton } from "@/components/common/CtaButton";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { RegulatoryPrimer } from "@/components/common/RegulatoryPrimer";
import heroImage from "@/assets/images/hero/legal_hero.jpg";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

// Sub-route of /immigration — deliberately not in the Navbar. Holds the regulatory-
// primer half of UAE Immigration Page.docx (pillars/authorities/penalties), kept
// separate from ImmigrationPage's marketing/services half so that page can stay a
// focused sales pitch while this one is the "read the actual law" deep dive — linked
// from ImmigrationPage, not duplicated on it. Shares RegulatoryPrimer with
// MOHREPage, since both source docs use the identical section template.
export function ImmigrationRegulationsPage() {
  useDocumentTitle("UAE Immigration Law");

  return (
    <>
      <PageHeroBanner
        image={heroImage}
        align="left"
        eyebrow="Immigration Law Compliance"
        title="Understanding UAE Immigration Law"
        description="The UAE's immigration framework governs how individuals and companies interact with entry, residence, and citizenship pathways — and carries real compliance obligations for sponsoring employers."
      >
        <CtaButton to="/immigration">View Our Immigration Services</CtaButton>
      </PageHeroBanner>

      <RegulatoryPrimer
        intro="The United Arab Emirates operates a strategic immigration framework designed to attract global talent, investors, and businesses while maintaining public security and regulatory compliance. Governed primarily by Federal Decree-Law No. 29 of 2021 (on the Entry and Residence of Foreigners) and its executive regulations, the legal system regulates how individuals and corporate entities interact with immigration services."
        pillars={[
          {
            icon: Building2,
            title: "Company Establishment Registration",
            description:
              "Before sponsoring foreign personnel, a registered company must obtain an Establishment Card from the relevant immigration authority — the company's immigration identity file, registering the business entity with the federal immigration portal to allow entry permit issuance, residence visa sponsorship, and official administrative clearance.",
          },
          {
            icon: Plane,
            title: "Entry Visas",
            description:
              "Short-term and multi-entry permits for tourism, business visits, job exploration, transit, or medical treatment.",
          },
          {
            icon: IdCard,
            title: "Residence Visas",
            description:
              "Long-term legal authorization enabling individuals to live and work in the UAE — employer-sponsored visas, self-sponsored 5-Year Green Visas for freelancers and skilled workers, and 10-Year Golden Visas for investors, entrepreneurs, and specialized talent.",
          },
          {
            icon: BadgeCheck,
            title: "Citizenship",
            description:
              "A selective statutory pathway allowing qualifying investors, doctors, scientists, and exceptional talents to acquire UAE citizenship under strict legal criteria.",
          },
        ]}
        authoritiesHeading="Regulatory Authorities"
        authorities={[
          {
            icon: Landmark,
            name: "ICP — Federal Authority for Identity, Citizenship, Customs & Port Security",
            description:
              "Manages federal immigration policy, entry/residence permits, and issues Establishment Cards across Abu Dhabi and the Northern Emirates.",
          },
          {
            icon: Landmark,
            name: "GDRFA — General Directorate of Residency and Foreigners Affairs",
            description:
              "The emirate-level immigration authority managing residency services, entry permits, and Establishment Card issuances specifically within Dubai.",
          },
        ]}
        penalties={[
          {
            icon: Ban,
            title: "Company Compliance & Misuse",
            description:
              "Operating or issuing entry permits under an establishment file for a company that does not conduct active, legitimate business activities can result in financial penalties up to AED 20,000, alongside system blacklisting.",
          },
          {
            icon: FileX,
            title: "Illegal Employment & Employer Fines",
            description:
              "Working under a tourist or visit visa is strictly prohibited. Employers hiring unauthorized personnel or failing to register workers properly face fines ranging from AED 100,000 to AED 1,000,000 per worker, alongside potential business closure.",
          },
          {
            icon: Clock,
            title: "Overstay Fines",
            description:
              "Staying beyond a visa's validity or grace period results in a standardized fine of AED 50 per day. Delay in renewing a company's Establishment Card past the 30-day grace period attracts an additional penalty.",
          },
          {
            icon: Gavel,
            title: "Forgery and Fraud",
            description:
              "Visa or document forgery carries a sentence of up to 10 years in prison, while providing false statements to authorities carries up to 6 months in prison plus heavy fines.",
          },
          {
            icon: Siren,
            title: "Deportation",
            description:
              "Authorities reserve the right to deport any foreign national — even those holding a valid residency — for reasons related to public interest, security, health, or lack of lawful means of subsistence.",
          },
        ]}
        sourceName="Federal Decree-Law No. 29 of 2021 on the Entry and Residence of Foreigners — ICP / GDRFA"
      />
    </>
  );
}
