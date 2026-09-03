import type { Metadata } from "next";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site, serviceLines } from "@/lib/site";
import { faqSchema, breadcrumbSchema } from "@/lib/schema-org";
import { TitleBlock } from "@/components/primitives/TitleBlock";
import { Section, SectionHead } from "@/components/primitives/SectionHead";
import { Cta } from "@/components/primitives/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/sections/FaqList";
import { ProcessGrid } from "@/components/sections/ProcessGrid";
import {
  Label,
  DimensionRule,
  NodeTrace,
} from "@/components/primitives/drafting";

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

      <TitleBlock
        className="mt-6"
        fields={[
          { label: m.fields.practice, value: lead.name },
          { label: m.services.supportingLabel, value: `${ordered.length - 1} lines` },
          { label: m.fields.base, value: site.address.city },
        ]}
      >
        <h1 className="max-w-[20ch] text-h1">{m.services.heading}</h1>
        <p className="max-w-[58ch] text-lede text-ink-muted">
          {site.description}
        </p>
      </TitleBlock>

      {/* One page, three depths. Each line is a section rather than a
          separate page, so the site never claims to be three businesses. */}
      {ordered.map((service, i) => (
        <Section key={service.id} id={service.id} labelledBy={`${service.id}-h`}>
          <SectionHead
            id={`${service.id}-h`}
            code={`0${i + 1}`}
            title={service.name}
            note={service.lead ? m.services.leadLabel : m.services.supportingLabel}
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
            <div className="grid content-start gap-5">
              <p className="max-w-prose text-lede text-ink">
                {service.summary}
              </p>

              <div className="grid gap-3">
                <Label>{m.services.includesLabel}</Label>
                <DimensionRule />
                <ul className="grid gap-2.5">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <NodeTrace length={14} className="mt-2.5 shrink-0" />
                      <span className="text-small text-ink-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="grid content-start gap-3 border border-rule bg-sheet p-5">
              <Label>{m.services.stackLabel}</Label>
              <DimensionRule tone="accent" />
              <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                {service.stack.map((tech) => (
                  <li
                    key={tech}
                    className="font-data text-micro text-ink-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </Section>
      ))}

      <Section labelledBy="process">
        <SectionHead id="process" title={m.home.processHeading} />
        <ProcessGrid />
      </Section>

      <Section labelledBy="faq">
        <SectionHead id="faq" title={m.home.faqHeading} />
        <FaqList />
      </Section>

      <Section>
        <div className="flex flex-wrap items-center gap-6 border border-ink bg-sheet p-8">
          <h2 className="text-h2">{m.contact.heading}</h2>
          <span className="flex-1" />
          <Cta href={localePath(l, "/contact")}>{m.common.startProject}</Cta>
        </div>
      </Section>
    </>
  );
}
