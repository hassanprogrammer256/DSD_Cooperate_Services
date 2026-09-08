// Adapted from src/theme/joyTheme.ts, not a blind copy: the public site remaps Joy's
// "danger" palette to the brand accent red because "this site has no destructive
// actions" (see that file's own comment) — the admin app is the opposite case
// (ui-rules.md requires a real confirm-before-delete flow), so here "danger" stays
// Joy's actual semantic error color and "primary" (navy) is what Save/Create buttons
// use instead of an accent-as-CTA convention. Same reasoning as the public site
// otherwise: extendTheme() can't accept a var(--...) string, so this uses tokens.ts's
// literal light-mode hex as a frozen baseline, with colorSchemes.light/.dark
// deliberately identical — the real switching happens via the CSS cascade.
import { extendTheme } from "@mui/joy/styles";

import { brand, neutrals, semantic } from "@/theme/tokens";

const palette = {
  primary: {
    500: brand.light.primary,
    600: brand.light.primaryDark,
    softBg: brand.light.primaryLight,
  },
  danger: {
    500: semantic.light.error,
    600: semantic.light.error,
    softBg: semantic.light.errorLight,
  },
  success: { 500: semantic.light.success, softBg: semantic.light.successLight },
  warning: { 500: semantic.light.warning, softBg: semantic.light.warningLight },
  neutral: { softBg: neutrals.light.surfaceSecondary },
};

export const joyTheme = extendTheme({
  fontFamily: {
    body: "var(--font-sans)",
    display: "var(--font-display)",
  },
  colorSchemes: {
    light: { palette },
    dark: { palette },
  },
  breakpoints: {
    values: { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280 },
  },
});
