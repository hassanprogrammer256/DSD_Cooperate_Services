// Curated Service *slugs* for the /residency and /incorporation hub pages (see
// servicePillarMeta/incorporationPillarMeta in src/lib/api/services.ts) — NOT the
// backend Service.pillar enum below, despite the similar name.
export type ServicePillar =
  | "uae-residency"
  | "investor-residency"
  | "family-residency"
  | "golden-residency"
  | "employment-residency";

export type IncorporationPillar =
  | "company-formation"
  | "business-licensing"
  | "international-structures"
  | "corporate-structuring"
  | "corporate-documentation";

// The real backend Service.pillar enum (backend/content/models.py's Service.Pillar) —
// used to route a service to its canonical detail-page URL prefix, see
// ServiceDetailPage.tsx's pillar-aware redirect.
export type ServiceCategoryPillar = "residency-solutions" | "business-incorporation" | "compliance-governance";

export type ServiceStat = {
  value: number;
  suffix?: string;
  label: string;
};

export type Service = {
  slug: string;
  title: string;
  pillar: ServiceCategoryPillar;
  philosophy_title: string;
  icon: string; // key into src/lib/icons.ts's serviceIcons map
  summary: string;
  description: string;
  included: ServiceIncludedItem[];
  heroImage: string; // imported asset path, src/assets/images/services/{slug}/
  relatedInsightSlugs: string[];
  teamMemberSlugs: string[];
  stats: ServiceStat[];
  process: ServiceProcessStep[];
  faqs: ServiceFaq[];
  ctaLabel?: string;
  // The per-service intake-form schema a dashboard "Request This Service" form renders
  // from — see backend/content/models.py's ServiceFormField.
  formFields: ServiceFormField[];
};

export type ServiceFormFieldType = "text" | "textarea" | "number" | "date" | "select" | "file" | "checkbox";

export type ServiceFormField = {
  key: string;
  label: string;
  fieldType: ServiceFormFieldType;
  required: boolean;
  options: string[]; // SELECT choices
  helpText: string;
  order: number;
};

export type ServiceIncludedItem = {
  title: string;
  description: string;
  image: string;
};

export type ServiceProcessStep = {
  title: string;
  description: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ComplianceArea = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  obligations: string[];
  included: ServiceIncludedItem[];
  notes?: string;
  sourceName?: string; // rendered as plain "— Source Name" attribution, never a fabricated link
  heroImage: string;
  relatedInsightSlugs: string[];
};

export type InsightArticle = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string[]; // paragraphs
  coverImage: string;
  publishDate: string; // ISO date
  touchesCompliance: boolean; // gates the "general guidance, not legal or tax advice" disclaimer
  relatedServiceSlugs: string[];
  relatedInsightSlugs: string[];
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export type Stat = {
  id: string;
  value: number;
  suffix?: string;
  label: string;
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  linkedin?: string;
};

export type Founder = {
  name: string;
  role: string;
  bio: string;
  photo: string;
  email?: string;
  linkedin?: string;
};

export type PricingTier = {
  id: string;
  name: string;
  description: string;
  price: string;
  // New in Phase 13 — the real chargeable value, alongside `price`'s pre-existing
  // display string. `amount: null` (the Enterprise/"Custom" tier) means this tier
  // isn't purchasable through Tap checkout — its CTA must still route to /contact.
  amount: string | null;
  currency: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  // Admin-curated allow-list — which service slugs a subscriber on this tier can
  // request from their dashboard's Services tab.
  services: string[];
};

// New in Phase 12 — accounts/auth. isStaff is the only distinction between a customer
// and a staff account (see architecture.md's Auth Flow) — there are no other roles.
export type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  company: string;
  country: string;
  photo: string | null;
  isStaff: boolean;
};

export type OrderStatus = "pending" | "paid" | "failed";

export type Order = {
  id: number;
  tierName: string;
  amount: string; // DRF serializes Decimal as a string — never parse for display, only for math
  currency: string;
  status: OrderStatus;
  createdAt: string; // ISO datetime
  failureReason?: string; // only meaningful when status === "failed"
};

export type SubscriptionStatus = "active" | "expired" | "cancelled";

export type Subscription = {
  id: number;
  tierId: string;
  tierName: string;
  status: SubscriptionStatus;
  startedAt: string; // ISO datetime
  expiresAt: string | null; // ISO datetime — informational only, nothing auto-renews/expires
};

export type NotificationKind = "service_request" | "subscription" | "system";

export type Notification = {
  id: number;
  kind: NotificationKind;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string; // ISO datetime
};

export type ServiceRequestStatus = "new" | "in_review" | "in_progress" | "completed" | "rejected";

export type ServiceRequest = {
  id: number;
  reference: string;
  serviceSlug: string;
  serviceTitle: string;
  formData: Record<string, unknown>;
  attachment: string | null;
  status: ServiceRequestStatus;
  createdAt: string; // ISO datetime
};
