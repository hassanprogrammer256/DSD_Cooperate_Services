import {
  Briefcase,
  FileText,
  Newspaper,
  Receipt,
  ShieldCheck,
  Tag,
  Users,
  MessageSquareQuote,
} from "lucide-react";
import { NavLink } from "react-router-dom";

// The one place in the whole platform a sidebar layout is appropriate — ui-rules.md's
// public-site Do Nots rule against a sidebar is a public-site rule, not platform-wide.
const NAV_ITEMS = [
  { to: "/services", label: "Services", icon: Briefcase },
  { to: "/compliance", label: "Compliance", icon: ShieldCheck },
  { to: "/insights", label: "Insights", icon: Newspaper },
  { to: "/team", label: "Team", icon: Users },
  { to: "/founder", label: "Founder", icon: FileText },
  { to: "/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/stats", label: "Stats", icon: Tag },
  { to: "/pricing", label: "Pricing", icon: Tag },
  { to: "/orders", label: "Orders", icon: Receipt },
];

export function Sidebar() {
  return (
    <nav className="flex h-full w-56 flex-col gap-1 border-r border-border bg-surface p-4">
      <div className="mb-4 px-2">
        <span className="font-display text-lg font-bold text-text-primary">DSD</span>
        <span className="ml-1 text-xs font-semibold uppercase tracking-wide text-text-muted">Admin</span>
      </div>
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-primary-light text-primary" : "text-text-secondary hover:bg-surface-secondary"
            }`
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
