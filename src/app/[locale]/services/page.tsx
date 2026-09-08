import type { Metadata } from "next";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site, serviceLines, engagementModels } from "@/lib/site";
import { faqSchema, breadcrumbSchema } from "@/lib/schema-org";
import { PageHero, FieldRow } from "@/components/primitives/TitleBlock";
import { SectionHead } from "@/components/primitives/SectionHead";
import { Band } from "@/components/primitives/Band";
import { ChipRow } from "@/components/primitives/Chip";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/sections/FaqList";
import { ProcessGrid } from "@/components/sections/ProcessGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { Label } from "@/components/primitives/drafting";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);
  return {
    title: m.services.metaTitle,
    description: m.services.metaDescription,
    alternates: {
      canonical: localePath(locale as Locale, "/services"),
      languages: languageAlternates("/services"),
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const m = await getMessages(l);

  // Lead practice first, supporting lines after — the page order enacts
  // the positioning rather than just asserting it in copy.
  const ordered = [...serviceLines].sort(
    (a, b) => Number(b.lead) - Number(a.lead),
  );
  const lead = ordered[0];

  return (
    <>
      {/* FAQPage schema lives here rather than on the homepage: this is
          where a buyer's objections actually surface, and it is the single
          highest-value structured-data addition for answer engines. */}
      <JsonLd
        schema={[
          faqSchema(),
          breadcrumbSchema(l, [
            { name: site.name, path: "/" },
            { name: m.services.heading, path: "/services" },
          ]),
        ]}
      />

      <Band>
        <PageHero
          eyebrow={m.home.capabilitiesLabel}
          title={m.services.heading}
          lede={site.description}
        >
          <FieldRow
            className="mt-5 max-w-xl"
            fields={[
              { label: m.fields.practice, value: lead.name },
              {
                label: m.services.supportingLabel,
                value: `${ordered.length} Fields of Work`,
              },
            ]}
          />
        </PageHero>
      </Band>

      {/* One practice, four depths — and one section, four blocks.
          These used to be four full-bleed bands, which read as four
          separate businesses and put a section break between the page
          heading and the lead practice. Stacked inside a single band with
          a rule between them, they read as depths of one offer, which is
          what the page is for. It also removes three section gaps' worth
          of empty space. */}
      <Band tone="light" labelledBy="practice">
        <SectionHead
          id="practice"
          eyebrow={m.services.heading}
          title={m.home.offerHeading}
        />
        <div className="grid gap-12">
          {ordered.map((service, i) => (
            <section
              key={service.id}
              id={service.id}
              aria-labelledby={`${service.id}-h`}
              className="grid scroll-mt-28 gap-8 border-t border-rule pt-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start"
            >
              <div className="grid content-start gap-5">
                <div className="flex items-baseline gap-3">
                  <Label tone="accent">{String(i + 1).padStart(2, "0")}</Label>
                  <Label>
                    {service.lead
                      ? m.services.leadLabel
                      : m.services.supportingLabel}
                  </Label>
                </div>
                <h3 id={`${service.id}-h`} className="text-h3">
                  {service.name}
                </h3>
                <p className="max-w-[46ch] text-pretty text-ink-muted">
                  {service.summary}
                </p>
                <div className="mt-1 grid gap-2.5">
                  <Label>{m.services.stackLabel}</Label>
                  <ChipRow items={service.stack} />
                </div>
              </div>

              {/* Lettered rather than numbered: these are facets of one
                  offer, not an ordered sequence like the process steps. */}
              <ul className="grid gap-px overflow-hidden rounded-md border border-rule bg-rule">
                {service.includes.map((item, j) => (
                  <li key={item} className="flex gap-4 bg-sheet p-5">
                    <span className="font-data text-micro font-medium text-accent">
                      {String.fromCharCode(97 + j)}
                    </span>
                    <span className="text-small text-pretty text-ink-muted">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Band>

      {/* How a client can buy. Three shapes rather than a price list —
          the no-pricing decision means this section carries the "what
          does working with you actually look like" question on its own. */}
      <Band labelledBy="engage">
        <SectionHead id="engage" title={m.services.engagementHeading} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-5">
          {engagementModels.map((e) => (
            <article
              key={e.id}
              className="flex flex-col gap-4 rounded-md border border-rule bg-sheet p-7"
            >
              <Label tone="accent">{e.kind}</Label>
              <h3 className="text-h3">{e.name}</h3>
              <p className="text-small text-pretty text-ink-muted">
                {e.summary}
              </p>
              <div className="mt-auto border-t border-rule pt-5">
                <Label className="mb-2 block">{m.services.termsLabel}</Label>
                <p className="font-data text-micro leading-relaxed text-ink">
                  {e.terms}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Band>

      <Band tone="light" labelledBy="process">
        <SectionHead id="process" title={m.home.processHeading} />
        <ProcessGrid />
      </Band>

      <Band labelledBy="faq">
        <SectionHead id="faq" title={m.home.faqHeading} />
        <FaqList />
      </Band>

      <CtaBand locale={l} messages={m} showContactDetails={false} />
    </>
  );
}
