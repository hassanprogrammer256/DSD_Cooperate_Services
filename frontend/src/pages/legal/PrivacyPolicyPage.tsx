import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function PrivacyPolicyPage() {
  useDocumentTitle("Privacy Policy");

  return (
    <section className="mx-auto max-w-3xl px-4 py-24 md:px-6">
      <h1 className="font-display text-3xl font-bold text-text-primary">Privacy Policy</h1>
      <p className="mt-4 text-text-secondary">Full numbered-section boilerplate ships in a later build phase, pending legal review.</p>
      <p className="mt-8 text-sm text-text-muted">
        DSD Corporate Services · Al Hareb Building, Dubai · +91 7585889093 · info@dsdgrp.com
      </p>
    </section>
  );
}
