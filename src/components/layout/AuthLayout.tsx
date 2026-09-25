import { Outlet } from "react-router-dom";

import { Navbar } from "@/components/layout/Navbar";

// Deliberately outside <App/>'s route tree — login/register carry the site's Navbar
// (for navigation back into the marketing site) but never the Footer/Testimonials/
// mobile tab bar, which don't belong on a single-task auth screen. pt-16/md:pt-18
// matches Navbar's own fixed header height (see App.tsx's identical offset).
export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 items-start justify-center px-4 pb-16 pt-16 md:pt-18">
        <Outlet />
      </div>
    </div>
  );
}
