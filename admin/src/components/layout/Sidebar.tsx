import {
  Briefcase,
  FileText,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  Receipt,
  ShieldCheck,
  Tag,
  UserPlus,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import dsdLogo from "@/assets/icons/dsd_logo.png";
import { useAuth } from "@/contexts/AuthContext";

// The one place in the whole platform a sidebar layout is appropriate — ui-rules.md's
// public-site Do Nots rule against a sidebar is a public-site rule, not platform-wide.
const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { to: "/services", label: "Services", icon: Briefcase },
      { to: "/compliance", label: "Compliance", icon: ShieldCheck },
      { to: "/insights", label: "Insights", icon: Newspaper },
      { to: "/team", label: "Team", icon: Users },
      { to: "/founder", label: "Founder", icon: FileText },
      { to: "/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { to: "/stats", label: "Stats", icon: Tag },
      { to: "/pricing", label: "Pricing", icon: Tag },
    ],
  },
  {
    label: "Business",
    items: [
      { to: "/orders", label: "Orders", icon: Receipt },
      { to: "/leads", label: "Leads", icon: UserPlus },
    ],
  },
];

// Initials fallback when a staff member hasn't set a photo yet (Django's own /admin/
// is the only way to set one right now — see accounts/models.py's User.photo comment)
// — never a fabricated stock photo standing in for a real person.
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Sidebar() {
  const { user } = useAuth();

  return (
    <nav className="flex h-full w-64 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <img src={dsdLogo} alt="DSD Corporate Services" className="h-9 w-auto object-contain" />
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-text-primary">DSD</p>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Admin</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? "bg-primary text-white" : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                    }`
                  }
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {user && (
        <div className="flex items-center gap-2.5 border-t border-border px-4 py-3">
          {user.photo ? (
            <img src={user.photo} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
              {initialsOf(user.name || user.email)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">{user.name || "Staff"}</p>
            <p className="truncate text-xs text-text-muted">{user.email}</p>
          </div>
        </div>
      )}
    </nav>
  );
}
