import { LegalSection, type LegalSectionData } from "@/components/common/LegalSection";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const SECTIONS: LegalSectionData[] = [
  {
    heading: "General information",
    paragraphs: [
      "The information provided on this Website is for general informational and promotional purposes only. It is intended to give an overview of DSD Corporate Services, our services, and general business-related matters in the United Arab Emirates (\"UAE\").",
      "While we take reasonable steps to keep the information on this Website accurate and up to date, we do not represent or warrant that all information is complete, accurate, error-free, or suitable for any particular person's circumstances.",
      "Business-licensing requirements, immigration procedures, government fees, free-zone regulations, tax rules, document requirements and processing times are set by third-party authorities and may change without prior notice to DSD or to users of this Website.",
    ],
  },
  {
    heading: "No legal, tax, financial or investment advice",
    paragraphs: [
      "Nothing on this Website constitutes legal, tax, accounting, financial, banking, immigration or investment advice, and nothing on this Website should be relied upon as such.",
      "Information published on this Website is not a substitute for advice from a qualified and appropriately licensed lawyer, tax adviser, accountant, financial adviser, or other regulated professional. Where specialised professional advice is required, clients and prospective clients should obtain independent advice appropriate to their own circumstances before making any decision or entering into any transaction.",
      "DSD Corporate Services is not a law firm, accounting firm, bank, investment adviser, or government authority, unless a specific regulated activity is expressly stated on our trade licence and confirmed to the client in writing.",
    ],
  },
  {
    heading: "No professional relationship created",
    paragraphs: [
      "Accessing this Website, submitting an enquiry, downloading materials, or otherwise communicating with DSD through this Website does not, by itself, create a client, agency, fiduciary, partnership, employment or professional-adviser relationship between the user and DSD.",
      "A formal service relationship with DSD begins only once DSD has accepted the engagement, the required due-diligence and compliance checks have been completed to DSD's satisfaction, the parties have agreed on the scope of services, fees and conditions, and a service agreement, quotation, engagement letter or other written confirmation has been issued by DSD and accepted by the client.",
    ],
  },
  {
    heading: "Government and regulatory independence",
    paragraphs: [
      "DSD Corporate Services is an independent, privately owned corporate-services provider, registered and licensed under the Ajman NuVentures Centre Free Zone (\"ANCFZ\"), Emirate of Ajman. Beyond that licensing relationship, DSD is not part of, affiliated with, sponsored by, or endorsed by the UAE Federal Government, the Government of Dubai or Ajman, any other free-zone authority, immigration or naturalisation authority, municipality, licensing authority, embassy, consulate, bank, or any other public or private institution, unless expressly stated in writing by DSD.",
      "References on this Website to government authorities, free zones, banks, third-party websites, trademarks, or services are provided for identification and informational purposes only and do not imply any official partnership, endorsement, sponsorship or guarantee.",
    ],
  },
  {
    heading: "No guarantee of applications or approvals",
    paragraphs: [
      "DSD may assist clients with company formation, licence applications, visa or immigration-related documentation, corporate administration and other business-support services, subject to the activities permitted under its trade licence. However, DSD does not control and cannot guarantee:",
    ],
    list: [
      "Trade-name reservations, or initial or final business approvals",
      "Licence issuance, renewal or amendment",
      "Visa, work permit or immigration approval, or security/background clearance",
      "Bank-account opening or banking approval",
      "Tax registration or tax-authority decisions",
      "Free-zone or mainland authority decisions, or government processing times",
      "Availability of particular business activities, or approval of premises, quotas or employee allocations",
      "The outcome of any application submitted to a third party",
    ],
  },
  {
    heading: "Client responsibilities",
    paragraphs: [
      "Clients are responsible for providing complete, accurate, authentic and current information and documentation, including facts concerning shareholders, directors, managers and beneficial owners; nationality and residency status; proposed business activities; source of funds and wealth; and any criminal, regulatory or sanctions matters.",
      "DSD is not responsible for delays, rejection, penalties, losses, or other consequences resulting from inaccurate, incomplete, misleading, fraudulent, or late information supplied by a client. Clients remain responsible for ensuring their proposed and ongoing activities comply with applicable laws, licence conditions, tax obligations, employment requirements and regulatory approvals.",
    ],
  },
  {
    heading: "Compliance, due diligence and sanctions",
    paragraphs: [
      "As a free zone-licensed provider of corporate, company-formation and related business services, DSD carries out activities that fall within the scope of Designated Non-Financial Businesses and Professions (\"DNFBPs\") under Federal Decree-Law No. 20 of 2018 on Anti-Money Laundering and Combating the Financing of Terrorism and Illegal Organisations, as amended, which applies across the UAE, including within free zones such as ANCFZ.",
      "Where applicable, DSD is required to carry out customer due diligence, verify the identity of clients, shareholders, directors and beneficial owners, screen clients against applicable sanctions lists, and report suspicious activity to the competent authorities.",
      "DSD reserves the right, at its sole discretion, to decline, delay, suspend or terminate an engagement, application or transaction where a client's information cannot be verified or a compliance, sanctions, or source-of-funds concern arises, and shall not be liable for any loss arising from such a decision.",
    ],
  },
  {
    heading: "Fees and quotations",
    paragraphs: [
      "Any price, package, cost estimate or timeline displayed on this Website is indicative only, unless expressly confirmed in a written quotation or service agreement.",
      "Government fees, immigration charges, licence fees, establishment-card charges, medical examinations, Emirates ID fees, insurance, office rent, Ejari, deposits, translations, attestations, courier charges, banking charges, taxes and third-party professional fees may be charged separately and may change without prior notice.",
      "Unless expressly stated otherwise, payments made to government authorities and third parties are subject to their own cancellation and refund policies. DSD cannot guarantee the refund of amounts paid to another organisation.",
    ],
  },
  {
    heading: "Processing times",
    paragraphs: [
      "Any processing time communicated through this Website or by a DSD representative is an estimate based on the information available at that time. Processing may be affected by government working hours, public holidays, security checks, additional-document requests, system outages, regulatory changes, or banking procedures — circumstances outside DSD's reasonable control.",
    ],
  },
  {
    heading: "Third-party services and referrals",
    paragraphs: [
      "DSD may introduce or refer clients to third-party providers, including banks, insurers, auditors, accountants, lawyers, tax advisers, translators, landlords, real-estate agents, free zones, government service centres, and technology providers.",
      "Unless expressly agreed otherwise in writing, these third parties operate independently and are responsible for their own services, advice, pricing, conduct and contractual obligations. A referral does not constitute a guarantee or endorsement of a third party, and clients should conduct their own due diligence before appointing or paying any third-party provider.",
    ],
  },
  {
    heading: "External links",
    paragraphs: [
      "This Website may contain links to government portals and third-party websites, provided for convenience and general information only. DSD does not control third-party websites and does not guarantee their availability, security, accuracy, content, or privacy practices.",
    ],
  },
  {
    heading: "Website availability and security",
    paragraphs: [
      "We aim to keep this Website available and secure but do not guarantee continuous or uninterrupted access. Users are responsible for protecting their own devices, accounts, and information against malware, phishing, unauthorised access, and other online threats.",
      "DSD will never ask clients to transfer funds to a changed bank account solely on the basis of an unverified email or message. Clients should independently confirm payment instructions through an official DSD contact before transferring any funds.",
    ],
  },
  {
    heading: "Intellectual property",
    paragraphs: [
      "Unless otherwise stated, this Website and its contents — including the DSD name, branding, graphics, text, designs, photographs, videos, documents and other materials — are owned by or licensed to DSD Corporate Services and are protected under applicable UAE intellectual-property legislation.",
      "Content on this Website may not be copied, reproduced, republished, distributed, modified, sold, or commercially exploited without DSD's prior written permission, except where permitted by law.",
    ],
  },
  {
    heading: "Testimonials and results",
    paragraphs: [
      "Testimonials, reviews, case studies, and examples on this Website describe individual experiences and do not guarantee that another client will obtain the same result. Outcomes depend on the client's eligibility, documentation, selected activity, jurisdiction, regulatory requirements, and decisions made by the relevant authorities or third parties.",
    ],
  },
  {
    heading: "Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by applicable law, DSD Corporate Services and its directors, officers, employees, representatives, agents and contractors shall not be liable for any indirect, incidental, special, punitive or consequential loss arising from reliance on general information published on this Website, inability to access or use the Website, or the acts or omissions of an independent third party.",
      "Nothing in this Disclaimer excludes or limits any liability that cannot lawfully be excluded under UAE law, including liability arising from fraud, wilful misconduct, or gross negligence, or any mandatory consumer right under Federal Law No. 15 of 2020 on Consumer Protection.",
      "Any liability arising from a formally accepted service engagement is governed exclusively by the applicable quotation, engagement letter, or service agreement between DSD and the client, not by this Disclaimer.",
    ],
  },
  {
    heading: "Privacy and personal information",
    paragraphs: [
      "Personal information submitted through this Website is processed in accordance with our Privacy Policy and applicable UAE data-protection legislation, including Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data.",
      "Do not submit confidential, sensitive, or original identity or financial documents through an unsecured or unauthorised communication channel, including personal email or messaging applications. This Disclaimer should be read together with our Privacy Policy and Cookie Policy.",
    ],
  },
  {
    heading: "Force majeure",
    paragraphs: [
      "DSD shall not be liable for any failure or delay in providing information through this Website, or in performing any service, to the extent the failure or delay results from circumstances beyond DSD's reasonable control, including acts of God, war or civil unrest, government action, public health emergencies, strikes, telecommunications failures, cyberattacks, power outages, or the acts of a government authority, bank, free zone, or other third party.",
    ],
  },
  {
    heading: "General provisions",
    list: [
      "Severability: If any provision of this Disclaimer is held invalid or unenforceable, that provision shall be severed and the remaining provisions shall continue in full force and effect.",
      "No waiver: DSD's failure to enforce any provision at any time does not waive DSD's right to enforce that or any other provision later.",
      "Language: This Disclaimer is issued in English. Where an Arabic translation is made available, it is provided for convenience only; the English version prevails to the extent permitted by law.",
      "Electronic form: This Disclaimer is issued, and may be updated, in electronic form and constitutes a valid and binding notice under Federal Decree-Law No. 46 of 2021 on Electronic Transactions and Trust Services.",
    ],
  },
  {
    heading: "Changes to this Disclaimer",
    paragraphs: [
      "DSD may update this Disclaimer to reflect changes in its services, business practices, Website functions, or applicable legal requirements. The revised version becomes effective immediately upon publication, and continued use of the Website following publication constitutes acceptance of the revised Disclaimer.",
    ],
  },
  {
    heading: "Governing law and jurisdiction",
    paragraphs: [
      "This Disclaimer, and any dispute arising out of or in connection with the use of this Website, is governed by the federal laws of the United Arab Emirates and the laws applicable in the Emirate of Ajman, together with the rules and regulations of ANCFZ where applicable.",
      "Subject to any mandatory law or an alternative dispute-resolution or exclusive-jurisdiction clause in a separately executed service agreement, the competent courts of Ajman, United Arab Emirates shall have jurisdiction over any dispute relating to this Website or this Disclaimer.",
    ],
  },
  {
    heading: "Contact information",
    paragraphs: ["Questions concerning this Disclaimer may be directed to the details below."],
  },
];

