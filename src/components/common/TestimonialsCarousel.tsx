import { useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { TestimonialCard } from "@/components/common/TestimonialCard";
import type { Testimonial } from "@/types";

const AUTOPLAY_MS = 6000;
const CARDS_PER_SLIDE = 3;

type Props = {
  testimonials: Testimonial[];
};

export function TestimonialsCarousel({ testimonials }: Props) {
  const slides = useMemo(() => {
    const chunks: Testimonial[][] = [];
    for (let i = 0; i < testimonials.length; i += CARDS_PER_SLIDE) {
      chunks.push(testimonials.slice(i, i + CARDS_PER_SLIDE));
    }
    return chunks;
  }, [testimonials]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [slides.length, isPaused]);

  if (slides.length === 0) return null;

  const activeSlide = slides[Math.min(activeIndex, slides.length - 1)];
  const activeSlideKey = activeSlide.map((testimonial) => testimonial.id).join("-");

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="relative mx-auto max-w-6xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlideKey}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {activeSlide.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.map((testimonial) => testimonial.id).join("-")}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
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
