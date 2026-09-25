const BADGE_COLORS = ["primary", "accent", "success", "warning", "info"] as const;
import dsd_logo from "@/assets/icons/dsd_logo.png";
export type BadgeColor = (typeof BADGE_COLORS)[number];

// Cycles [primary, accent, success, warning, info] so a row of cards never repeats a
// badge color across its first 5 members.
export function badgeColorAt(index: number): BadgeColor {
  return BADGE_COLORS[index % BADGE_COLORS.length];
}
export const IMAGES ={
  dsd_logo: dsd_logo
}