export function WebsiteDisclaimerPage() {
  useDocumentTitle("Website Disclaimer");

  return (
    <section className="mx-auto max-w-3xl px-4 py-24 md:px-6">
      <h1 className="font-display text-3xl font-bold text-text-primary">Website Disclaimer</h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: 26 August 2026</p>
      <p className="mt-6 text-sm leading-relaxed text-text-secondary">
        This website, www.dsdcop.com (the "Website"), is owned and operated by DSD Corporate Services, a corporate
        services provider registered and licensed under the Ajman NuVentures Centre Free Zone ("ANCFZ"), Emirate of
        Ajman, United Arab Emirates ("DSD", "we", "us" or "our"). By accessing or using this Website, you acknowledge
        that you have read, understood and agree to be bound by this Disclaimer. If you do not agree with any part of
        this Disclaimer, please discontinue your use of the Website.
      </p>

      {SECTIONS.map((section, i) => (
        <LegalSection key={section.heading} index={i + 1} {...section} />
      ))}

      <p className="mt-10 border-t border-border pt-6 text-sm text-text-muted">
        DSD Corporate Services · 1st Floor, Office 06, Al Habeb Building, Umm Hurair Street, Oud Metha, Dubai, United
        Arab Emirates · +971 58 588 9033 · www.dsdcorps.com
      </p>
    </section>
  );
}
