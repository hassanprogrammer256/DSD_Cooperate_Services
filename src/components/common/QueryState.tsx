import type { ReactNode } from "react";
import { CtaButton } from "./CtaButton";
type Props = {
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
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
          Couldn't load this content right now , Please refresh or try again shortly.
        </p>
        {onRetry && (
          <CtaButton onClick={onRetry}>Try Again</CtaButton>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
