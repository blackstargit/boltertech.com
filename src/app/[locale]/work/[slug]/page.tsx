import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site } from "@/lib/site";
import { getProject, getProjects, getAdjacentProject } from "@/lib/projects";
import { projectSchema, breadcrumbSchema } from "@/lib/schema-org";
import { localeCodes } from "@/lib/i18n";
import { TitleBlock } from "@/components/primitives/TitleBlock";
import { Section, SectionHead } from "@/components/primitives/SectionHead";
import { MetricRow } from "@/components/primitives/MetricTile";
import { Prose } from "@/components/primitives/Prose";
import { Cta } from "@/components/primitives/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Label, DimensionRule, Arrow } from "@/components/primitives/drafting";

/** Every project, in every locale, prerendered. */
export function generateStaticParams() {
  return localeCodes.flatMap((locale) =>
    getProjects().map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: localePath(locale as Locale, `/work/${slug}`),
      languages: languageAlternates(`/work/${slug}`),
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const m = await getMessages(l);

  const project = getProject(slug);
  if (!project || project.draft) notFound();

  const next = getAdjacentProject(slug);

  /**
   * The conditional-client rule.
   *
   * A named client is a trust signal; an unnamed one still needs a sector
   * so the reader knows the shape of the business. Never an empty label,
   * never a "Confidential Client" placeholder.
   */
  const clientField = project.client
    ? { label: m.fields.client, value: project.client }
    : {
        label: m.fields.sector,
        value: project.clientSector,
        note: m.common.clientWithheld,
      };

  return (
    <article>
      <JsonLd
        schema={[
          projectSchema(l, project),
          breadcrumbSchema(l, [
            { name: site.name, path: "/" },
            { name: m.work.heading, path: "/work" },
            { name: project.title, path: `/work/${project.slug}` },
          ]),
        ]}
      />

      <TitleBlock
        className="mt-6"
        fields={[
          clientField,
          { label: m.fields.category, value: m.categories[project.category] },
          { label: m.fields.duration, value: project.duration },
          { label: m.fields.year, value: String(project.year) },
          { label: m.fields.status, value: project.status },
        ]}
      >
        <Link
          href={localePath(l, "/work")}
          className="justify-self-start font-data text-label tracking-[0.07em] text-ink-muted uppercase hover:text-accent"
        >
          <span className="mirror-x inline-block">&larr;</span>{" "}
          {m.common.backToWork}
        </Link>
        <h1 className="max-w-[20ch] text-h1">{project.title}</h1>
        <p className="max-w-[56ch] text-lede text-ink-muted">
          {project.summary}
        </p>

        {/* Links appear only when the project has them. A demo on a
            subdomain, a repository, a writeup — any number, any mix. */}
        {project.links.length > 0 ? (
          <div className="flex flex-wrap items-center gap-4">
            {project.links.map((link) => (
              <Cta
                key={link.url}
                href={link.url}
                external
                variant={link.type === "demo" ? "solid" : "quiet"}
              >
                {link.label}
              </Cta>
            ))}
          </div>
        ) : null}
      </TitleBlock>

      {/* Stack is its own strip rather than a title-block field, because
          it is a list and would blow out the field row. */}
      {project.stack.length > 0 ? (
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border border-rule bg-sheet px-5 py-3">
          <Label>{m.fields.stack}</Label>
          <ul className="flex flex-wrap gap-x-3 gap-y-1">
            {project.stack.map((tech) => (
              <li key={tech} className="font-data text-micro text-ink-muted">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {project.metrics.length > 0 ? (
        <Section labelledBy="outcome">
          <SectionHead id="outcome" title={m.work.outcomeHeading} />
          <MetricRow metrics={project.metrics} />
        </Section>
      ) : null}

      <div className="mt-section">
        <Prose source={project.body} />
      </div>

      {project.testimonial ? (
        <Section labelledBy="testimonial">
          <SectionHead id="testimonial" title={m.work.testimonialHeading} />
          <figure className="border-s-2 border-accent bg-sheet px-6 py-5">
            <blockquote className="max-w-prose text-lede text-ink">
              &ldquo;{project.testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 grid gap-1">
              <DimensionRule tone="accent" className="max-w-24" />
              <span className="text-small text-ink">
                {project.testimonial.author}
              </span>
              {project.testimonial.role ? (
                <Label>{project.testimonial.role}</Label>
              ) : null}
            </figcaption>
          </figure>
        </Section>
      ) : null}

      {next ? (
        <Section>
          <Link
            href={localePath(l, `/work/${next.slug}`)}
            className="group flex flex-wrap items-center gap-4 border border-ink bg-sheet p-6"
          >
            <span className="grid gap-1">
              <Label>{m.common.nextProject}</Label>
              <span className="font-display text-h3 font-bold tracking-[-0.02em] transition-colors group-hover:text-accent">
                {next.title}
              </span>
            </span>
            <span className="flex-1" />
            <Arrow className="text-accent" />
          </Link>
        </Section>
      ) : null}
    </article>
  );
}
