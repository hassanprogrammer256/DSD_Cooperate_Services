import { COMPANY_LOGOS } from "@/lib/companyLogos";

// Infinite-scroll logo strip — pure CSS animation (.animate-marquee, index.css),
// not framer-motion, so it stays smooth without competing with React re-renders.
// The logo list renders twice back-to-back inside one flex track; translating the
// track by exactly -50% loops seamlessly since the second copy starts exactly
// where the first began. Purely decorative ("trusted by" band), so the whole
// duplicated track is aria-hidden — the section heading carries the real label
// for screen readers instead of every logo (and its duplicate) being announced.
export function CompanyLogoMarquee() {
  const track = [...COMPANY_LOGOS, ...COMPANY_LOGOS];

  return (
    <div
      className="overflow-hidden"
      style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
    >
      <div className="flex w-max items-center gap-12 animate-marquee" aria-hidden="true">
        {track.map((logo, index) => (
          <img
            key={`${logo.alt}-${index}`}
            src={logo.src}
            alt=""
            className="h-8 w-auto shrink-0 object-contain grayscale opacity-60 transition hover:opacity-100 hover:grayscale-0 md:h-10"
          />
        ))}
      </div>
    </div>
  );
}
