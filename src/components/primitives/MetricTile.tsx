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
 * Pre-launch, an absent slot instead draws a dashed monochrome wireframe
 * so the layout can be judged before the data exists. Wireframes never
 * take the accent colour, which belongs to measured figures alone. See
 * src/lib/placeholders.ts.
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
        /* An empty dashed track, so the device is visible before anyone
           has decided what proportion this figure is of. */
        <span
          aria-hidden="true"
          className="mt-1 block h-[5px] rounded-xs border border-dashed border-rule"
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

/** The footprint a real series will occupy. Drawn as an outline only. */
const PLACEHOLDER_SERIES = [88, 81, 84, 72, 66, 68, 57, 49, 44, 39, 36, 34];

/**
 * Bar chart for a project's `series`. Columns past the midpoint take the
 * accent, so the eye reads the direction of travel without needing a key.
 *
 * With no series: a captioned wireframe if `placeholder` is supplied and
 * placeholders are on, otherwise null. Either way the caller does not
 * have to guard.
 */

export function SeriesChart({
  series,
  label,
  caption,
  height = "h-[150px]",
  placeholder,
}: {
  series?: number[];
  label?: string;
  caption?: string;
  height?: string;
  /** Captions shown when there is no series yet. Omit to render nothing. */
  placeholder?: { notice: string; label: string };
}) {
  const isPlaceholder = !series || series.length === 0;
  if (isPlaceholder && !(SHOW_PLACEHOLDERS && placeholder)) return null;

  const data = isPlaceholder ? PLACEHOLDER_SERIES : series!;
  const turn = Math.floor(data.length * 0.6);

  const heading = isPlaceholder ? placeholder!.label : label;
  const note = isPlaceholder ? `[ ${placeholder!.notice} ]` : caption;

  return (
    <figure className="m-0">
      {(heading || note) && (
        <figcaption className="mb-3.5 flex items-baseline justify-between gap-4">
          {heading && (
            <span className="font-data text-label font-medium tracking-[0.16em] text-ink-faint uppercase">
              {heading}
            </span>
          )}
          {note && (
            <span className="font-data text-micro text-ink-faint">{note}</span>
          )}
        </figcaption>
      )}
      <div aria-hidden="true" className={`flex items-end gap-1.5 ${height}`}>
        {data.map((value, i) => (
          <span
            key={i}
            className={`block flex-1 rounded-t-xs ${
              isPlaceholder
                ? "border border-b-0 border-dashed border-rule"
                : i > turn
                  ? "bg-accent"
                  : "bg-rule"
            }`}
            style={{ blockSize: `${Math.max(value, 2)}%` }}
          />
        ))}
      </div>
    </figure>
  );
}
