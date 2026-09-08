import { Outlet, useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import Button from "@mui/joy/Button";

import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    // Same flushSync pattern as the public site's AccountPage — commits the
    // navigation before logout() clears `user`, avoiding a race with ProtectedRoute's
    // own reactive redirect. See progress-tracker.md's Phase 12 entry.
    flushSync(() => {
      navigate("/login");
    });
    await logout();
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
          <span className="text-sm text-text-secondary">{user?.email}</span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="plain" color="neutral" size="sm" onClick={() => void handleLogout()}>
              Log Out
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
