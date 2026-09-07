import type { Metadata } from "next";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site } from "@/lib/site";
import { getProjects } from "@/lib/projects";
import { breadcrumbSchema } from "@/lib/schema-org";
import { PageHero, FieldRow } from "@/components/primitives/TitleBlock";
import { Band } from "@/components/primitives/Band";
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
        <PageHero title={m.work.heading} lede={m.work.metaDescription}>
          <FieldRow
            className="mt-5 max-w-xl"
            fields={[
              { label: m.work.heading, value: String(projects.length) },
              {
                label: m.fields.year,
                value: String(Math.max(...projects.map((p) => p.year))),
              },
              { label: m.fields.base, value: site.address.city },
            ]}
          />
        </PageHero>
      </Band>

      <Band className="border-t border-rule">
        <WorkList projects={rows} locale={l} messages={m} />
      </Band>

      <CtaBand locale={l} messages={m} />
    </>
  );
}
