import { QueryState } from "@/components/common/QueryState";
import { StatCounter } from "@/components/common/StatCounter";
import { useStatsQuery } from "@/lib/api/stats";

export function StatsStrip() {
  const { data: stats, isLoading, isError, refetch } = useStatsQuery();

  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()} inverse>
          <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:divide-x md:divide-white/14">
            {stats?.map((stat) => (
              <StatCounter key={stat.id} value={stat.value} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </QueryState>
      </div>
    </section>
  );
}
