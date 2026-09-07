import type { Metadata } from "next";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site, serviceLines } from "@/lib/site";
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
                value: `${ordered.length - 1} lines`,
              },
              { label: m.fields.base, value: site.address.city },
            ]}
          />
        </PageHero>
      </Band>

      {/* One page, four depths. Each line is a section rather than a
          separate page, so the site never claims to be four businesses.
          The bands alternate so the four read as distinct depths rather
          than as one long scroll of identical blocks. */}
      {ordered.map((service, i) => (
        <Band
          key={service.id}
          id={service.id}
          tone={i % 2 === 0 ? "dark" : "light"}
          labelledBy={`${service.id}-h`}
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
            <div className="grid content-start gap-6">
              <SectionHead
                id={`${service.id}-h`}
                className="mb-0"
                eyebrow={`${String(i + 1).padStart(2, "0")} · ${
                  service.lead
                    ? m.services.leadLabel
                    : m.services.supportingLabel
                }`}
                title={service.name}
              />
              <p className="max-w-[46ch] text-lede text-pretty text-ink-muted">
                {service.summary}
              </p>
              <div className="grid gap-3">
                <Label>{m.services.stackLabel}</Label>
                <ChipRow items={service.stack} />
              </div>
            </div>

            {/* Lettered rather than numbered: these are facets of one
                offer, not an ordered sequence like the process steps. */}
            <ul className="grid gap-px overflow-hidden rounded-md border border-rule bg-rule">
              {service.includes.map((item, j) => (
                <li key={item} className="flex gap-4 bg-paper p-5 sm:p-6">
                  <span className="font-data text-micro font-medium text-accent">
                    {String.fromCharCode(97 + j)}
                  </span>
                  <span className="text-small text-pretty text-ink-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Band>
      ))}

      <Band labelledBy="process" className="border-t border-rule">
        <SectionHead id="process" title={m.home.processHeading} />
        <ProcessGrid />
      </Band>

      <Band labelledBy="faq" className="border-t border-rule">
        <SectionHead id="faq" title={m.home.faqHeading} />
        <FaqList />
      </Band>

      <CtaBand locale={l} messages={m} showContactDetails={false} />
    </>
  );
}
