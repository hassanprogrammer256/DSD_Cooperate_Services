// Copied verbatim from src/theme/tokens.ts — see architecture.md: the admin app reuses
// this project's exact design tokens rather than getting its own, kept as a separate
// copy (no monorepo package) per this project's chosen deployment model. Keep in sync
// by hand if the public site's tokens ever change.

export const neutrals = {
  light: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceSecondary: "#F5F7FB",
    border: "#E3E7F0",
    textPrimary: "#0B1730",
    textSecondary: "#54607A",
    textMuted: "#8B93A8",
  },
  dark: {
    background: "#0B1220",
    surface: "#141D31",
    surfaceSecondary: "#1B2540",
    border: "#2B3654",
    textPrimary: "#F2F5FA",
    textSecondary: "#AAB4CB",
    textMuted: "#6F7B93",
  },
} as const;

export const textInverse = "#FFFFFF";

export const navy = { base: "#0A1B33", elevated: "#060F1E" } as const;

export const brand = {
  light: {
    primary: "#123B8C",
    primaryDark: "#0B2760",
    primaryLight: "#E8EEFB",
    accent: "#E31E2D",
    accentDark: "#A9121E",
    accentLight: "#FDEAEB",
  },
  dark: {
    primary: "#4C7FE0",
    primaryDark: "#2C56B0",
    primaryLight: "#16213A",
    accent: "#F2434C",
    accentDark: "#C22530",
    accentLight: "#33161A",
  },
} as const;

export const semantic = {
  light: {
    success: "#1E9E5A",
    successLight: "#E3F7EC",
    warning: "#C9821D",
    warningLight: "#FBEEDC",
    error: "#D92D3D",
    errorLight: "#FBE3E5",
    info: "#1D6FE0",
    infoLight: "#E6EFFC",
  },
  dark: {
    success: "#3ECB84",
    successLight: "#12291F",
    warning: "#E3A23F",
    warningLight: "#33260F",
    error: "#FF6B72",
    errorLight: "#331519",
    info: "#5B9BFF",
    infoLight: "#142A46",
  },
} as const;

export const radius = { sm: "4px", md: "8px", lg: "12px", xl: "20px", full: "9999px" } as const;

export const font = {
  display: "'Plus Jakarta Sans', 'Inter', sans-serif",
  sans: "'Inter', 'Plus Jakarta Sans', sans-serif",
  mono: "ui-monospace, 'SFMono-Regular', Menlo, monospace",
} as const;
