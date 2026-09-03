import type { Metadata } from "next";
import Link from "next/link";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { site, serviceLines } from "@/lib/site";
import { getFeaturedProjects, getHeadlineMetrics } from "@/lib/projects";
import { TitleBlock } from "@/components/primitives/TitleBlock";
import { SectionHead, Section } from "@/components/primitives/SectionHead";
import { MetricRow } from "@/components/primitives/MetricTile";
import { Cta } from "@/components/primitives/Cta";
import { Label, DimensionRule, Arrow } from "@/components/primitives/drafting";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema } from "@/lib/schema-org";
import { FaqList } from "@/components/sections/FaqList";
import { ProcessGrid } from "@/components/sections/ProcessGrid";

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
    alternates: { canonical: localePath(locale as Locale) },
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
  const metrics = getHeadlineMetrics(3);
  const lead = serviceLines.find((s) => s.lead) ?? serviceLines[0];

  return (
    <>
      <JsonLd schema={organizationSchema()} />

      {/* ── 01 · Title block hero ─────────────────────────────────────
          The fields answer "are these people real" before a visitor reads
          a word of marketing copy, which is what directory referrals and
          cold outbound clicks are actually checking. */}
      <TitleBlock
        className="mt-6"
        fields={[
          { label: m.fields.established, value: String(site.founded) },
          {
            label: m.fields.base,
            value: `${site.address.city}, ${site.address.country}`,
          },
          { label: m.fields.team, value: `${site.teamSize} engineers` },
          { label: m.fields.practice, value: lead.name },
        ]}
      >
        <h1 className="max-w-[18ch] text-h1">{site.tagline}</h1>
        <p className="max-w-[54ch] text-lede text-ink-muted">
          {m.home.heroSub}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Cta href={localePath(l, "/contact")}>{m.common.startProject}</Cta>
          <Cta href={localePath(l, "/work")} variant="quiet">
            {m.common.seeWork}
          </Cta>
        </div>
      </TitleBlock>

      {/* ── 02 · One practice, three depths ───────────────────────────
          Presented as one offer rather than three storefronts. This is
          where "we do everything" gets defused instead of confirmed. */}
      <Section labelledBy="offer">
        <SectionHead
          id="offer"
          title={m.home.offerHeading}
          note={m.services.heading}
        />
        <div className="grid gap-px border border-rule bg-rule lg:grid-cols-3">
          {serviceLines.map((s) => (
            <Link
              key={s.id}
              href={localePath(l, `/services#${s.id}`)}
              className="group grid gap-3 bg-sheet p-6 transition-colors hover:bg-accent-soft"
            >
              <Label>{s.lead ? m.services.leadLabel : m.services.supportingLabel}</Label>
              <h3 className="text-h3 group-hover:text-accent">{s.name}</h3>
              <DimensionRule tone="accent" />
              <p className="text-small text-ink-muted">{s.summary}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* ── 03 · Selected work ────────────────────────────────────────
          Above process because the portfolio is the stated centrepiece
          and these rows are the highest-intent click on the page. */}
      <Section labelledBy="work">
        <SectionHead
          id="work"
          title={m.home.workHeading}
          note={
            <Link href={localePath(l, "/work")} className="hover:text-accent">
              {m.common.backToWork} <Arrow />
            </Link>
          }
        />
        <ul className="border-t border-rule">
          {projects.map((p, i) => (
            <li key={p.slug} className="border-b border-rule">
              <Link
                href={localePath(l, `/work/${p.slug}`)}
                className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-3.5"
              >
                <Label>{`W-${String(i + 1).padStart(2, "0")}`}</Label>
                <span className="text-body transition-colors group-hover:text-accent">
                  {p.title}
                </span>
                <Label>{m.categories[p.category]}</Label>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── 04 · Outcome band ─────────────────────────────────────────
          Pulled from real project frontmatter, never hand-written here.
          Edit a case study and this updates. Hidden entirely when no
          project carries metrics yet. */}
      {metrics.length > 0 ? (
        <Section labelledBy="outcomes">
          <SectionHead id="outcomes" title={m.home.outcomesHeading} />
          <MetricRow metrics={metrics} />
        </Section>
      ) : null}

      {/* ── 05 · How we work ──────────────────────────────────────────
          Numbered because this genuinely is a sequence. Carries real
          weight while the portfolio is still filling in. */}
      <Section labelledBy="process">
        <SectionHead id="process" title={m.home.processHeading} />
        <ProcessGrid />
      </Section>

      {/* ── 06 · FAQ ──────────────────────────────────────────────────
          Native <details>, so it works without JavaScript and costs
          nothing in INP. FAQPage JSON-LD is emitted on /services. */}
      <Section labelledBy="faq">
        <SectionHead id="faq" title={m.home.faqHeading} />
        <FaqList />
      </Section>

      {/* ── 07 · Contact band ─────────────────────────────────────────── */}
      <Section>
        <div className="flex flex-wrap items-center gap-6 border border-ink bg-sheet p-8">
          <div className="grid gap-1">
            <h2 className="text-h2">{m.contact.heading}</h2>
            <p className="text-small text-ink-muted">
              {site.email} &middot;{" "}
              <span dir="ltr">{site.phone}</span> &middot; replies{" "}
              {site.responseTime}
            </p>
          </div>
          <span className="flex-1" />
          <Cta href={localePath(l, "/contact")}>{m.common.startProject}</Cta>
        </div>
      </Section>
    </>
  );
}
