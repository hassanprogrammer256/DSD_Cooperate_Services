import { StrictMode } from "react";

import { CssVarsProvider, StyledEngineProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { router } from "@/router";
import { initTheme } from "@/theme/theme";
import { joyTheme } from "@/theme/joyTheme";

initTheme();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // content doesn't change every second — avoid refetching on every focus
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* injectFirst puts Joy's emotion styles ahead of Tailwind's in <head>, so a
        Tailwind utility (e.g. lg:hidden on a Joy component) wins the cascade tie
        instead of losing to Joy's own base styles. */}
    <StyledEngineProvider injectFirst>
      <CssVarsProvider theme={joyTheme} defaultMode="light" disableTransitionOnChange>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
        <ToastContainer position="top-right" autoClose={5000} />
      </CssVarsProvider>
    </StyledEngineProvider>
  </StrictMode>,
);
