/**
 * Outcome figures and the chart that sits under them.
 *
 * Everything here is absent-by-default. A metric with no `bar` draws no
 * track; a project with no `series` draws no chart. That is not a
 * degraded state — it is the honest one. A figure with an empty progress
 * track beside it reads as a measurement someone failed to take, and a
 * chart is the easiest thing on a company website to quietly invent.
 */

export type Metric = {
  value: string;
  label: string;
  bar?: number;
};

export function MetricTile({ value, label, bar }: Metric) {
  return (
    <div className="grid content-start gap-2.5">
      <b className="font-display text-figure leading-none font-semibold tracking-[-0.03em] text-metric tabular-nums">
        {value}
      </b>
      <span className="text-small leading-snug text-ink-muted">{label}</span>
      {bar !== undefined && (
        <span
          aria-hidden="true"
          className="mt-1 block h-[5px] overflow-hidden rounded-xs bg-rule"
        >
          <i
            className="block h-full rounded-xs bg-accent"
            style={{ inlineSize: `${bar}%` }}
          />
        </span>
      )}
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
      className={`grid grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-8 ${className}`}
    >
      {metrics.map((m) => (
        <MetricTile key={`${m.value}-${m.label}`} {...m} />
      ))}
    </div>
  );
}

/**
 * Bar chart for a project's `series`. Columns past the midpoint take the
 * accent, so the eye reads the direction of travel without needing a key.
 *
 * Returns null with no series — the caller does not have to guard.
 */
export function SeriesChart({
  series,
  label,
  caption,
  height = "h-[150px]",
}: {
  series?: number[];
  label?: string;
  caption?: string;
  height?: string;
}) {
  if (!series || series.length === 0) return null;
  const turn = Math.floor(series.length * 0.6);

  return (
    <figure className="m-0">
      {(label || caption) && (
        <figcaption className="mb-3.5 flex items-baseline justify-between gap-4">
          {label && (
            <span className="font-data text-label font-medium tracking-[0.16em] text-ink-faint uppercase">
              {label}
            </span>
          )}
          {caption && (
            <span className="font-data text-micro text-ink-faint">
              {caption}
            </span>
          )}
        </figcaption>
      )}
      <div aria-hidden="true" className={`flex items-end gap-1.5 ${height}`}>
        {series.map((value, i) => (
          <span
            key={i}
            className={`block flex-1 rounded-t-xs ${i > turn ? "bg-accent" : "bg-rule"}`}
            style={{ blockSize: `${Math.max(value, 2)}%` }}
          />
        ))}
      </div>
    </figure>
  );
}
