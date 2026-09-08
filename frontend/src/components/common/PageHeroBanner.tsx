import type { ReactNode } from "react";

type Props = {
  image: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  children?: ReactNode;
};

export function PageHeroBanner({ image, eyebrow, title, description, align = "center", children }: Props) {
  const isCenter = align === "center";

  return (
    <section
      className="relative bg-cover bg-center py-20 md:py-28"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(10,27,51,0.88) 0%, rgba(10,27,51,0.55) 60%, rgba(10,27,51,0.35) 100%)",
        }}
      />
      <div
        className={`relative mx-auto max-w-7xl px-4 md:px-6 ${
          isCenter ? "text-center" : "text-center lg:text-left"
        }`}
      >
        {eyebrow && <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">{eyebrow}</div>}
        <h1 className="font-display text-3xl font-bold text-white md:text-4xl">{title}</h1>
        {description && <p className={`mt-4 text-white/82 ${isCenter ? "mx-auto max-w-2xl" : "mx-auto max-w-2xl lg:mx-0"}`}>{description}</p>}
        {children && (
          <div className={`mt-6 flex flex-wrap items-center gap-4 ${isCenter ? "justify-center" : "justify-center lg:justify-start"}`}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
