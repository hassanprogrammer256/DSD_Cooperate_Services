import { useEffect, useRef } from "react";

import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";

type Props = {
  value: number;
  suffix?: string;
  label: string;
};

export function StatCounter({ value, suffix, label }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 1.4, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, value, count]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 text-center">
      <span className="font-mono text-3xl font-bold text-white md:text-4xl">
        <motion.span>{rounded}</motion.span>
        {suffix}
      </span>
      <span className="text-sm font-medium text-white/72">{label}</span>
    </div>
  );
}
