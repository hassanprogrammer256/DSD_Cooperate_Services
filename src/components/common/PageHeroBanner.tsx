import type { ReactNode } from "react";

type Props = {
  image: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  children?: ReactNode;
  eyebrowClassName?: string;
};

export function PageHeroBanner({ image, eyebrow, title, description, align = "left", children, eyebrowClassName }: Props) {
  const isCenter = align === "center";

  return (
    <section
      className="relative  bg-[#0a1b33] bg-size-[100%_auto] bg-center bg-no-repeat py-10 md:py-14 flex flex-col gap-3"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(10,27,51,0.88) 0%, rgba(10,27,51,0.55) 60%, rgba(10,27,51,0.35) 100%)",
        }}
      />
      <div className={`relative mx-auto px-4 md:px-6 ${isCenter ? "text-center" : "text-left"}`}>
        {eyebrow && <div className={`${eyebrowClassName || " mb-2 text-xs font-semibold uppercase tracking-wide text-accent"}`}>{eyebrow}</div>}
        <h1 className={`font-display text-3xl font-bold text-white md:text-4xl ${isCenter ? "" : "max-w-4xl"}`}>{title}</h1>
        {description && (
          <p className={`mt-4 text-white/82 ${isCenter ? "mx-auto" : "max-w-3xl"}`}>{description}</p>
        )}
        {children && (
          <div className={`mt-6 flex flex-col flex-wrap gap-4 ${isCenter ? "justify-center" : "justify-start"}`}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
