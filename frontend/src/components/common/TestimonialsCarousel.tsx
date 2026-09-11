import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { TestimonialCard } from "@/components/common/TestimonialCard";
import type { Testimonial } from "@/types";

const AUTOPLAY_MS = 6000;

type Props = {
  testimonials: Testimonial[];
};

// Single-slide autoplay carousel with dot indicators — replaces the old static
// grid-of-cards layout. One testimonial in view at a time (per explicit request),
// advancing on a timer and pausable on hover/focus so a reader isn't fighting the
// autoplay mid-read. Dot click both jumps to that slide and resets the timer, so a
// manual choice doesn't get immediately overridden by the next tick.
export function TestimonialsCarousel({ testimonials }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [testimonials.length, isPaused]);

  if (testimonials.length === 0) return null;

  const active = testimonials[Math.min(activeIndex, testimonials.length - 1)];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="relative mx-auto max-w-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <TestimonialCard testimonial={active} />
          </motion.div>
        </AnimatePresence>
      </div>

      {testimonials.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              aria-label={`Go to testimonial from ${testimonial.name}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? "w-6 bg-accent" : "w-2.5 bg-border hover:bg-primary-light"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
