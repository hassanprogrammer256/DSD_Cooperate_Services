// Fixed frontend copy, not staff-editable content — same "fixed site structure"
// reasoning as servicePillarMeta. Values match backend/leads/models.py's
// Lead.MainService choices exactly; keep both in sync if either changes.
export const MAIN_SERVICES = [
  { value: "incorporation", label: "Incorporation" },
  { value: "residency", label: "Residency" },
  { value: "compliance", label: "Compliance" },
  { value: "partner", label: "Partner with Us" },
  { value: "general", label: "Not Sure / General Enquiry" },
] as const;

export type MainServiceValue = (typeof MAIN_SERVICES)[number]["value"];

export const SUB_SERVICE_OPTIONS: Record<MainServiceValue, string[]> = {
  incorporation: [
    "Company Formation",
    "Business Setup",
    "Corporate Structuring",
    "Business Licensing",
    "International Structure",
    "Other",
  ],
  residency: ["UAE Residency", "Investor Residency", "Family Residency", "Golden Residency", "Residency Support", "Other"],
  compliance: [
    "Corporate Compliance",
    "Accounting & Reporting",
    "Tax Compliance",
    "AML / KYC",
    "Regulatory Support",
    "Annual Compliance",
    "Other",
  ],
  partner: ["Referral Partner", "Professional Partner", "Corporate Partner", "International Partner", "Business Introduction", "Other"],
  general: [],
};

export const PREFERRED_CONTACT_METHODS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
] as const;
