// The one place that actually flips the theme. Framework-agnostic (no React) so it can
// run from index.html's blocking init script and be reused by any toggle UI (Navbar).
export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "dsd-theme";

function prefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function initTheme(): ThemeMode {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    stored = null;
  }

  const mode: ThemeMode = stored === "light" || stored === "dark" ? stored : prefersDark() ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", mode);
  return mode;
}

export function getCurrentTheme(): ThemeMode {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function toggleTheme(): ThemeMode {
  const next: ThemeMode = getCurrentTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // localStorage unavailable (private browsing, etc.) — theme still applies for this page view
  }
  return next;
}
