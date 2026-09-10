import type { Metadata } from "next";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site } from "@/lib/site";
import { getProjects } from "@/lib/projects";
import { breadcrumbSchema } from "@/lib/schema-org";
import { PageHero, FieldRow } from "@/components/primitives/TitleBlock";
import { Band } from "@/components/primitives/Band";
import { Label } from "@/components/primitives/drafting";
import { ChipRow } from "@/components/primitives/Chip";
import { JsonLd } from "@/components/seo/JsonLd";
import { WorkList } from "@/components/work/WorkList";
import { CtaBand } from "@/components/sections/CtaBand";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);
  return {
    title: m.work.metaTitle,
    description: m.work.metaDescription,
    alternates: {
      canonical: localePath(locale as Locale, "/work"),
      languages: languageAlternates("/work"),
    },
  };
}

export default async function WorkIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const m = await getMessages(l);
  const projects = getProjects();
  // Distinct sectors, in the order the projects are already sorted.
  const sectors = [...new Set(projects.map((p) => p.clientSector))];

  // Only the fields the list needs cross to the client component; the
  // MDX bodies stay on the server.
  const rows = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    category: p.category,
    year: p.year,
    client: p.client,
    clientSector: p.clientSector,
  }));

  return (
    <>
      <JsonLd
        schema={breadcrumbSchema(l, [
          { name: site.name, path: "/" },
          { name: m.work.heading, path: "/work" },
        ])}
      />

      <Band>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,auto)] lg:items-start">
          <PageHero title={m.work.heading} lede={m.work.metaDescription}>
            <FieldRow
              className="mt-5 max-w-xl"
              fields={[
                { label: m.work.countLabel, value: String(projects.length) },
                {
                  label: m.fields.year,
                  value: String(Math.max(...projects.map((p) => p.year))),
                },
              ]}
            />
          </PageHero>

          {/* The sectors we have actually shipped into. Deliberately not
              the per-category counts — those are the filter chips a few
              hundred pixels below, and printing the same four numbers
              twice is padding, not information. A prospect scanning this
              page is looking for their own world in the list. */}
          <div className="grid max-w-2xl content-start gap-3 lg:justify-items-end">
            <Label>{m.work.sectorsLabel}</Label>
            <ChipRow items={sectors} className="lg:justify-end" />
          </div>
        </div>
      </Band>

      <Band tone="light">
        <WorkList projects={rows} locale={l} messages={m} />
      </Band>

      <CtaBand locale={l} messages={m} tone="dark" />
    </>
  );
}
