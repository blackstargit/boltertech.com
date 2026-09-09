import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import type { SeriesChartProps } from "@/lib/types/chart";

const PLACEHOLDER_SERIES = [88, 81, 84, 72, 66, 68, 57, 49, 44, 39, 36, 34];

/**
 * Telemetry bar chart for project outcome series.
 *
 * Features:
 * - Proper tag in the header with start-to-end delta summary.
 * - Horizontal baseline and 50% / 100% reference guidelines.
 * - Clear 3-point timeline on the X-axis (Baseline -> Automated -> Steady-state).
 */
export function SeriesChart({
  series,
  label,
  caption,
  height = "h-[140px]",
  placeholder,
}: SeriesChartProps) {
  const isPlaceholder = !series || series.length === 0;
  if (isPlaceholder && !(SHOW_PLACEHOLDERS && placeholder)) return null;

  const data = isPlaceholder ? PLACEHOLDER_SERIES : series!;
  const turn = Math.floor(data.length * 0.6);

  // Baseline, final, and percentage change calculation
  const startVal = data[0] ?? 0;
  const endVal = data[data.length - 1] ?? 0;
  const delta = endVal - startVal;
  const pctChange = startVal !== 0 ? Math.round((delta / startVal) * 100) : 0;
  const deltaSign = delta > 0 ? `+${pctChange}%` : `${pctChange}%`;

  const heading = isPlaceholder ? placeholder!.label : label;

  return (
    <figure className="m-0 select-none">
      {/* ── Header: Metric Tag & Delta Summary ────────────────────── */}
      <figcaption className="mb-3.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        {heading && (
          <span className="font-data text-label font-medium tracking-[0.16em] text-ink-faint uppercase">
            {heading}
          </span>
        )}

        <div className="flex items-center gap-2 font-data text-micro text-ink-faint">
          {isPlaceholder ? (
            <span>[ {placeholder!.notice} ]</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="tabular-nums">
                {startVal} &rarr; {endVal}
              </span>
              <span className="rounded-xs border border-accent/30 bg-accent-soft px-1.5 py-0.5 font-semibold text-accent tabular-nums">
                {deltaSign}
              </span>
              {caption ? (
                <span className="hidden text-ink-faint sm:inline">
                  &middot; {caption}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </figcaption>

      {/* ── Chart Area with Reference Guidelines & Solid Bars ─────── */}
      <div className="relative">
        {/* Horizontal reference guidelines */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 flex flex-col justify-between ${height}`}
        >
          <div className="w-full border-b border-dashed border-rule-faint/50" />
          <div className="w-full border-b border-dashed border-rule-faint/35" />
          <div className="w-full border-b border-rule" />
        </div>

        {/* Vertical Bars */}
        <div
          aria-hidden="true"
          className={`relative z-10 flex items-end gap-1.5 ${height}`}
        >
          {data.map((value, i) => {
            const isAccent = i > turn;

            return (
              <span
                key={i}
                className={`block flex-1 rounded-t-xs ${isAccent ? "bg-accent" : "bg-rule"}`}
                style={{ blockSize: `${Math.max(value, 4)}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* ── Timeline Footer (X-Axis) ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className="flex items-center justify-between pt-2.5 font-data text-micro tracking-[0.08em] text-ink-faint uppercase"
      >
        <span>Baseline</span>
        <span className="flex items-center gap-1.5 text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          <span>Automated</span>
        </span>
        <span>Steady-State</span>
      </div>
    </figure>
  );
}
