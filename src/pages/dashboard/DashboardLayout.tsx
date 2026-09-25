import { useState } from "react";

import { flushSync } from "react-dom";
import { Bell, CreditCard, LayoutGrid, LogOut, Menu, User, X } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { useNotificationsQuery } from "@/lib/api/notifications";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { IMAGES } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/subscription", label: "My Subscription", icon: CreditCard },
  { to: "/dashboard/services", label: "Services", icon: LayoutGrid },
];

// Its own full-height app shell — deliberately outside <App/>'s route tree, so it
// carries none of the marketing site's Navbar/Footer/Testimonials/mobile tab bar.
export function DashboardLayout() {
  useDocumentTitle("My Dashboard");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data: notifications } = useNotificationsQuery(!!user);
  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  async function handleLogout() {
    // Same flushSync-before-logout ordering as AccountPage — forces the navigate to
    // commit (unmounting ProtectedRoute) before logout() clears `user`, avoiding a
    // race with ProtectedRoute's own reactive redirect-to-/login.
    flushSync(() => {
      navigate("/");
    });
    await logout();
  }

  const initials = (user?.name || user?.email || "?").trim().charAt(0).toUpperCase();

  const sidebarContent = (
    <>
      <Link to="/" className="flex items-center gap-2 px-2">
        <img src={IMAGES.dsd_logo} alt="DSD Corporate Services" className="h-8 w-auto object-contain" />
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              }`
            }
          >
            <span className="flex items-center gap-3">
              <Icon size={18} />
              {label}
            </span>
            {label === "Notifications" && unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-3 border-t border-border px-2 pt-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light font-display text-sm font-bold text-primary">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{user?.name}</p>
          <p className="truncate text-xs text-text-secondary">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={() => void handleLogout()}
          aria-label="Log out"
          className="shrink-0 rounded-md p-2 text-text-secondary hover:bg-surface-secondary hover:text-error"
        >
          <LogOut size={18} />
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface p-4 lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile off-canvas sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
          <aside className="relative flex h-full w-72 max-w-[85%] flex-col bg-surface p-4 shadow-xl">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 rounded-md p-2 text-text-secondary hover:bg-surface-secondary"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:px-6 lg:justify-end">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-2 text-text-primary hover:bg-surface-secondary lg:hidden"
          >
            <Menu size={22} />
          </button>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light font-display text-sm font-bold text-primary lg:hidden">
            {initials}
          </span>
        </header>

        <main className="flex-1 px-4 py-8 md:px-6 md:py-10">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
