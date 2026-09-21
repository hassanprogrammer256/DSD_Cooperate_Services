import {
  Award,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck,
  FileText,
  Handshake,
  Landmark,
  MessageCircle,
  Scale,
  Search,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";

import { LeadForm } from "@/components/common/LeadForm";
import { Marquee } from "@/components/common/Marquee";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { ProcessSteps } from "@/components/common/ProcessSteps";
import { RelatedTopicLink } from "@/components/common/RelatedTopicLink";
import { SentenceText } from "@/components/common/SentenceText";
import { WhyChooseDsd } from "@/components/common/WhyChooseDsd";
import heroImage from "@/assets/images/hero/legal_hero.jpg";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const LSA_OWNER_CHECKLIST = [
  "Who the service agent is",
  "What services the agent provides",
  "What the agent is responsible for",
  "What the company remains responsible for",
  "The contractual terms",
  "Applicable fees",
  "Renewal arrangements",
  "Termination provisions",
  "Relevant licensing and regulatory requirements",
];

const STRUCTURE_QUESTIONS = [
  "Is a local partner required?",
  "Is an LSA required?",
  "Is a local arrangement optional?",
  "Can the business be fully foreign-owned?",
  "Does the specific activity have additional regulatory requirements?",
];

const DSD_SUPPORT_ITEMS = [
  { icon: Search, title: "Initial Business-Structure Assessment", description: "We review your proposed activity and structure before recommending a path forward." },
  { icon: FileCheck, title: "Activity & Licensing Review", description: "We check the requirements tied to your specific activity and licensing authority." },
  { icon: MessageCircle, title: "Explanation of Applicable Arrangements", description: "We explain, in plain terms, what local arrangement (if any) applies to your case." },
  { icon: FileText, title: "Identification of Relevant Documentation", description: "We identify exactly what documentation the process requires." },
  { icon: Handshake, title: "Coordination With the Appropriate Parties", description: "We coordinate with the parties relevant to your structure." },
  { icon: ClipboardCheck, title: "Preparation & Coordination of Agreements", description: "We help prepare and coordinate the applicable agreements." },
  { icon: Building2, title: "Licensing-Process Coordination", description: "We coordinate the licensing process from application to issuance." },
  { icon: Landmark, title: "Government-Related Administrative Support", description: "We manage the administrative side of dealing with government entities." },
  { icon: Award, title: "Renewal Coordination", description: "We track and coordinate renewals so nothing lapses unexpectedly." },
  { icon: Users, title: "Ongoing Corporate Support", description: "We remain available for corporate requirements after your structure is in place." },
];

const LSA_STEPS = [
  { step: "1", icon: MessageCircle, title: "Consultation", description: "We understand your business activity, proposed structure, nationality, ownership objectives and licensing requirements." },
  { step: "2", icon: Search, title: "Structure Review", description: "We assess whether a local partner, local sponsor, LSA or another structure is applicable." },
  { step: "3", icon: FileText, title: "Requirements", description: "We explain the documentation and information required to proceed." },
  { step: "4", icon: Settings, title: "Coordination", description: "Where applicable, DSD coordinates the relevant parties and administrative requirements." },
  { step: "5", icon: ClipboardCheck, title: "Agreement & Documentation", description: "The applicable service or agency documentation is prepared and coordinated in accordance with the relevant requirements." },
  { step: "6", icon: Building2, title: "Licensing & Registration", description: "We assist with the applicable licensing and registration procedures." },
  { step: "7", icon: Handshake, title: "Ongoing Support", description: "After setup, DSD can continue assisting with renewals, corporate administration, PRO services, compliance and other relevant requirements." },
];

const REMOTE_ACTIONS = [
  "Contacting us online",
  "Discussing your proposed business activity remotely",
  "Providing initial information digitally",
  "Sharing required documents electronically where permitted",
  "Reviewing proposed arrangements remotely",
  "Coordinating documentation digitally",
  "Receiving progress updates online",
];

const AVOID_ITEMS = [
  "Unnecessary ownership arrangements",
  "Incorrect assumptions about sponsorship",
  "Unexpected administrative costs",
  "Inappropriate company structures",
  "Delays caused by incomplete documentation",
];

const WHO_ITEMS = [
  "Starting a new UAE business",
  "Establishing a professional activity",
  "Expanding an international company into the UAE",
  "Setting up a foreign-company branch",
  "Reviewing an existing sponsorship arrangement",
  "Looking for a Local Service Agent",
  "Requiring ongoing corporate administration",
];

export function LocalSponsorshipPage() {
  useDocumentTitle("Local Sponsorship & Local Service Agent");

  return (
    <>
      <PageHeroBanner
        image={heroImage}
        align="left"
        eyebrow="Local Sponsorship"
        title="UAE Local Sponsorship & Local Service Agent"
        description={
          <SentenceText text="
          The term 'local sponsor' is commonly used in the UAE to describe certain arrangements involving a UAE national in connection with a business structure or specific regulated activity. However, it is important to understand that local sponsorship is not a universal requirement for every business in the UAE. The UAE has introduced significant reforms to foreign ownership, the Ministry of Economy & Tourism states that investors of all nationalities can establish and fully own companies in the UAE, subject to applicable laws and activity-specific restrictions. Therefore, whether a UAE national partner or other local arrangement is required should be determined based on the specific business activity, legal form, emirate, licensing authority and applicable regulations.

          A Local Service Agent (LSA) can be used in certain UAE business structures where the applicable rules require or permit the appointment of a local service agent. The role should not automatically be confused with a shareholder or business owner. For applicable arrangements, the service agent's role is generally connected to providing specified services and facilitating administrative or government-related requirements rather than participating in the company's commercial profits. The Ministry's published materials describe the obligations of an agent in relation to a foreign company as being limited to providing services to the company, without financial responsibility for the branch's business or activities.
          " />
        }
      />

      <Marquee
        phrases={[
          "The Right Structure First",
          "Local Partner vs. Local Service Agent",
          "Fully Foreign-Owned Where Permitted",
          "Foreign Company Branches",
          "Remote-Friendly Assessment",
        ]}
        ctaLabel="Request a Consultation"
        ctaTo="#lead-form"
      />


      {/* Local sponsorship vs LSA */}
      <div className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">
            Local Sponsorship vs. Local Service Agent
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold text-text-primary md:text-3xl">They Are Not the Same Thing</h2>
          <div className="mt-4 max-w-3xl text-text-secondary">
            <SentenceText text="One of the most important distinctions for investors is understanding the difference between a local partner/sponsor arrangement and a Local Service Agent (LSA). The Ministry of Economy & Tourism's current guidance confirms that a UAE national agent is not generally required for foreign companies establishing branches in the UAE. Consequently, the requirement should always be assessed against the current rules applicable to the particular company." />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-accent/30 bg-surface p-6">
              <Handshake size={24} className="text-primary" />
              <h3 className="mt-4 font-display text-lg font-bold capitalize text-accent">Local Partner / Sponsor</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Can involve ownership or participation in a company, depending on the legal structure and applicable requirements.
              </p>
            </div>
            <div className="rounded-xl border border-accent/30 bg-surface p-6">
              <FileCheck size={24} className="text-primary" />
              <h3 className="mt-4 font-display text-lg font-bold capitalize text-accent">Local Service Agent (LSA)</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Generally associated with certain professional structures or foreign-company branch arrangements, intended to provide specified services to the company rather than automatically giving the agent ownership of the business. The requirement depends on the structure and applicable regulations, so DSD assesses each case rather than assuming every client needs a local sponsor or agent.
              </p>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-lg font-bold capitalize text-accent">What This Means for Business Owners</h3>
              <p className="mt-2 text-sm text-text-secondary">An LSA arrangement should be clearly documented. Before entering into one, business owners should understand:</p>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {LSA_OWNER_CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold capitalize text-accent">We First Assess the Structure</h3>
              <p className="mt-2 text-sm text-text-secondary">Our team reviews the proposed setup and helps identify:</p>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {STRUCTURE_QUESTIONS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Remote support */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">
            Remote Local Sponsorship & LSA Support
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold text-text-primary md:text-3xl">Start the Process From Wherever You Are</h2>
          <p className="mt-4 text-text-secondary">
            Our service model is designed to make the initial process as remote and seamless as the applicable procedures allow. You can begin by:
          </p>
        </div>
        <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          {REMOTE_ACTIONS.map((item) => (
            <li key={item} className="flex items-start gap-3 text-text-secondary">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-10 max-w-3xl text-center text-sm text-text-secondary">
          <SentenceText text="Where a government authority, notary, bank, medical facility, immigration authority or other third party requires physical attendance, original documentation, biometric registration or another in-person step, we will identify that requirement clearly." />
        </div>
        <p className="mt-6 text-center font-display text-base font-semibold text-text-primary">
          Less Travel. Less Uncertainty. Better Coordination.
        </p>
      </div>

      {/* For foreign investors & branches */}
      <div className="bg-surface-secondary py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">
                Foreign Investors & Company Branches
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold text-text-primary md:text-3xl">
                Enter the UAE Market With Greater Clarity
              </h2>
              <div className="mt-4 text-text-secondary">
                <SentenceText text="International investors often hear different information about UAE local sponsorship. Some may be told that every mainland company requires a UAE national shareholder. Others may be told that no local involvement is ever required. Neither statement should be treated as a universal rule. The correct answer depends on the specific business structure, activity, licensing authority and current applicable regulations. The UAE Ministry of Economy & Tourism confirms that foreign investors can establish and fully own companies in the UAE, while also noting that certain sectors and activities can be subject to specific rules." />
              </div>
              <div className="mt-4 text-text-secondary">
                <SentenceText text="International companies considering a UAE branch may have different requirements from entrepreneurs establishing a new UAE company. The Ministry of Economy & Tourism provides dedicated procedures for foreign-company branch initial approval, registration, amendment, renewal and cancellation. Current Ministry guidance states that a UAE national agent is not required for foreign companies wishing to conduct activities in the UAE through a branch. Nevertheless, branch registration remains subject to the applicable licensing, documentation, regulatory and approval requirements." />
              </div>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold capitalize text-accent">DSD Helps You Understand Your Options</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Before establishing your company or branch, we help you examine the available structure and identify the requirements applicable to your business. This can help you avoid:
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {AVOID_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Why choose DSD */}
      <WhyChooseDsd
        eyebrow="UAE Local Sponsorship With DSD"
        title="Structured, Transparent & Professionally Coordinated"
        description="Where a local arrangement is applicable to your proposed business structure, DSD can assist with coordinating the relevant requirements. Our role is to help make the process clear from the beginning."
        items={DSD_SUPPORT_ITEMS}
        columns={5}
        note="Who is involved → Why they are involved → What their role is → What the agreement covers → What the applicable costs are → What happens next."
      />

      <ProcessSteps
        eyebrow="Local Service Agent Services"
        title="A Seamless Process From Consultation to Completion"
        steps={LSA_STEPS}
      />

      {/* Seamless support / who this is for */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">
            Seamless Local Sponsorship & LSA Support
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold text-text-primary md:text-3xl">
            From Initial Consultation to Ongoing Corporate Administration
          </h2>
          <p className="mt-4 text-text-secondary">Whether you are:</p>
        </div>
        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {WHO_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-3 text-text-secondary">
              <UserCheck size={18} className="mt-0.5 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-2xl text-center text-text-secondary">
          DSD Corporate Services can help you understand the applicable pathway and coordinate the relevant requirements.
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-center font-display text-lg font-semibold text-text-primary">
          Your Business Doesn't Need More Complexity. It Needs the Right Structure and the Right Support.
        </p>
      </div>

      {/* Lead form */}
      <section id="lead-form" className="mx-auto max-w-3xl scroll-mt-24 px-4 pb-16 md:px-6">
        <LeadForm
          defaultMainService="incorporation"
          title="Request a Consultation"
          description={
            <SentenceText text="Tell us your business activity, proposed structure and objectives and let DSD help you understand the next step." />
          }
        />
      </section>

      {/* Important note */}
      <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
        <p className="rounded-lg bg-info-light px-4 py-3 text-sm text-info">
          Important note: UAE ownership and local-agent requirements can vary according to the business activity, legal form, licensing authority, jurisdiction and applicable legislation. The UAE has substantially expanded foreign ownership opportunities and a UAE national sponsor or agent is not automatically required for every business. DSD Corporate Services can assist with the administrative and corporate-services process, but where a matter requires formal legal advice, clients should obtain advice from a UAE-licensed legal professional.
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
        <RelatedTopicLink
          icon={Scale}
          title="Explore UAE Business Incorporation"
          description="Choosing mainland or free zone, business activity and licensing, the setup decisions that shape your ownership options."
          to="/incorporation"
          ctaLabel="Visit Incorporation Hub"
        />
      </div>
    </>
  );
}
