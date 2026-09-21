type Props = {
  label: string;
  value: number; // 0-100
  detail?: string;
};

// A single ratio against a limit — per the /dataviz skill's choosing-a-form.md, this
// is the correct form for that job, not a two-slice pie. Fill carries severity
// (here: the single accent color, since this metric has no inherent danger
// threshold); the unfilled track is a lighter step of the same ramp so state reads
// across the whole bar, per marks-and-anatomy.md's Meter contract.
export function Meter({ label, value, detail }: Props) {
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="font-display text-2xl font-bold text-text-primary">{clamped.toFixed(0)}%</p>
      </div>
      <div
        className="mt-2 h-3 overflow-hidden rounded-full bg-primary-light"
        role="meter"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {detail && <p className="mt-1 text-xs text-text-muted">{detail}</p>}
    </div>
  );
}
