type BarDatum = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  data: BarDatum[];
};

// Hand-rolled horizontal bar chart — no charting library added for what's just a
// handful of labeled magnitude comparisons (see the /dataviz skill's own bias toward
// plain HTML/SVG for simple forms over a new dependency). Mark spec follows that
// skill's references/marks-and-anatomy.md: <=24px-thick bars, 4px rounded data-end,
// value at the tip, text always in a text token (never the series color).
export function BarChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3" title={`${d.label}: ${d.value}`}>
          <span className="w-36 shrink-0 truncate text-sm text-text-secondary">{d.label}</span>
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-surface-secondary">
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-sm font-semibold text-text-primary">{d.value}</span>
        </div>
      ))}
    </div>
  );
}
