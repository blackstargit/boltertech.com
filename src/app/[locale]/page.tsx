import type { Metadata } from "next";
import Link from "next/link";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site, serviceLines } from "@/lib/site";
import { getFeaturedProjects } from "@/lib/projects";
import { PageHero, FieldRow } from "@/components/primitives/TitleBlock";
import { SectionHead } from "@/components/primitives/SectionHead";
import { Band } from "@/components/primitives/Band";
import { SeriesChart } from "@/components/primitives/MetricTile";
import { Cta } from "@/components/primitives/Cta";
import { Arrow, Label, PulseDot } from "@/components/primitives/drafting";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema } from "@/lib/schema-org";
import { FaqList } from "@/components/sections/FaqList";
import { ProcessGrid } from "@/components/sections/ProcessGrid";
import { OutcomeTabs } from "@/components/sections/OutcomeTabs";
import { WorkTable } from "@/components/sections/WorkTable";
import { CtaBand } from "@/components/sections/CtaBand";
import { Ticker } from "@/components/sections/Ticker";
import { EstimateLauncher } from "@/components/estimate/EstimateLauncher";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);
  return {
    title: m.home.metaTitle,
    description: m.home.metaDescription,
    alternates: {
      canonical: localePath(locale as Locale),
      languages: languageAlternates("/"),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const m = await getMessages(l);

  const projects = getFeaturedProjects(4);
  const lead = serviceLines.find((s) => s.lead) ?? serviceLines[0];
  /* The snapshot chart shows the first project that carries a series.
     None do today, so SeriesChart renders nothing — by design. */
  const charted = projects.find((p) => p.series);

  return (
    <>
      <JsonLd schema={organizationSchema()} />

      {/* ── 01 · Hero ─────────────────────────────────────────────────
          Two columns: the claim on one side, evidence on the other. The
          facts strip answers "are these people real" before a visitor
          reads a word of marketing copy, which is what directory
          referrals and cold outbound clicks are actually checking. */}
      <Band flush className="py-hero">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <PageHero
            title={site.tagline}
            lede={m.home.heroSub}
            /* The eyebrow carries a live dot, so it reads as a standing
               statement of fact rather than a decorative kicker. */
            eyebrow={
              <div className="flex items-center gap-2.5">
                <PulseDot />
                <Label>
                  {lead.name} &middot; {m.fields.established} {site.founded}
                </Label>
              </div>
            }
          >
            <div className="flex flex-wrap items-center gap-3">
              <Cta href={localePath(l, "/contact")}>
                {m.common.startProject}
              </Cta>
              <Cta href={localePath(l, "/work")} variant="outline">
                {m.common.seeWork}
              </Cta>
            </div>

            <FieldRow
              className="mt-5"
              fields={[
                { label: m.fields.established, value: String(site.founded) },
                { label: m.fields.practice, value: lead.name },
              ]}
            />
          </PageHero>

          {/* Engagement snapshot. Every row is a real project file — the
              stat is that project's first metric, and a project without
              one simply renders without a stat rather than with a zero. */}
          <aside className="overflow-hidden rounded-md border border-rule bg-sheet">
            <div className="flex items-center gap-2.5 border-b border-rule px-5 py-3.5">
              <PulseDot />
              <Label>{m.home.snapshotHeading}</Label>
            </div>
            <div className="px-5 pt-2 pb-6">
              {projects.map((p) => (
                <Link
                  key={p.slug}
                  href={localePath(l, `/work/${p.slug}`)}
                  className="group flex items-baseline gap-4 border-b border-rule-faint py-3.5 last:border-b-0"
                >
                  <span className="min-w-9 font-data text-micro text-ink-faint">
                    {p.year}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium transition-colors group-hover:text-accent">
                      {p.title}
                    </span>
                    <span className="block text-small text-ink-faint">
                      {p.clientSector}
                      {p.duration ? ` · ${p.duration}` : ""}
                    </span>
                  </span>
                  {p.metrics[0] ? (
                    <b className="shrink-0 font-display text-h4 font-semibold text-accent tabular-nums">
                      {p.metrics[0].value}
                    </b>
                  ) : null}
                </Link>
              ))}

              {/* Telemetry series chart for lead featured engagement */}
              <SeriesChart
                series={charted?.series}
                label={charted?.seriesLabel || undefined}
                caption={charted?.duration || undefined}
                height="h-[104px]"
                placeholder={{
                  notice: m.placeholders.notice,
                  label: m.placeholders.chart,
                }}
              />
            </div>
          </aside>
        </div>
      </Band>

      {/* ── 02 · Ticker ─────────────────────────────────────────────── */}
      <Band flush className="border-y border-rule">
        <Ticker />
      </Band>

      {/* ── 03 · One practice, four depths ────────────────────────────
          Presented as one offer rather than four storefronts. This is
          where "we do everything" gets defused instead of confirmed. */}
      <Band tone="light" labelledBy="offer">
        <SectionHead
          id="offer"
          eyebrow={m.services.heading}
          title={m.home.offerHeading}
          note={
            <Link
              href={localePath(l, "/services")}
              className="inline-flex items-center gap-2 border-b-[1.5px] border-ink pb-1 font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              {m.home.capabilitiesLabel} <Arrow />
            </Link>
          }
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-px overflow-hidden rounded-md border border-rule bg-rule">
          {serviceLines.map((s, i) => (
            <Link
              key={s.id}
              href={localePath(l, `/services#${s.id}`)}
              className="group flex min-h-72 flex-col gap-4 bg-sheet p-7 transition-colors hover:bg-plate"
            >
              <div className="flex items-center justify-between gap-3">
                <Label className="group-hover:text-ink-invert">
                  {s.lead ? m.services.leadLabel : m.services.supportingLabel}
                </Label>
                {/* No opacity here: --ink-faint is already the contrast
                    floor, and dimming it further put this at 2.42:1. */}
                <Label className="group-hover:text-ink-invert">
                  {String(i + 1).padStart(2, "0")}
                </Label>
              </div>
              <h3 className="text-h3 group-hover:text-ink-invert">{s.name}</h3>
              <p className="text-small text-pretty text-ink-muted group-hover:text-ink-invert">
                {s.summary}
              </p>
              {/* The whole card is the link, so this is an affordance and
                  not a second call to action — no label, nothing to
                  translate, and no invented copy. */}
              <Arrow className="mt-auto text-h4 text-accent transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </Band>

      {/* ── 04 · Outcomes ─────────────────────────────────────────────
          Pulled from real project frontmatter, never hand-written here.
          Edit a case study and this updates; the whole band disappears
          when no project carries metrics. */}
      <Band labelledBy="outcomes">
        <SectionHead
          id="outcomes"
          eyebrow={m.work.outcomeHeading}
          title={m.home.outcomesHeading}
        />
        <OutcomeTabs projects={projects} locale={l} messages={m} />
      </Band>

      {/* ── 05 · Selected work ────────────────────────────────────────
          Above process because the portfolio is the stated centrepiece
          and these rows are the highest-intent click on the page. */}
      <Band tone="light" labelledBy="work">
        <SectionHead
          id="work"
          title={m.home.workHeading}
          note={
            <Link
              href={localePath(l, "/work")}
              className="inline-flex items-center gap-2 border-b-[1.5px] border-ink pb-1 font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              {m.common.backToWork} <Arrow />
            </Link>
          }
        />
        <WorkTable projects={projects} locale={l} messages={m} />
      </Band>

      {/* ── 06 · How we work ──────────────────────────────────────────
          Numbered because this genuinely is a sequence. Carries real
          weight while the portfolio is still filling in. */}
      <Band labelledBy="process">
        <SectionHead id="process" title={m.home.processHeading} />
        <ProcessGrid />
      </Band>

      {/* ── 07 · FAQ ──────────────────────────────────────────────────
          Native <details>, so it works without JavaScript and costs
          nothing in INP. FAQPage JSON-LD is emitted on /services. */}
      <Band tone="light" labelledBy="faq">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <h2 id="faq" className="max-w-[16ch] text-h2">
            {m.home.faqHeading}
          </h2>
          <FaqList />
        </div>
      </Band>

      {/* ── 08 · Contact band ───────────────────────────────────────────
          Dark so the alternation is unbroken, and so the amber button is
          the last and brightest thing on the page. */}
      <CtaBand locale={l} messages={m} tone="dark" />

      {/* Sticky launcher, bottom-start. Server-rendered with a CSS-only
          dismiss, so the homepage still ships no client JavaScript. */}
      <EstimateLauncher locale={l} messages={m} />
    </>
  );
}
