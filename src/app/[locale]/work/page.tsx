import type { Metadata } from "next";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site } from "@/lib/site";
import { getProjects } from "@/lib/projects";
import { breadcrumbSchema } from "@/lib/schema-org";
import { TitleBlock } from "@/components/primitives/TitleBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { WorkList } from "@/components/work/WorkList";

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

      <TitleBlock
        className="mt-6"
        fields={[
          { label: "Projects", value: String(projects.length) },
          {
            label: "Latest",
            value: String(Math.max(...projects.map((p) => p.year))),
          },
          { label: m.fields.base, value: site.address.city },
        ]}
      >
        <h1 className="max-w-[16ch] text-h1">{m.work.heading}</h1>
        <p className="max-w-[56ch] text-lede text-ink-muted">
          {m.work.metaDescription}
        </p>
      </TitleBlock>

      <div className="mt-12">
        <WorkList projects={rows} locale={l} messages={m} />
      </div>
    </>
  );
}
