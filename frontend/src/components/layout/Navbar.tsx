import { useState } from "react";

import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  Building2,
  ChevronDown,
  Handshake,
  House,
  IdCard,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Tag,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { CtaButton } from "@/components/common/CtaButton";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/common/SocialIcon";
import { useAuth } from "@/contexts/AuthContext";
import { curatedComplianceAreas } from "@/lib/api/compliance";
import { incorporationPillarMeta, servicePillarMeta } from "@/lib/api/services";
import { IMAGES } from "@/lib/utils";
import { ThemeToggle } from "../common/ThemeToggle";

type NavDropdownItem = { to: string; label: string };

type NavItem = { to?: string; label: string; icon: LucideIcon; dropdown?: NavDropdownItem[] };

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: House },
  { to: "/about", label: "About Us", icon: User },
  {
    to: "/incorporation",
    label: "Incorporation",
    icon: Building2,
    dropdown: incorporationPillarMeta.map((pillar) => ({ to: `/incorporation/${pillar.pillar}`, label: pillar.label })),
  },
  {
    to: "/residency",
    label: "Residency",
    icon: IdCard,
    dropdown: servicePillarMeta.map((pillar) => ({ to: `/residency/${pillar.pillar}`, label: pillar.label })),
  },
  {
    to: "/compliance",
    label: "Compliance",
    icon: ShieldCheck,
    dropdown: curatedComplianceAreas.map((area) => ({ to: `/compliance/${area.slug}`, label: area.label })),
  },
    { to: "/pricing", label: "Pricing", icon: Tag },
  { to: "/partner-with-us", label: "Partner with Us", icon: Handshake }

];

const WHATSAPP_URL = "https://wa.me/971585889033";

