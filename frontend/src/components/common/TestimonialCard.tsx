import { Quote } from "lucide-react";

import type { Testimonial } from "@/types";

type Props = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: Props) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <Quote size={28} className="text-primary-light" />
      <p className="mt-4 italic text-text-primary">{testimonial.quote}</p>
      <div className="mt-5 flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-text-primary">{testimonial.name}</p>
          <p className="text-xs font-medium text-primary">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
