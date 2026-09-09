import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

import { FacebookIcon, InstagramIcon, LinkedinIcon, WhatsappIcon, XIcon } from "@/components/common/SocialIcon";
import { canonicalServicePath, curatedServiceSlugs, useServicesQuery } from "@/lib/api/services";
import { IMAGES } from "@/lib/utils";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/residency", label: "Residency" },
  { to: "/incorporation", label: "Incorporation" },
  { to: "/compliance", label: "Compliance" },
  { to: "/insights", label: "Insights" },
  { to: "/partner-with-us", label: "Partner With Us" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { to: "/cookie-policy", label: "Cookie Policy" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/website-disclaimer", label: "Website Disclaimer" },
];

const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/", label: "Facebook", Icon: FacebookIcon },
  { href: "https://www.instagram.com/", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.linkedin.com/", label: "LinkedIn", Icon: LinkedinIcon },
  { href: "https://www.x.com/", label: "X", Icon: XIcon },
  { href: "https://wa.me/971585889033", label: "WhatsApp", Icon: WhatsappIcon },
];

export function Footer() {
  const year = new Date().getFullYear();
  // Secondary/passive nav, present on every page — deliberately no spinner/error UI
  // here (that would be noisy site-wide); it just renders once the data arrives and
  // stays quiet otherwise. See ui-rules.md's Loading & Error States section for why
  // primary content areas get the full QueryState treatment and this doesn't.
  const { data: services } = useServicesQuery();
  const curatedFooterServices = services?.filter((service) => curatedServiceSlugs.includes(service.slug));

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src={IMAGES.dsd_logo} alt="DSD Corporate Services" className="h-12 w-auto object-contain" />
          <p className="mt-3 text-sm text-white/70">
            UAE residency, business incorporation, and compliance advisory based in Dubai — helping founders,
            investors, and relocating professionals enter and operate in the UAE market with confidence.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white transition-colors hover:bg-accent"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Quick Links</h3>
          <ul className="mt-4 flex flex-col gap-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-white/72 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Services</h3>
          <ul className="mt-4 flex flex-col gap-2">
            {curatedFooterServices?.map((service) => (
              <li key={service.slug}>
                <Link to={canonicalServicePath(service)} className="text-sm text-white/72 hover:text-white">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-white/72">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>1st Floor, Office 06, Al Habeb Building, Umm Hurair Street, Oud Metha, Dubai, UAE</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              <a href="tel:+971585889033" className="font-mono hover:text-white">
                +971 58 588 9033
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              <a href="mailto:info@dsdcop.com" className="hover:text-white">
                info@dsdcop.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-navy-elevated">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-4 text-xs text-white/55 sm:flex-row sm:justify-between">
          <span>© {year} DSD Corporate Services. All rights reserved.</span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-white/80">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
