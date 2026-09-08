import { Link } from "react-router-dom";

import { useDocumentTitle } from "@/lib/useDocumentTitle";

const LEGAL_PAGES = [
  { to: "/cookie-policy", label: "Cookie Policy" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/partner-with-us", label: "Partner With Us" },
  { to: "/website-disclaimer", label: "Website Disclaimer" },
];

export function LegalPage() {
  useDocumentTitle("Legal");

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
      <h1 className="text-center font-display text-3xl font-bold text-text-primary md:text-4xl">Legal</h1>
      <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {LEGAL_PAGES.map((page) => (
          <Link
            key={page.to}
            to={page.to}
            className="rounded-lg border border-border bg-surface p-4 text-center text-sm font-medium text-text-primary hover:border-primary"
          >
            {page.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
