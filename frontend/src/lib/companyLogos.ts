import amazon from "@/assets/images/companies/amazon.png";
import andersen from "@/assets/images/companies/andersen.png";
import axios from "@/assets/images/companies/axios.png";
import bitget from "@/assets/images/companies/bitget.png";
import canon from "@/assets/images/companies/canon.png";
import caparo from "@/assets/images/companies/caparo.png";
import co1 from "@/assets/images/companies/co_1.png";
import co2 from "@/assets/images/companies/co_2.png";
import co3 from "@/assets/images/companies/co_3.png";
import dove from "@/assets/images/companies/dove.png";
import ey from "@/assets/images/companies/ey.png";
import gulfood from "@/assets/images/companies/gulfood.png";
import loreal from "@/assets/images/companies/loreal.png";
import microsoft from "@/assets/images/companies/microsoft.png";
import nestle from "@/assets/images/companies/nestle.png";
import netAPorter from "@/assets/images/companies/net_a_porter.png";
import propertyFinder from "@/assets/images/companies/property_finder.png";
import pwc from "@/assets/images/companies/pwc.png";
import recruitment from "@/assets/images/companies/recruitment.png";
import sheraa from "@/assets/images/companies/sheraa.png";
import sobha from "@/assets/images/companies/sobha.png";
import strategy from "@/assets/images/companies/strategy.png";
import sunset from "@/assets/images/companies/sunset.png";
import switzerland from "@/assets/images/companies/switzerland.png";
import visa from "@/assets/images/companies/visa.png";

// Fixed frontend asset list, not staff-editable content — same "fixed site
// structure" reasoning as servicePillarMeta. Logos live under
// src/assets/images/companies/, client-supplied for the Home page's "trusted by"
// marquee (CompanyLogoMarquee.tsx). Explicit one-import-per-file, matching this
// project's convention elsewhere (no import.meta.glob usage in the codebase).
export const COMPANY_LOGOS: { src: string; alt: string }[] = [
  { src: amazon, alt: "Amazon" },
  { src: andersen, alt: "Andersen" },
  { src: axios, alt: "Axios" },
  { src: bitget, alt: "Bitget" },
  { src: canon, alt: "Canon" },
  { src: caparo, alt: "Caparo" },
  { src: co1, alt: "Client 1" },
  { src: co2, alt: "Client 2" },
  { src: co3, alt: "Client 3" },
  { src: dove, alt: "Dove" },
  { src: ey, alt: "EY" },
  { src: gulfood, alt: "Gulfood" },
  { src: loreal, alt: "L'Oréal" },
  { src: microsoft, alt: "Microsoft" },
  { src: nestle, alt: "Nestlé" },
  { src: netAPorter, alt: "NET-A-PORTER" },
  { src: propertyFinder, alt: "Property Finder" },
  { src: pwc, alt: "PwC" },
  { src: recruitment, alt: "Recruitment" },
  { src: sheraa, alt: "Sheraa" },
  { src: sobha, alt: "Sobha" },
  { src: strategy, alt: "Strategy" },
  { src: sunset, alt: "Sunset" },
  { src: switzerland, alt: "Switzerland" },
  { src: visa, alt: "Visa" },
];
