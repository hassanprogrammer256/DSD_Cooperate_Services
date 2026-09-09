type Props = {
  label: string;
  value: number | string;
  accent?: boolean;
};

// Stat-tile contract per the /dataviz skill: sentence-case label, no trailing colon;
// value in the system sans with proportional (not tabular) figures — this is a
// standalone number, not a column that needs vertical alignment.
export function StatTile({ label, value, accent }: Props) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className={`mt-1 font-display text-3xl font-bold ${accent ? "text-primary" : "text-text-primary"}`}>{value}</p>
    </div>
  );
}
