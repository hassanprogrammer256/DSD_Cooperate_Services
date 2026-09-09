// Mirrors backend/content/serializers.py and backend/orders/serializers.py's
// AdminOrderSerializer exactly — see code-standards.md's rule that a serializer field
// rename is a breaking change requiring both sides to update together.

export type StaffUser = {
  id: number;
  email: string;
  name: string;
  phone: string;
  photo: string | null;
  isStaff: boolean;
};

export type Service = {
  slug: string;
  title: string;
  pillar: "residency-solutions" | "business-incorporation" | "compliance-governance";
  icon: string;
  summary: string;
  description: string;
  included: { title: string; description: string; image: string }[];
  heroImage: string;
  relatedInsightSlugs: string[];
  teamMemberSlugs: string[];
  stats: { value: number; suffix: string; label: string }[];
  process: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
};

export type ComplianceArea = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  obligations: string[];
  notes: string;
  sourceName: string;
  heroImage: string;
  relatedInsightSlugs: string[];
};

export type InsightArticle = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string[];
  coverImage: string;
  publishDate: string; // ISO date
  touchesCompliance: boolean;
  relatedServiceSlugs: string[]; // read-only — set from the Service/ComplianceArea side
  relatedInsightSlugs: string[];
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
};

export type Founder = {
  name: string;
  role: string;
  bio: string;
  photo: string;
  email: string;
  linkedin: string;
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
  suffix: string;
  label: string;
  order: number;
};

export type PricingTier = {
  id: string;
  name: string;
  description: string;
  price: string;
  amount: string | null;
  currency: string;
  period: string;
  features: string[];
  highlighted: boolean;
  order: number;
};

export type OrderStatus = "pending" | "paid" | "failed";

// Mirrors backend/leads/serializers.py's LeadSerializer exactly.
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "documentation"
  | "in_progress"
  | "completed"
  | "lost";

export type Lead = {
  id: number;
  reference: string;
  name: string;
  mobile: string;
  email: string;
  country: string;
  company: string;
  mainService: string;
  subService: string;
  requirement: string;
  preferredContactMethod: string;
  preferredContactTime: string;
  attachment: string | null;
  status: LeadStatus;
  sourceUrl: string;
  deviceType: string;
  createdAt: string;
};

export type LeadStats = {
  total: number;
  byStatus: Record<string, number>;
  byService: Record<string, number>;
};

export type AdminOrder = {
  id: number;
  customerEmail: string;
  customerName: string;
  tierName: string;
  amount: string;
  currency: string;
  status: OrderStatus;
  failureReason?: string;
  createdAt: string;
};
