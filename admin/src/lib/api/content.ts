import { createResourceHooks } from "@/lib/api/resource";
import type { ComplianceArea, InsightArticle, PricingTier, Service, Stat, Testimonial, TeamMember } from "@/types";

export const servicesApi = createResourceHooks<Service>("/api/services", "admin-services", (s) => s.slug);
export const complianceApi = createResourceHooks<ComplianceArea>("/api/compliance-areas", "admin-compliance", (c) => c.slug);
export const insightsApi = createResourceHooks<InsightArticle>("/api/insights", "admin-insights", (i) => i.slug);
export const teamApi = createResourceHooks<TeamMember>("/api/team", "admin-team", (t) => t.slug);
export const testimonialsApi = createResourceHooks<Testimonial>("/api/testimonials", "admin-testimonials", (t) => t.id);
export const statsApi = createResourceHooks<Stat>("/api/stats", "admin-stats", (s) => s.id);
export const pricingApi = createResourceHooks<PricingTier>("/api/pricing-tiers", "admin-pricing", (p) => p.id);
