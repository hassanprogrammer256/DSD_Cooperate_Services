import { LegalSection, type LegalSectionData } from "@/components/common/LegalSection";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const SECTIONS: LegalSectionData[] = [
  {
    heading: "Introduction",
    paragraphs: [
      'This Cookie Policy explains how DSD Corporate Services ("DSD," "we," "us" or "our") uses cookies and similar technologies on www.dsdcop.com.',
      "It should be read together with our Privacy Policy.",
    ],
  },
  {
    heading: "What are cookies?",
    paragraphs: [
      "Cookies are small text files placed on a computer, mobile telephone or other device when a person visits a website.",
      "Cookies allow a website to recognise a browser or device, remember selections, operate securely, understand how visitors use the website and provide relevant content.",
    ],
    list: [
      "Session cookies, which expire when the browser is closed; or persistent cookies, which remain on the device for a defined period or until deleted.",
      "First-party cookies, placed directly by DSD's website; or third-party cookies, placed by another organisation whose services are used on the website.",
    ],
  },
  {
    heading: "Similar technologies",
    paragraphs: [
      "We may use technologies performing functions similar to cookies, including pixels and tracking tags, web beacons, local browser storage, software development kits, device identifiers, and embedded scripts. References to “cookies” in this policy include these similar technologies where appropriate.",
    ],
  },
  {
    heading: "Types of cookies we may use",
    paragraphs: [
      "Strictly necessary cookies are required for the website to function properly and securely — loading pages, protecting forms against spam or misuse, maintaining security, remembering privacy selections, session management, and balancing traffic. Because these cookies are essential, they cannot normally be disabled through the website's cookie-preference tool.",
      "Functional cookies remember choices such as language, region, display preferences, previously entered non-sensitive information, and customer-service selections. Where required, these are activated only after consent.",
      "Analytics cookies help us understand how visitors interact with the website — pages visited, time spent, navigation paths, referral sources, browser and device type, general geographic region, and errors. Where required, these are activated only after consent.",
      "Advertising and marketing cookies may measure advertising effectiveness, limit repeat ad display, build an understanding of visitor interests, and measure post-advertisement activity. They are used only where configured and after consent where required.",
      "Social-media and embedded-content cookies may be placed by providers of embedded maps, videos, social buttons, or chat features. That processing is governed by the third party's own privacy and cookie policies.",
    ],
  },
  {
    heading: "Cookie consent",
    paragraphs: [
      "When you first visit the website, you should be presented with a cookie notice allowing you to accept all optional cookies, reject all optional cookies, or select particular cookie categories.",
      "Strictly necessary cookies may be used without an optional-cookie selection because they are required to operate the website. Optional cookies remain disabled until you make an affirmative selection where consent is required.",
    ],
  },
  {
    heading: "Managing or withdrawing consent",
    paragraphs: [
      "You may change or withdraw your cookie selection at any time through the Cookie Settings link displayed on the website. Withdrawing consent does not affect the lawfulness of processing completed before consent was withdrawn.",
      "You may also manage cookies through your browser settings, including viewing, deleting, or blocking cookies. Blocking cookies may affect website availability or functionality.",
    ],
  },
  {
    heading: "Third-party cookies",
    paragraphs: [
      "Third-party tools may process information according to their own policies and may transfer information outside the UAE. DSD does not directly control the duration or operation of third-party cookies.",
    ],
  },
  {
    heading: "Information collected through cookies",
    paragraphs: ["Depending on the cookies selected, information collected may include:"],
    list: [
      "IP address and cookie or device identifier",
      "Browser, operating system, and device type",
      "Approximate location and date/time of access",
      "Pages viewed, buttons or links selected, and referral website",
      "Website errors and advertising or campaign interactions",
    ],
  },
  {
    heading: "Retention",
    paragraphs: [
      "Cookies remain on a device for the period stated in the website's Cookie Settings panel, unless deleted earlier through the browser. Information generated through cookies is retained only as long as reasonably necessary and in accordance with our Privacy Policy.",
    ],
  },
  {
    heading: "Changes to this Cookie Policy",
    paragraphs: [
      "We may update this Cookie Policy when new website technology is introduced, cookie providers or purposes change, legal requirements change, or our privacy practices are updated. The revised policy will be published with an updated effective date.",
    ],
  },
  {
    heading: "Contact us",
    paragraphs: ["For questions concerning cookies or personal information, contact us using the details below."],
  },
];

export function CookiePolicyPage() {
  useDocumentTitle("Cookie Policy");

  return (
    <section className="mx-auto max-w-3xl px-4 py-24 md:px-6">
      <h1 className="font-display text-3xl font-bold text-text-primary">Cookie Policy</h1>
      <p className="mt-2 text-sm text-text-muted">Effective date: 26 August 2026</p>

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
