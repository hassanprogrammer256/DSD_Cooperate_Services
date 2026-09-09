// Joy's extendTheme() decomposes palette values into RGB channels at construction
// time, so it cannot accept a var(--...) string (see ui-registry.md → Do Nots) — this
// uses tokens.ts's literal light-mode hex as a frozen baseline instead. That's safe
// because colorSchemes.light and .dark are DELIBERATELY IDENTICAL — Joy's own internal
// light/dark selection is a no-op here on purpose. The real switching happens entirely
// through the CSS cascade via [data-theme], driven by src/theme/theme.ts; anything that
// must track the live toggle (e.g. CtaButton) uses an sx override with var(--...)
// directly instead of going through Joy's palette. See library-docs.md.
import { extendTheme } from "@mui/joy/styles";

import { brand, neutrals, semantic } from "@/theme/tokens";

const palette = {
  primary: {
    500: brand.light.primary,
    600: brand.light.primaryDark,
    softBg: brand.light.primaryLight,
  },
  // "danger" is intentionally remapped to the brand accent red — used for CTAs, not
  // destructive-action semantics (this site has no destructive actions).
  danger: {
    500: brand.light.accent,
    600: brand.light.accentDark,
    softBg: brand.light.accentLight,
  },
  success: { 500: semantic.light.success, softBg: semantic.light.successLight },
  warning: { 500: semantic.light.warning, softBg: semantic.light.warningLight },
  neutral: { softBg: neutrals.light.surfaceSecondary },
};

// Input/Textarea/Select's own :focus-within border+glow replaces the doubled-rectangle
// look that came from combining index.css's generic `:focus-visible { outline: 2px
// solid ...; outline-offset: 2px }` (a real, load-bearing a11y default kept for every
// other focusable element — buttons, links, checkboxes) with the field's own border,
// which read as two overlapping rectangles. `& :focus-visible { outline: none }`
// suppresses that generic outline specifically on the control living inside one of
// these three, since this border+glow is itself a fully WCAG-2.4.7-compliant focus
// indicator — never remove the generic rule itself, only opt these three out of it.
const focusStyle = {
  "&:focus-within": {
    borderColor: "var(--color-primary)",
    boxShadow: "0 0 0 3px var(--color-primary-light)",
  },
  "& :focus-visible": { outline: "none" },
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
  // Aligned to Tailwind v4's default breakpoints (sm/md/lg/xl = 640/768/1024/1280),
  // not Joy's own default scale (600/900/1200/1536) — otherwise a Joy component's sx
  // breakpoint and a Tailwind lg: class trigger at different widths, so e.g. a
  // hamburger button and the desktop nav it replaces show/hide out of sync.
  breakpoints: {
    values: { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280 },
  },
  components: {
    JoyInput: { styleOverrides: { root: focusStyle } },
    JoyTextarea: { styleOverrides: { root: focusStyle } },
    JoySelect: { styleOverrides: { root: focusStyle } },
    // FormLabel/Checkbox/Radio's text all come from Joy's `neutral` palette, which this
    // theme deliberately doesn't customize beyond softBg (see the top-of-file comment)
    // — so it stayed frozen at Joy's light-mode default and was invisible on a dark
    // card. Fixed once here, at the theme level, instead of an sx override repeated at
    // every call site (a dozen+ found already, admin's own form fields included — see
    // progress-tracker.md's 2026-09-09 entry).
    JoyFormLabel: { styleOverrides: { root: { color: "var(--color-text-primary)" } } },
    JoyCheckbox: { styleOverrides: { label: { color: "var(--color-text-primary)" } } },
    JoyRadio: { styleOverrides: { label: { color: "var(--color-text-primary)" } } },
  },
});
