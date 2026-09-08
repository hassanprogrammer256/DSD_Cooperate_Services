import type { ReactNode } from "react";

import Button from "@mui/joy/Button";

type QueryStateProps = {
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  children: ReactNode;
};

// Same shape as src/components/common/QueryState.tsx — every list/detail fetch in this
// app goes through it, never a bare data.field with no loading/error guard.
export function QueryState({ isLoading, isError, onRetry, children }: QueryStateProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-text-secondary">Couldn't load this — please try again.</p>
        {onRetry && (
          <Button variant="soft" color="primary" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
