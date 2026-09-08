import { useState } from "react";

import { ChevronDown } from "lucide-react";

import type { ServiceFaq } from "@/types";

type Props = {
  faqs: ServiceFaq[];
};

export function FaqAccordion({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question} className="rounded-lg border border-border bg-surface">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-sm font-semibold text-text-primary">{faq.question}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && <p className="px-5 pb-4 text-sm text-text-secondary">{faq.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
