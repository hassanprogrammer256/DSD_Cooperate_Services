import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: ReactNode;
  align?: "center" | "left";
};

export function SectionHeading({ eyebrow, title, highlight, description, align = "center" }: Props) {
  const isCenter = align === "center";

  // Where both an eyebrow and a title are present, only the eyebrow carries the
  // bold/capitalize/accent "heading" treatment — the title underneath stays plain
  // so the eyebrow remains the single visual focal point. A title with no eyebrow
  // above it carries that treatment itself instead.
  return (
    <div className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      {eyebrow && (
        <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent md:text-base">
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-2 font-display text-3xl font-bold md:text-4xl ${
          eyebrow ? "text-text-primary" : "capitalize text-accent"
        }`}
      >
        {title} {highlight && <span className={eyebrow ? "text-accent" : "text-text-primary"}>{highlight}</span>}
      </h2>
      {description && <p className="mt-4 text-text-secondary">{description}</p>}
    </div>
  );
}
