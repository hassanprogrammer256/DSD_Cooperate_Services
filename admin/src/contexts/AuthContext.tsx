import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { apiClient, setAccessToken } from "@/lib/api/client";
import { authKeys, useLoginMutation, useLogoutMutation, useMeQuery, useRefreshMutation } from "@/lib/api/auth";
import type { StaffUser } from "@/types";

// Thrown by login() specifically for "correct password, but not a staff account" —
// distinct from ApiError's 401 (wrong password) so LoginPage can show the exact
// message ui-rules.md requires ("This account doesn't have admin access"), never a
// generic 403 or silent redirect loop.
export class NotStaffError extends Error {}

type AuthContextValue = {
  user: StaffUser | null;
  isBootstrapping: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const queryClient = useQueryClient();

  const loginMutation = useLoginMutation();
  const refreshMutation = useRefreshMutation();
  const logoutMutation = useLogoutMutation();
  const meQuery = useMeQuery();

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const { access } = await refreshMutation.mutateAsync();
        setAccessToken(access);
        const me = await apiClient.get<StaffUser>("/api/auth/me/");
        if (!me.isStaff) throw new NotStaffError();
        if (!cancelled) queryClient.setQueryData(authKeys.me, me);
      } catch {
        setAccessToken(null);
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount only
  }, []);

  async function login(email: string, password: string) {
    const { access } = await loginMutation.mutateAsync({ email, password });
    setAccessToken(access);
    const me = await apiClient.get<StaffUser>("/api/auth/me/");
    if (!me.isStaff) {
      setAccessToken(null);
      await logoutMutation.mutateAsync().catch(() => {
        // best-effort — the refresh cookie for a non-staff account isn't a security
        // issue on its own (it just re-derives the same non-staff /me), but clearing
        // it is tidier; a failed clear here shouldn't block reporting the real error.
      });
      throw new NotStaffError("This account doesn't have admin access.");
    }
    queryClient.setQueryData(authKeys.me, me);
  }

  async function logout() {
    await logoutMutation.mutateAsync();
    setAccessToken(null);
    queryClient.setQueryData(authKeys.me, null);
  }

  const value: AuthContextValue = {
    user: meQuery.data ?? null,
    isBootstrapping,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
