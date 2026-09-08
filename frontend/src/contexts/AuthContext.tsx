import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { apiClient, setAccessToken } from "@/lib/api/client";
import {
  authKeys,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useRefreshMutation,
  useRegisterMutation,
  type RegisterInput,
} from "@/lib/api/auth";
import type { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  /** True only during the initial silent-refresh attempt on app load — public pages
   * don't wait on this; only a route that actually needs to know "is someone logged
   * in" (ProtectedRoute, the future Pricing checkout gate) should. */
  isBootstrapping: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const queryClient = useQueryClient();

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const refreshMutation = useRefreshMutation();
  const logoutMutation = useLogoutMutation();
  const meQuery = useMeQuery();

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const { access } = await refreshMutation.mutateAsync();
        setAccessToken(access);
        const me = await apiClient.get<User>("/api/auth/me/");
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
    const me = await apiClient.get<User>("/api/auth/me/");
    queryClient.setQueryData(authKeys.me, me);
  }

  async function register(input: RegisterInput) {
    const { access, user } = await registerMutation.mutateAsync(input);
    setAccessToken(access);
    queryClient.setQueryData(authKeys.me, user);
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
    register,
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
