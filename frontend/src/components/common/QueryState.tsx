import type { ReactNode } from "react";

// Shared loading/error presentation for every page that now depends on a network call
// (Phase 11 — see ui-rules.md's Loading & Error States section). Not-found (a 404 for a
// specific slug) is handled separately by each detail page via <Navigate replace /> —
// this component is for the "still loading" / "something went wrong" states only.
type Props = {
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  /** Set on a fixed-navy section (StatsStrip, etc.) so the spinner/text stay visible
   * against a dark background regardless of the light/dark theme toggle — same
   * reasoning as ThemeToggle's own `inverse` prop. */
  inverse?: boolean;
  children: ReactNode;
};

export function QueryState({ isLoading, isError, onRetry, inverse = false, children }: Props) {
  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div
          className={`h-8 w-8 animate-spin rounded-full border-2 ${
            inverse ? "border-white/25 border-t-white" : "border-border border-t-primary"
          }`}
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className={inverse ? "text-white/72" : "text-text-secondary"}>
          Couldn't load this content right now — please refresh or try again shortly.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={`text-sm font-semibold hover:opacity-80 ${inverse ? "text-white" : "text-primary"}`}
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
