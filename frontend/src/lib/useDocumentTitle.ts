import { useEffect } from "react";

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title.length > 0 ? `${title} | DSD` : "DSD Corporate Services";
  }, [title]);
}
