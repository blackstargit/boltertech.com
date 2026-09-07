import Link from "next/link";

import { Arrow, Label } from "@/components/primitives/drafting";
import { ChipRow } from "@/components/primitives/Chip";
import { MetricRow, SeriesChart } from "@/components/primitives/MetricTile";
import type { ProjectEntry } from "@/lib/projects";
import { localePath, type Locale, type Messages } from "@/lib/i18n";

/**
 * Outcome board — one tab per project that has measured results.
 *
 * No JavaScript: a native radio group drives `.tabset` in globals.css,
 * which also documents the markup contract this component has to keep
 * (inputs first, exactly one <div> for the labels, panels as <article>).
 * Reordering the children here will silently break the panel mapping.
 *
 * Renders nothing when no project has metrics yet, and degrades to a
 * single untabbed panel when only one does.
 */
export function OutcomeTabs({
  projects,
  locale,
  messages,
}: {
  projects: ProjectEntry[];
  locale: Locale;
  messages: Messages;
}) {
  const withMetrics = projects.filter((p) => p.metrics.length > 0).slice(0, 6);
  if (withMetrics.length === 0) return null;

  return (
    <div className="tabset grid gap-7">
      {withMetrics.map((p, i) => (
        <input
          key={`radio-${p.slug}`}
          type="radio"
          name="outcome-tab"
          id={`outcome-${p.slug}`}
          defaultChecked={i === 0}
          aria-label={p.clientSector}
        />
      ))}

      {/* Exactly one <div>, per the .tabset contract. */}
      <div className="flex flex-wrap gap-2">
        {withMetrics.map((p) => (
          <label
            key={`label-${p.slug}`}
            htmlFor={`outcome-${p.slug}`}
            className="cursor-pointer rounded-sm border border-rule px-4 py-3 font-data text-micro font-medium text-ink-muted transition-colors select-none hover:border-ink hover:text-ink"
          >
            {p.clientSector}
          </label>
        ))}
      </div>

      {withMetrics.map((p) => (
        <article
          key={`panel-${p.slug}`}
          className="gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
        >
          <div className="grid content-start gap-4 rounded-md border border-rule bg-sheet p-6 sm:p-7">
            <Label>{messages.fields.sector}</Label>
            <h3 className="text-h3">{p.clientSector}</h3>
            <p className="text-small text-pretty text-ink-muted">{p.summary}</p>
            <ChipRow
              items={p.stack}
              className="mt-2 border-t border-rule pt-5"
            />
            <Link
              href={localePath(locale, `/work/${p.slug}`)}
              className="mt-2 inline-flex items-center gap-2 justify-self-start border-b border-accent pb-1 text-small font-semibold text-accent transition-colors hover:border-ink hover:text-ink"
            >
              {messages.common.readCaseStudy} <Arrow />
            </Link>
          </div>

          <div className="grid content-start gap-9 rounded-md border border-rule bg-sheet p-6 sm:p-7">
            <MetricRow metrics={p.metrics} />
            {/* A wireframe unless the case study carries a real series. */}
            <SeriesChart
              series={p.series}
              label={p.seriesLabel || undefined}
              caption={p.duration || undefined}
              placeholder={{
                notice: messages.placeholders.notice,
                label: messages.placeholders.chart,
              }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
