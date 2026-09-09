import { LegalSection, type LegalSectionData } from "@/components/common/LegalSection";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const SECTIONS: LegalSectionData[] = [
  {
    heading: "Introduction",
    paragraphs: [
      'DSD Corporate Services ("DSD," "we," "us" or "our") respects your privacy and is committed to protecting the personal information entrusted to us.',
      "This Privacy Policy explains how we collect, use, store, disclose and protect personal information when you visit www.dsdcop.com, submit an enquiry or request a quotation, apply for or purchase our services, communicate with us, visit our office, act as a shareholder, director, manager, employee, representative or beneficial owner of one of our clients, or otherwise interact with DSD.",
      "For the purposes of applicable data-protection law, DSD Corporate Services will generally act as the controller of the personal information described in this Privacy Policy.",
    ],
  },
  {
    heading: "Personal information we collect",
    paragraphs: ["Depending on the nature of your enquiry or service, we may collect the following categories of personal information:"],
    list: [
      "Identity information — name, date and place of birth, nationality, gender, photograph, signature, passport, Emirates ID, visa and immigration information, and other government-issued identification",
      "Contact information — address, email, telephone number, emergency contact, and preferred communication method",
      "Corporate and professional information — company name and legal form, trade-licence information, business activities, shareholding, director/manager/authorised-signatory information, beneficial-ownership information, and constitutional documents",
      "Financial and transactional information — bank-account details, payment and invoice records, transaction references, source-of-funds or source-of-wealth information, and tax-registration information",
      "Service and communication information — enquiry details, services requested or purchased, contracts and quotations, correspondence, complaints and support records, and feedback",
      "Website and technical information — IP address, browser and device type, approximate location, pages visited, referral source, and cookie identifiers (see our Cookie Policy)",
      "Sensitive personal information — where necessary for a requested service or legal obligation, such as biometric, health, criminal-record, family or religious information",
    ],
  },
  {
    heading: "How we collect information",
    paragraphs: [
      "We may collect personal information directly from you; from a company, employer, agent or representative acting on your behalf; through website forms, emails, calls and messaging; from identification documents and application forms; from government and free-zone authorities and official portals; from banks, advisers and service providers; from publicly available registers; through cookies; and during compliance or due-diligence checks.",
      "If you provide personal information about another person, you confirm you are authorised to provide it and, where required, have informed that person about this Privacy Policy.",
    ],
  },
  {
    heading: "How we use personal information",
    paragraphs: ["We may process personal information to:"],
    list: [
      "Respond to enquiries, provide quotations, and verify your identity and eligibility",
      "Create and manage client records and provide company-formation and corporate-support services",
      "Prepare and submit applications, and communicate with licensing, immigration, tax, and free-zone authorities",
      "Coordinate services with banks and authorised third-party providers",
      "Prepare contracts, invoices, receipts, and payment records",
      "Conduct know-your-customer, sanctions, fraud-prevention, and other compliance checks",
      "Meet accounting, tax, regulatory, and record-keeping obligations",
      "Maintain and improve our website and services, and protect our systems against fraud or misuse",
      "Send service updates and, where permitted, marketing communications",
      "Establish, exercise, or defend legal rights, and comply with applicable laws and regulatory requests",
    ],
  },
  {
    heading: "Grounds for processing",
    paragraphs: [
      "Depending on the circumstances, we process personal information with your consent, to respond to your request before entering into an agreement, to perform a contract or provide a requested service, to comply with a legal or regulatory obligation, to protect public or data-subject interests, to establish or defend legal claims, or for legitimate business purposes appropriately balanced against individual rights.",
      "Where processing is based on consent, you may withdraw it at any time — withdrawal does not affect processing already lawfully completed. Refusing to provide required information may prevent us from accepting an engagement or providing the requested service.",
    ],
  },
  {
    heading: "Identity verification and compliance",
    paragraphs: [
      "Corporate-service applications may require detailed information about shareholders, directors, managers, employees, authorised representatives, and beneficial owners. DSD may verify this information using official documents, public records, government systems, and approved verification providers, and may conduct sanctions, politically-exposed-person, and fraud-prevention checks where required.",
      "We may refuse, suspend, or terminate a service where required information is not provided, appears inaccurate or fraudulent, identity cannot be verified, or a transaction presents unacceptable legal or compliance risk.",
    ],
  },
  {
    heading: "Disclosure of personal information",
    paragraphs: ["We may disclose personal information, where necessary and lawful, to:"],
    list: [
      "UAE federal or local government, immigration, labour, licensing, tax, and free-zone authorities",
      "Municipalities, embassies, and consulates",
      "Banks, insurers, and payment providers",
      "Lawyers, accountants, auditors, tax advisers, and translators",
      "Notaries, attestation providers, and document-clearing centres",
      "Technology, hosting, cybersecurity, and communications providers",
      "Courts, law-enforcement agencies, and regulators",
      "A prospective buyer, investor, or successor in connection with a lawful corporate transaction",
    ],
  },
  {
    heading: "International transfers",
    paragraphs: [
      "Some service providers, advisers, technology platforms, or authorities may process personal information outside the UAE. Where personal information is transferred internationally, we take reasonable steps to ensure the transfer is permitted and protected through an approved jurisdiction, contractual safeguards, your consent where appropriate, or another legally recognised mechanism.",
    ],
  },
  {
    heading: "Retention of information",
    paragraphs: [
      "We retain personal information only as long as reasonably necessary to provide the requested services, maintain accurate records, meet legal and regulatory requirements, resolve disputes, prevent fraud, and establish or defend legal claims. Retention periods vary by record type and applicable legal requirements. When information is no longer required, we take reasonable steps to securely delete, destroy, or anonymise it.",
    ],
  },
  {
    heading: "Information security",
    paragraphs: [
      "We use reasonable administrative, organisational, and technical safeguards designed to protect personal information against unauthorised access, accidental loss, improper disclosure, unlawful alteration, misuse, and destruction.",
      "No website, email service, or electronic storage system is completely secure. Avoid sending passports, Emirates IDs, banking details, or other sensitive documents through unverified channels, and always confirm payment instructions through an official DSD contact before transferring money.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "Our website may use cookies and similar technologies to operate securely, remember preferences, measure performance, and, where permitted, support advertising. Please read our Cookie Policy for further information.",
    ],
  },
  {
    heading: "Marketing communications",
    paragraphs: [
      "Where permitted, we may use your contact information to send information about DSD services, business updates, or promotional offers. You may opt out at any time using the unsubscribe option, by replying with an opt-out request, or by contacting info@dsdcop.com. Opting out of marketing will not prevent essential messages about an active enquiry, application, payment, or service.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: ["Subject to applicable law and relevant exceptions, you may have the right to:"],
    list: [
      "Obtain information about how your personal information is processed, and request access to it",
      "Receive a copy of certain information in a structured, machine-readable format",
      "Request correction, deletion, or restriction of processing",
      "Object to or stop direct marketing, and withdraw consent",
      "Request transfer of information where legally applicable",
      "Submit a complaint to the competent data-protection authority",
    ],
  },
  {
    heading: "Automated decision-making",
    paragraphs: [
      "DSD does not intend to make decisions producing significant legal effects solely through automated processing unless the process is lawful, necessary, and appropriately disclosed. Where required, meaningful human review will be available.",
    ],
  },
  {
    heading: "Children's information",
    paragraphs: [
      "Our website and general corporate services are not directed to children. We do not knowingly collect personal information directly from children for marketing purposes.",
    ],
  },
  {
    heading: "External websites",
    paragraphs: [
      "Our website may contain links to government portals and third-party websites. DSD does not control the privacy or security practices of those websites — review each site's own privacy policy before providing personal information.",
    ],
  },
  {
    heading: "Updates to this Privacy Policy",
    paragraphs: [
      "We may update this Privacy Policy to reflect changes in our services, website functions, or applicable requirements. The updated version will be published on this page with a revised effective date.",
    ],
  },
  {
    heading: "Contact us",
    paragraphs: [
      "For questions, requests, or complaints concerning personal information, contact us using the details below. Requests may also be submitted to info@dsdcop.com.",
    ],
  },
];

export function PrivacyPolicyPage() {
  useDocumentTitle("Privacy Policy");

  return (
    <section className="mx-auto max-w-3xl px-4 py-24 md:px-6">
      <h1 className="font-display text-3xl font-bold text-text-primary">Privacy Policy</h1>
      <p className="mt-2 text-sm text-text-muted">Effective date: 26 August 2026</p>

      {SECTIONS.map((section, i) => (
        <LegalSection key={section.heading} index={i + 1} {...section} />
      ))}

      <p className="mt-10 border-t border-border pt-6 text-sm text-text-muted">
        DSD Corporate Services · 1st Floor, Office 06, Al Habeb Building, Umm Hurair Street, Oud Metha, Dubai, United
        Arab Emirates · +971 58 588 9033 · info@dsdcop.com
      </p>
    </section>
  );
}
