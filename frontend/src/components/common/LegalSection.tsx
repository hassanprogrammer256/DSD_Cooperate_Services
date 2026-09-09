export type LegalSectionData = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

type Props = LegalSectionData & { index: number };

export function LegalSection({ index, heading, paragraphs, list }: Props) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold text-text-primary">
        {index}. {heading}
      </h2>
      {paragraphs?.map((paragraph, i) => (
        <p key={i} className="mt-3 text-sm leading-relaxed text-text-secondary">
          {paragraph}
        </p>
      ))}
      {list && list.length > 0 && (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-text-secondary">
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
