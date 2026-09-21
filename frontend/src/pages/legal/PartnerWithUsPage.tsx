import {
  Award,
  Briefcase,
  CheckCircle2,
  Handshake,
  Link2,
  Send,
  Share2,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from "lucide-react";

import { CtaButton } from "@/components/common/CtaButton";
import { LeadForm } from "@/components/common/LeadForm";
import { Marquee } from "@/components/common/Marquee";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { ProcessSteps } from "@/components/common/ProcessSteps";
import { SentenceText } from "@/components/common/SentenceText";
import { WhyChooseDsd } from "@/components/common/WhyChooseDsd";
import placeholderPhoto from "@/assets/images/contact1.png";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const HOW_IT_WORKS_STEPS = [
  { step: "1", icon: UserCheck, title: "Join", description: "Register as a partner and receive your unique referral link." },
  {
    step: "2",
    icon: Send,
    title: "Share",
    description: "Share your personalised link through social media, WhatsApp, websites, communities, email, or directly with your network.",
  },
  {
    step: "3",
    icon: Handshake,
    title: "Refer",
    description: "When someone uses your link and becomes a qualified client, the referral is recorded through our tracking system.",
  },
  {
    step: "4",
    icon: Award,
    title: "Earn",
    description: "Earn commission on eligible services completed through your referrals, according to the applicable partner commission structure.",
  },
];

const WHO_CAN_PARTNER = [
  "Individuals with professional or personal networks",
  "Social media influencers",
  "Content creators",
  "Social media administrators",
  "Digital marketers",
  "Community administrators",
  "Business consultants",
  "Freelancers and independent professionals",
  "Real estate and business networks",
  "Referral partners",
  "Website and platform owners",
  "Anyone with a relevant audience or network",
];

const WHY_PARTNER_ITEMS = [
  {
    icon: TrendingUp,
    title: "Monetise Your Network",
    description: "Generate an additional income opportunity by introducing clients who need relevant UAE services.",
  },
  {
    icon: Link2,
    title: "Your Link. Your Referrals.",
    description: "Use a personalised referral link to help identify clients coming through your network.",
  },
  {
    icon: Share2,
    title: "Easy Digital Sharing",
    description: "Share your link across WhatsApp, Instagram, Facebook, LinkedIn, websites, email, or other permitted channels.",
  },
  {
    icon: Briefcase,
    title: "Professional Service Delivery",
    description: "Once a referral is introduced, our team handles the relevant service process directly with the client.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Referral Process",
    description: "We aim to provide clear partner terms, referral tracking, and commission arrangements.",
  },
];

export function PartnerWithUsPage() {
  useDocumentTitle("Partner With Us");

  return (
    <>
      <PageHeroBanner
        image={placeholderPhoto}
        eyebrow="Partner With Us"
        title="Turn Your Network Into an Opportunity"
        description={
          <SentenceText text="Do you have a network, audience, community, social media following, or clients who may need UAE corporate, immigration, residency, compliance, MOHRE or PRO services? Partner with us and turn your referrals into a rewarding opportunity. Our Partner Referral Programme is designed for individuals, influencers, social media administrators, consultants, community managers and other professionals who can introduce potential clients to our services." />
        }
      />

      <Marquee
        phrases={[
          "Introduce. Refer. Track. Earn.",
          "Turn Your Network Into Income",
          "Share Your Unique Referral Link",
          "Remote-Friendly Partner Programme",
          "Transparent Commission Terms",
        ]}
        ctaLabel="Get My Unique Link"
        ctaTo="#lead-form"
      />

      <ProcessSteps eyebrow="How It Works" title="From Introduction to Reward" steps={HOW_IT_WORKS_STEPS} />

      {/* Your unique referral link */}
      <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-6 md:py-20">
        <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">
          Your Unique Referral Link
        </span>
        <h2 className="mt-2 font-display text-2xl font-bold text-text-primary md:text-3xl">
          Every Approved Partner Gets One
        </h2>
        <div className="mx-auto mt-4 max-w-2xl text-text-secondary">
          <SentenceText text="Every approved partner receives a unique tracking link designed to identify referrals generated through their network. This means your referrals can be tracked more efficiently, helping create a clear connection between your promotional efforts and eligible client conversions." />
        </div>
        <div className="mx-auto mt-8 flex max-w-lg items-center gap-3 rounded-xl border border-accent/30 bg-surface-secondary px-5 py-4 text-left">
          <Link2 size={22} className="shrink-0 text-primary" />
          <span className="truncate font-mono text-sm text-text-secondary">dsdgrp.com/partner/your-unique-code</span>
        </div>
      </div>

      {/* Who can partner with us */}
      <div className="bg-surface-secondary py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">
              Who Can Partner With Us?
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-text-primary md:text-3xl">Our Programme Is Suitable For</h2>
          </div>
          <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {WHO_CAN_PARTNER.map((item) => (
              <li key={item} className="flex items-start gap-3 text-text-secondary">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <WhyChooseDsd
        eyebrow="Why Partner With Us"
        title="A Programme Built on Clarity"
        items={WHY_PARTNER_ITEMS}
        columns={3}
      />

      {/* You connect, we handle the process */}
      <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-6 md:py-20">
        <h2 className="font-display text-2xl font-bold capitalize text-accent md:text-3xl">
          You Connect. We Handle the Process.
        </h2>
        <div className="mx-auto mt-4 max-w-2xl text-text-secondary">
          <SentenceText text="You don't need to manage applications, government procedures, documentation or client processing yourself. We take care of the service delivery and client coordination within the agreed scope." />
        </div>
        <p className="mt-6 font-display text-lg font-semibold text-text-primary">
          Introduce &rarr; Refer &rarr; Track &rarr; Earn
        </p>
      </div>

      {/* Ready to become a partner */}
      <div className="bg-navy py-16 text-center md:py-20">
        <div className="mx-auto max-w-2xl px-4 md:px-6">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Ready to Become a Partner?</h2>
          <div className="mt-4 text-white/75">
            <SentenceText text="If you have an audience, network, community, or simply know people who may benefit from our services, we'd love to work with you. Join our Partner Referral Programme and turn meaningful introductions into a rewarding partnership." />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CtaButton to="#lead-form">Become a Partner</CtaButton>
            <CtaButton
              to="#lead-form"
              variant="outlined"
              sx={{
                color: "var(--color-text-inverse)",
                borderColor: "rgba(255,255,255,0.4)",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              Get Your Unique Referral Link
            </CtaButton>
          </div>
        </div>
      </div>

      <section id="lead-form" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 pb-24 md:px-6">
        <LeadForm
          defaultMainService="partner"
          title="Apply to Become a Partner"
          description="Tell us a little about yourself and how you'd like to work with DSD, our partnerships team will be in touch."
        />
        <p className="mt-6 text-center text-sm text-text-secondary">
          Partner eligibility, commission rates, qualifying services, tracking periods and payment terms are subject
          to the applicable Partner Programme terms.
        </p>
        <p className="mt-10 border-t border-border pt-6 text-center text-sm text-text-muted">
          DSD Corporate Services · 1st Floor, Office 06, Al Habeb Building, Umm Hurair Street, Oud Metha, Dubai,
          United Arab Emirates · +971 58 588 9033 · info@dsdgrp.com
        </p>
      </section>
    </>
  );
}
