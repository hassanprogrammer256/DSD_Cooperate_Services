type Props = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
};

export function SectionHeading({ eyebrow, title, highlight, description, align = "center" }: Props) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      {eyebrow && <span className="text-xs font-semibold uppercase tracking-wide text-accent">{eyebrow}</span>}
      <h2 className="mt-2 font-display text-3xl font-bold text-text-primary md:text-4xl">
        {title} {highlight && <span className="text-accent">{highlight}</span>}
      </h2>
      {description && <p className="mt-4 text-text-secondary">{description}</p>}
    </div>
  );
}
