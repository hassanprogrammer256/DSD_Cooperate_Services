import type { ReactNode } from "react";

import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

// Wraps a route that requires a logged-in customer (currently just /account). Waits
// for the silent-refresh bootstrap to finish before deciding — redirecting to /login
// before that resolves would incorrectly bounce an already-logged-in visitor on a
// hard page refresh, since the access token lives only in memory (see
// architecture.md's Auth Flow).
type Props = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const { user, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
