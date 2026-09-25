import { CtaButton } from "@/components/common/CtaButton";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function NotFoundPage() {
  useDocumentTitle("Page Not Found");

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="font-display text-6xl font-bold text-primary">404</span>
      <h1 className="font-display text-2xl font-bold text-text-primary">Page not found</h1>
      <p className="max-w-md text-text-secondary">The page you're looking for doesn't exist or may have moved.</p>
      <CtaButton to="/">Back to Home</CtaButton>
    </section>
  );
}
