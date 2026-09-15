import { Handshake, Mail, MapPin, Phone, Smartphone } from "lucide-react";

import { CtaButton } from "@/components/common/CtaButton";
import { ConsentGate } from "@/components/common/ConsentGate";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import aboutHero from "@/assets/images/hero/about_hero.jpg";
import aboutMission from "@/assets/images/about/about_dsd.jpeg";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const OFFICE_ADDRESS = "1st floor, office 06, Al habeb building, umm hurair st. oud metha, Dubai, UAE";
const OFFICE_COORDINATES = { lat: 25.834608125684603, lng: 57.01326329403336 };
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${OFFICE_COORDINATES.lat},${OFFICE_COORDINATES.lng}&output=embed`;

export function AboutPage() {
  useDocumentTitle("About");

  return (
    <>
      <PageHeroBanner
        image={aboutHero}
        
        eyebrow=""
        title="ABOUT US"
        description="A Dubai-based advisory designed for seamless execution, giving founders, Innovators, businesses and relocating professionals one direct, trusted partner across residency, incorporation and compliance."
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-2">
        <img src={aboutMission} alt="A DSD advisor and client shaking hands" className="aspect-4/3 w-full rounded-xl object-cover" />
        <div>
      
          <h2 className="mt-2 font-display text-3xl font-bold text-accent md:text-4xl">
            Our Mission
          </h2>
          <span className="text-base text-text-secondary font-mono">
          A Unified Advisory Model 
          </span>
          <p className="mt-4 text-text-secondary">
         DSD Corporate Services was founded to fix a broken industry standard: the fragmented handoff between separate residency, incorporation  compliance consultants. We act as your single, accountable partner. We connect every dot across your visa status, corporate setup and regulatory duties, delivering bespoke execution tailored entirely to your reality.
          </p>
          
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">Our Office</span>
            <h2 className="mt-2 font-display text-2xl font-bold text-text-primary">Dubai, United Arab Emirates</h2>
            <ul className="mt-6 flex flex-col gap-4 text-text-secondary">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
                <span>{OFFICE_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3">
                <Smartphone size={18} className="shrink-0 text-primary" />
                <a href="tel:+971585889033" className="font-mono hover:text-primary">
                  +971 58 588 9033
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-primary" />
                <a href="tel:+97144298282" className="font-mono hover:text-primary">
                  +971 44 298 282
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-primary" />
                <a href="mailto:info@dsdgrp.com" className="hover:text-primary">
                  info@dsdgrp.com
                </a>
              </li>
            </ul>
          </div>

          <ConsentGate
            category="embedded"
            title="Google Maps"
            description="Loading this map connects to Google and shares your IP address with them."
          >
            <iframe
              src={MAPS_EMBED_URL}
              title="DSD Corporate Services office location"
              className="aspect-video w-full rounded-xl border border-border"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </ConsentGate>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-xl border border-border bg-surface-secondary p-10 text-center">
          <Handshake size={32} className="text-primary" />
          <h2 className="font-display text-xl font-semibold text-text-primary">Referral Programme</h2>
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