const SCROLL_THRESHOLD = 60;

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user } = useAuth();

  const [scrolledPastThreshold, setScrolledPastThreshold] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolledPastThreshold(latest > SCROLL_THRESHOLD);
  });

  const transparent = isHome && !scrolledPastThreshold;

  function closeMobile() {
    setMobileOpen(false);
    setMobileDropdownOpen(null);
  }

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50">
        {/* Utility bar */}
        <motion.div
          animate={{ height: transparent ? 36 : 0, opacity: transparent ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="hidden overflow-hidden bg-navy md:block"
        >
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs text-white/75">
            <span>Advisory that saves time, cost, and mistakes.</span>
            <div className="flex items-center gap-5">
              <a href="tel:+971585889033" className="font-mono hover:text-white">
                +971 58 588 9033
              </a>
              <a href="mailto:www.dsdcorps.com" className="hover:text-white">
                www.dsdcorps.com
              </a>
              <div className="flex items-center gap-3">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FacebookIcon size={14} />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramIcon size={14} />
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <LinkedinIcon size={14} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main nav */}
        <header
          className={`h-16 border-b transition-colors duration-200 md:h-18 ${
            transparent ? "border-transparent bg-transparent" : "border-border bg-surface shadow-sm"
          }`}
        >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2" onClick={closeMobile}>
            <img src={IMAGES.dsd_logo} alt="DSD Corporate Services" className="h-20 w-auto object-contain" />

          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.to != null &&
                (location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to)));
              const linkClassName = `relative flex items-center gap-1 px-3 py-2 text-sm font-medium ${
                transparent ? "text-white" : isActive ? "text-primary" : "text-text-primary"
              } hover:opacity-80`;
              const linkContent = (
                <>
                  {item.label}
                  {item.dropdown && <ChevronDown size={14} />}
                  {isActive && !item.dropdown && (
                    <motion.span
                      layoutId="nav-underline"
                      className={`absolute -bottom-0.5 left-3 right-3 h-0.5 ${transparent ? "bg-white" : "bg-primary"}`}
                    />
                  )}
                </>
              );
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                  onMouseLeave={() => item.dropdown && setOpenDropdown(null)}
                >
                  {item.to ? (
                    <Link to={item.to} className={linkClassName}>
                      {linkContent}
                    </Link>
                  ) : (
                    <button type="button" className={`${linkClassName} cursor-default`} aria-haspopup="true">
                      {linkContent}
                    </button>
                  )}

                  <AnimatePresence>
                    {item.dropdown && openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-1/2 top-full w-64 -translate-x-1/2 rounded-lg border border-border bg-surface p-2 shadow-lg"
                      >
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.to}
                            className="block rounded-md px-3 py-2 text-sm text-text-primary hover:bg-surface-secondary"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
          {/* <Link
              to={user ? "/account" : "/login"}
              aria-label={user ? "My Account" : "Log In"}
              className={`hidden items-center justify-center rounded-full p-2 hover:opacity-80 lg:flex ${
                transparent ? "text-white" : "text-text-primary"
              }`}
            >
              <User size={18} />
            </Link>  */}
           <ThemeToggle inverse={transparent} /> 
            {/* <div className="hidden md:block">
              <CtaButton to="/contact" size="sm">
               Contact Us
              </CtaButton>
            </div> */}
            <IconButton
              component="a"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="plain"
              aria-label="Chat on WhatsApp"
              sx={{
                color: transparent ? "var(--color-text-inverse)" : "var(--color-text-primary)",
                display: { xs: "flex", md: "none" },
              }}
            >
              <MessageCircle size={22} />
            </IconButton>
            <IconButton
              variant="plain"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              sx={{
                color: transparent ? "var(--color-text-inverse)" : "var(--color-text-primary)",
                display: { xs: "flex", lg: "none" },
              }}
            >
              <Menu size={22} />
            </IconButton>
          </div>
        </div>
        </header>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[85%] max-w-sm flex-col overflow-y-auto bg-navy px-6 py-6 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-lg font-bold text-white">DSD Corporate Services</span>
                <IconButton variant="plain" onClick={closeMobile} aria-label="Close menu" sx={{ color: "white" }}>
                  <X size={22} />
                </IconButton>
              </div>

              <nav className="flex flex-1 flex-col gap-1">
                {NAV_ITEMS.map((item) =>
                  item.dropdown ? (
                    <div key={item.label}>
                      <button
                        type="button"
                        onClick={() => setMobileDropdownOpen((cur) => (cur === item.label ? null : item.label))}
                        className="flex w-full items-center justify-between rounded-md px-2 py-3 text-left text-base font-medium text-white"
                      >
                        <span className="flex items-center gap-3">
                          <item.icon size={18} className="shrink-0 text-white/70" />
                          {item.label}
                        </span>
                        <motion.span animate={{ rotate: mobileDropdownOpen === item.label ? 180 : 0 }}>
                          <ChevronDown size={16} />
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {mobileDropdownOpen === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4"
                          >
                            {item.dropdown.map((sub) => (
                              <Link
                                key={sub.label}
                                to={sub.to}
                                onClick={closeMobile}
                                className="block rounded-md px-2 py-2 text-sm text-white/75 hover:text-white"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : item.to ? (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={closeMobile}
                      className="flex items-center gap-3 rounded-md px-2 py-3 text-base font-medium text-white"
                    >
                      <item.icon size={18} className="shrink-0 text-white/70" />
                      {item.label}
                    </Link>
                  ) : null,
                )}
                <Link
                  to={user ? "/account" : "/login"}
                  onClick={closeMobile}
                  className="rounded-md px-2 py-3 text-base font-medium text-white"
                >
                  {user ? "My Account" : "Log In"}
                </Link>
              </nav>

              <Box className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6">
                <a href="tel:+971585889033" className="flex items-center gap-2 text-sm font-mono text-white/80">
                  <Phone size={16} /> +971 58 588 9033
                </a>
                <a href="mailto:www.dsdcorps.com" className="flex items-center gap-2 text-sm text-white/80">
                  <Mail size={16} /> www.dsdcorps.com
                </a>
                <CtaButton to="/contact" onClick={closeMobile}>
                  Book a Consultation
                </CtaButton>
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
