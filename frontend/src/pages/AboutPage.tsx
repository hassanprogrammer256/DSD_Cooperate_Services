import {
  CheckCircle2,
  Globe2,
  Handshake,
  Laptop,
  MessageCircle,
  Play,
  ShieldCheck,
  Users,
} from "lucide-react";

import { CtaButton } from "@/components/common/CtaButton";
import { ConsentGate } from "@/components/common/ConsentGate";
import { Marquee } from "@/components/common/Marquee";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { SentenceText } from "@/components/common/SentenceText";
import aboutHero from "@/assets/images/hero/about_hero.jpg";
import aboutMission from "@/assets/images/about/about_dsd.jpeg";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const OFFICE_COORDINATES = { lat: 25.834608125684603, lng: 57.01326329403336 };
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${OFFICE_COORDINATES.lat},${OFFICE_COORDINATES.lng}&output=embed`;

const MISSION_PILLARS = [
  {
    icon: Laptop,
    title: "Seamless Transactions",
    description: "A smooth journey between enquiry, documentation, processing, follow-up and completion.",
  },
  {
    icon: Globe2,
    title: "Remote Accessibility",
    description: "Where permitted, initiate and manage services remotely, reducing unnecessary travel and physical visits.",
  },
  {
    icon: MessageCircle,
    title: "Digital Convenience",
    description: "Digital communication and document-sharing processes that make interactions faster and more convenient.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Communication",
    description: "Requirements, applicable steps, documentation and updates are clearly communicated at every stage.",
  },
  {
    icon: CheckCircle2,
    title: "Efficient Coordination",
    description: "We coordinate relevant processes within our scope so you spend less time navigating admin procedures.",
  },
  {
    icon: Users,
    title: "Long-Term Support",
    description: "Our relationship doesn't end at one transaction, we continue supporting you as new needs arise.",
  },
];

const HOW_WE_WORK_STEPS = [
  {
    step: "1",
    title: "Tell Us What You Need",
    description: "Contact us through our website, WhatsApp, email, phone or online enquiry form.",
  },
  {
    step: "2",
    title: "Receive Clear Guidance",
    description: "We explain the relevant service, documentation, process and next steps.",
  },
  {
    step: "3",
    title: "Submit Documents Remotely",
    description: "Where permitted, required documents can be shared securely through digital channels.",
  },
  {
    step: "4",
    title: "We Coordinate the Process",
    description: "Our team manages the relevant service coordination and follow-up within the agreed scope.",
  },
  {
    step: "5",
    title: "Receive Updates",
    description: "We keep you informed about important developments, additional requirements and next steps.",
  },
  {
    step: "6",
    title: "Complete the Transaction",
    description: "Once the process is completed, we provide the relevant outcome or documentation.",
  },
];

const NETWORK_ITEMS = [
  "Licensing authorities",
  "Free-zone authorities",
  "Government-related service channels",
  "Immigration-related channels",
  "MOHRE-related channels",
  "Professional advisors",
  "Legal and business consultants",
  "Banking and financial-service contacts",
];

export function AboutPage() {
  useDocumentTitle("About");

  return (
    <>
      <PageHeroBanner
        image={aboutHero}
        eyebrow="Seamless. Remote. Connected."
        title="ABOUT US"
        description={
          <SentenceText text="At DSD Corporate Services, we believe accessing professional corporate services should be simple, convenient and seamless, wherever you are. Instead of navigating multiple service providers and government-related processes independently, we provide a central point of coordination for your corporate requirements. Our goal is simple: make your transaction as seamless as possible, from wherever you are." />
        }
      />

      <Marquee
        phrases={[
          "Seamless. Remote. Connected.",
          "Submit Enquiries Remotely",
          "Digital-First Approach",
          "One Point Of Contact, Multiple Solutions",
          "Human Support + Digital Convenience",
        ]}
        ctaLabel="Get in Touch"
        ctaTo="/contact"
      />

      {/* Intro / Seamless service wherever you are */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-2">
        <img src={aboutMission} alt="A DSD advisor and client shaking hands" className="aspect-4/3 w-full rounded-xl object-cover" />
        <div>
          <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">Who We Are</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-text-primary md:text-4xl">
            A Modern Corporate Services Partner Without Borders
          </h2>
          <div className="mt-4 text-text-secondary">
            <SentenceText text="Based in the UAE, we support entrepreneurs, investors, companies, professionals and individuals with a comprehensive range of corporate and administrative services, including business incorporation, licensing, residency, immigration, compliance, MOHRE, PRO services and ongoing corporate support." />
          </div>
          <div className="mt-4 text-text-secondary">
            <SentenceText text="Wherever a process can be handled digitally or remotely, we make it possible for clients to initiate, manage and track their requirements without unnecessary office visits or complicated procedures. From your first enquiry to document collection, application coordination, updates and completion, DSD is designed to provide a smooth, organised and transparent service journey." />
          </div>
          <p className="mt-4 font-semibold text-text-primary">
            Dubai | Abu Dhabi | Other Emirates | Your Home Country | Anywhere in the World
          </p>
        </div>
      </div>

      {/* Digital-first capabilities */}
      <div className="bg-surface-secondary py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">Seamless Service, Wherever You Are</span>
            <h2 className="mt-2 font-display text-2xl font-bold text-text-primary md:text-3xl">
              Our Digital-First Approach Lets Clients
            </h2>
          </div>
          <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {[
              "Submit enquiries remotely",
              "Share documents digitally",
              "Receive service information online",
              "Complete required forms remotely where permitted",
              "Communicate with our team through digital channels",
              "Receive updates throughout the process",
              "Coordinate applications without unnecessary physical visits",
              "Access ongoing corporate support remotely",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-text-secondary">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-10 max-w-3xl text-center text-sm text-text-secondary">
            <SentenceText text="Where a government authority, regulator, bank, medical centre, immigration process or other third party requires physical attendance or original documentation, we clearly communicate those requirements so you know exactly what is needed." />
          </div>
        </div>
      </div>

      {/* Mission pillars */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">Our Mission</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-text-primary md:text-4xl">
            Making Corporate Services Seamless, Accessible &amp; Convenient
          </h2>
          <div className="mt-4 text-text-secondary">
            <SentenceText text="We believe geographical distance should not be a barrier to doing business in the UAE. Less paperwork. Less unnecessary travel. Less complexity. More convenience." />
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MISSION_PILLARS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border border-accent/30 bg-surface-secondary p-6">
              <Icon size={24} className="text-primary" />
              <h3 className="mt-4 font-display text-lg font-bold capitalize text-accent">{title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How we work */}
      <div className="bg-surface-secondary py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">How We Work</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-text-primary md:text-4xl">
              Human Support + Digital Convenience
            </h2>
            <div className="mt-4 text-text-secondary">
              <SentenceText text="You are not simply submitting an online form and waiting. You have access to a team that helps you understand the process and guides you through every next step." />
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HOW_WE_WORK_STEPS.map(({ step, title, description }) => (
              <div key={step} className="rounded-xl border border-accent/30 bg-background p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-display font-bold text-primary">
                  {step}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold capitalize text-accent">{title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div>
            <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">Our Network</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-text-primary md:text-4xl">
              Connected. Coordinated. Convenient.
            </h2>
            <div className="mt-4 text-text-secondary">
              <SentenceText text="Corporate services often involve coordination between businesses, government-related channels, licensing authorities, professional advisors and other service providers. DSD acts as a central point of communication so you don't have to run around independently coordinating every stage." />
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {NETWORK_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-lg border border-accent/30 bg-surface-secondary p-4 text-sm text-text-secondary">
                <Handshake size={18} className="mt-0.5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contact / office */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* TODO: swap the poster image + placeholder button for a real <video>
              element (or a hosted embed) once office/team footage is available. */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-accent/30">
            <img src={aboutMission} alt="Inside DSD Corporate Services" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-navy/40">
              <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg">
                <Play size={26} className="ml-1" fill="currentColor" />
              </span>
            </div>
          </div>

          <ConsentGate
            category="embedded"
            title="Google Maps"
            description="Loading this map connects to Google and shares your IP address with them."
          >
            <iframe
              src={MAPS_EMBED_URL}
              title="DSD Corporate Services office location"
              className="aspect-video w-full rounded-xl border border-accent/30"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </ConsentGate>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-xl border border-accent/30 bg-surface-secondary p-10 text-center">
          <Handshake size={32} className="text-primary" />
          <h2 className="font-display text-xl font-bold capitalize text-accent">Referral Programme</h2>
          <p className="max-w-xl text-text-secondary">
            Know a founder or professional who needs UAE residency, incorporation or compliance advice? Partner
            with DSD and we'll keep you informed every step of the way.
          </p>
          <CtaButton to="/partner-with-us">Partner With Us</CtaButton>
        </div>
      </div>
    </>
  );
}
