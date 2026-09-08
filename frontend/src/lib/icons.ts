import {
  BadgeCheck,
  Briefcase,
  Building,
  Building2,
  Calculator,
  ClipboardCheck,
  FileBadge,
  FileCheck,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

// Keeps src/data/services.ts framework-import-free — Service.icon holds a string key
// resolved to a real component only at render time.
export const serviceIcons: Record<string, LucideIcon> = {
  building: Building,
  briefcase: Briefcase,
  "badge-check": BadgeCheck,
  users: Users,
  "building-2": Building2,
  "trending-up": TrendingUp,
  calculator: Calculator,
  receipt: Receipt,
  "file-badge": FileBadge,
  "shield-check": ShieldCheck,
  "file-check": FileCheck,
  "clipboard-check": ClipboardCheck,
};
