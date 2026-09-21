import { useId, useState } from "react";

type LinePoint = {
  label: string; // short axis label, e.g. "Tue 15"
  value: number;
};

type Props = {
  data: LinePoint[];
  color?: string;
};

const WIDTH = 600;
const HEIGHT = 180;
const PAD_X = 12;
const PAD_TOP = 24; // room for the end-label
const PAD_BOTTOM = 24; // room for axis labels

// Hand-rolled line/area chart — same "no charting library for a simple form" bias as
// BarChart.tsx. Mark spec per the /dataviz skill's marks-and-anatomy.md: 2px line,
// round join/cap, ~10% opacity area wash, >=8px end marker with a 2px surface ring,
// hairline recessive gridlines, direct label only at the endpoint (never every
// point). Ships its own crosshair + one-tooltip-for-every-series hover layer per
// interaction.md — a line/area chart is interactive by default, not an upgrade.
export function LineChart({ data, color = "var(--color-primary)" }: Props) {
  const gradientId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.value), 1);
  const plotWidth = WIDTH - PAD_X * 2;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const stepX = data.length > 1 ? plotWidth / (data.length - 1) : 0;

  function xAt(index: number) {
    return PAD_X + stepX * index;
  }
  function yAt(value: number) {
    return PAD_TOP + plotHeight - (value / max) * plotHeight;
  }

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(d.value)}`).join(" ");
  const areaPath = `${linePath} L ${xAt(data.length - 1)} ${PAD_TOP + plotHeight} L ${xAt(0)} ${PAD_TOP + plotHeight} Z`;

  const lastIndex = data.length - 1;
  const hovered = hoverIndex !== null ? data[hoverIndex] : null;

  function handleMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const index = stepX > 0 ? Math.round((relativeX - PAD_X) / stepX) : 0;
    setHoverIndex(Math.min(Math.max(index, 0), lastIndex));
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Line chart"
        onPointerMove={handleMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.1} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Hairline gridlines — recessive, one-step-off-surface */}
        {[0, 0.5, 1].map((fraction) => (
          <line
            key={fraction}
            x1={PAD_X}
            x2={WIDTH - PAD_X}
            y1={PAD_TOP + plotHeight * fraction}
            y2={PAD_TOP + plotHeight * fraction}
            stroke="var(--color-border)"
            strokeWidth={1}
          />
        ))}

        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* Crosshair + hovered point */}
        {hovered && (
          <>
            <line
              x1={xAt(hoverIndex!)}
              x2={xAt(hoverIndex!)}
              y1={PAD_TOP}
              y2={PAD_TOP + plotHeight}
              stroke="var(--color-border)"
              strokeWidth={1}
            />
            <circle cx={xAt(hoverIndex!)} cy={yAt(hovered.value)} r={5} fill={color} stroke="var(--color-surface)" strokeWidth={2} />
          </>
        )}

        {/* End marker + direct label — the one point labeled inline */}
        <circle cx={xAt(lastIndex)} cy={yAt(data[lastIndex].value)} r={5} fill={color} stroke="var(--color-surface)" strokeWidth={2} />
        <text
          x={xAt(lastIndex)}
          y={yAt(data[lastIndex].value) - 10}
          textAnchor="end"
          fontSize={12}
          fontWeight={700}
          fill="var(--color-text-primary)"
        >
          {data[lastIndex].value}
        </text>

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={d.label}
            x={xAt(i)}
            y={HEIGHT - 6}
            textAnchor="middle"
            fontSize={11}
            fill="var(--color-text-muted)"
          >
            {d.label}
          </text>
        ))}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs shadow-md"
          style={{ left: `${(xAt(hoverIndex!) / WIDTH) * 100}%` }}
        >
          <p className="font-semibold text-text-primary">{hovered.value}</p>
          <p className="text-text-muted">{hovered.label}</p>
        </div>
      )}
    </div>
  );
}
