import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";

/**
 * Outcome figures and the chart that sits under them.
 *
 * Everything here is absent-by-default: a metric with no `bar` draws no
 * track, a project with no `series` draws no chart. That is not a
 * degraded state — it is the honest one. A chart is the easiest thing on
 * a company website to quietly invent, and real client numbers are the
 * one thing here nobody should ever be able to fabricate by accident.
 *
 * Pre-launch, an absent slot instead draws the device at full strength so
 * the layout can be judged before the data exists, marked by a caption
 * rather than by being drawn faintly — a placeholder nobody can see is
 * not a placeholder, it is a bug. See src/lib/placeholders.ts.
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
      {bar !== undefined ? (
        <span
          aria-hidden="true"
          className="mt-1 block h-[5px] overflow-hidden rounded-xs bg-rule"
        >
          <i
            className="block h-full rounded-xs bg-accent"
            style={{ inlineSize: `${bar}%` }}
          />
        </span>
      ) : SHOW_PLACEHOLDERS ? (
        /* The empty track, so the device is visible before anyone has
           decided what proportion this figure is of. Solid, not dashed:
           a dashed --rule outline measures 1.16:1 on the panel. */
        <span
          aria-hidden="true"
          className="mt-1 block h-[5px] rounded-xs bg-rule"
        />
      ) : null}
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

export { SeriesChart } from "./SeriesChart";
export type { SeriesChartProps } from "@/lib/types/chart";
