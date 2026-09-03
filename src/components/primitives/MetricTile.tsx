import { DimensionRule } from "./drafting";

/**
 * Outcome figure, measured.
 *
 * The number is set in ink; the cyan appears only as the dimension rule
 * measuring it. Colour is spent once per tile on the act of measurement
 * rather than on the figure — which keeps the two-colour discipline and
 * avoids giving a metric the semantics of a warning.
 */

export type Metric = {
  value: string;
  label: string;
};

export function MetricTile({ value, label }: Metric) {
  return (
    <div className="grid gap-1.5 bg-sheet px-5 py-4">
      <b className="font-display text-figure leading-none font-bold tracking-[-0.04em] text-metric tabular-nums">
        {value}
      </b>
      <DimensionRule tone="accent" />
      <span className="text-small leading-snug text-ink-muted">{label}</span>
    </div>
  );
}

/** Renders nothing when a project has no metrics yet. */
export function MetricRow({
  metrics,
  className = "",
}: {
  metrics: Metric[];
  className?: string;
}) {
  if (metrics.length === 0) return null;

  return (
    <div
      className={`grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {metrics.map((m) => (
        <MetricTile key={`${m.value}-${m.label}`} {...m} />
      ))}
    </div>
  );
}
