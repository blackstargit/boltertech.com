import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site } from "@/lib/site";
import { getProject, getProjects, getAdjacentProject } from "@/lib/projects";
import { projectSchema, breadcrumbSchema } from "@/lib/schema-org";
import { localeCodes } from "@/lib/i18n";
import { PageHero, FieldRow } from "@/components/primitives/TitleBlock";
import { SectionHead } from "@/components/primitives/SectionHead";
import { Band } from "@/components/primitives/Band";
import { ChipRow } from "@/components/primitives/Chip";
import { MetricRow, SeriesChart } from "@/components/primitives/MetricTile";
import { Prose } from "@/components/primitives/Prose";
import { Cta } from "@/components/primitives/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Label, Arrow } from "@/components/primitives/drafting";
import { Placeholder } from "@/components/primitives/Placeholder";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";

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

  /**
   * Pre-launch, a case study with no testimonial shows the shape one will
   * take rather than closing straight into the next-project link. Marked
   * so it is never mistaken for a quote we have permission to publish.
   */
  const testimonial = project.testimonial
    ? { ...project.testimonial, isPlaceholder: false }
    : SHOW_PLACEHOLDERS
      ? {
          quote: m.placeholders.testimonialQuote,
          author: m.placeholders.testimonialAuthor,
          role: m.placeholders.testimonialRole,
          isPlaceholder: true,
        }
      : null;

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

      <Band>
        <PageHero
          eyebrow={
            <Link
              href={localePath(l, "/work")}
              className="justify-self-start font-data text-label font-medium tracking-[0.16em] text-ink-faint uppercase transition-colors hover:text-accent"
            >
              <span className="mirror-x inline-block">&larr;</span>{" "}
              {m.common.backToWork}
            </Link>
          }
          title={project.title}
          lede={project.summary}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-data text-micro font-medium tracking-[0.13em] text-ink-faint uppercase">
            <span className="text-accent">
              {m.categories[project.category]}
            </span>
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
            <span>{project.year}</span>
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
            <span>{project.status}</span>
          </div>

          {/* Links appear only when the project has them. A demo on a
              subdomain, a repository, a writeup — any number, any mix. */}
          {project.links.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              {project.links.map((link) => (
                <Cta
                  key={link.url}
                  href={link.url}
                  external
                  variant={link.type === "demo" ? "solid" : "outline"}
                >
                  {link.label}
                </Cta>
              ))}
            </div>
          ) : null}

          <FieldRow
            className="mt-5"
            fields={[
              clientField,
              { label: m.fields.duration, value: project.duration },
              { label: m.fields.year, value: String(project.year) },
              { label: m.fields.status, value: project.status },
            ]}
          />
        </PageHero>

        {/* Stack is its own strip rather than a field, because it is a
            list and would blow out the field row. */}
        {project.stack.length > 0 ? (
          <div className="mt-8 grid gap-3">
            <Label>{m.fields.stack}</Label>
            <ChipRow items={project.stack} />
          </div>
        ) : null}

        {/* Cover screenshot, when there is one. Cropped to a fixed ratio so
            any source image drops in without distorting the page rhythm.
            Files live in public/work/<slug>/ — see that folder's README. */}
        {project.cover ? (
          <Image
            src={project.cover}
            alt={project.title}
            width={1600}
            height={900}
            priority
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="mt-10 aspect-[16/9] w-full rounded-md border border-rule object-cover"
          />
        ) : (
          <Placeholder
            className="mt-10 aspect-[16/9] content-center"
            notice={m.placeholders.notice}
            label={m.placeholders.cover}
            hint={m.placeholders.coverHint}
          />
        )}
      </Band>

      {project.metrics.length > 0 ? (
        <Band tone="light" labelledBy="outcome">
          <SectionHead id="outcome" title={m.work.outcomeHeading} />
          <MetricRow metrics={project.metrics} />
          <SeriesChart
            series={project.series}
            label={project.seriesLabel || undefined}
            caption={project.duration || undefined}
            height="h-[180px]"
            placeholder={{
              notice: m.placeholders.notice,
              label: m.placeholders.chart,
            }}
          />
        </Band>
      ) : null}

      <Band>
        <Prose source={project.body} />
      </Band>

      {/* A real testimonial, or — pre-launch only — the shape one will
          take. The placeholder is dashed and muted rather than
          accent-bordered, so it cannot be read as a quote we actually
          have permission to publish. */}
      {testimonial ? (
        <Band labelledBy="testimonial" className="border-t border-rule">
          <SectionHead id="testimonial" title={m.work.testimonialHeading} />
          <figure
            className={
              testimonial.isPlaceholder
                ? "hatch rounded-e-md border-s-2 border-dashed border-rule px-8 py-7"
                : "rounded-e-md border-s-2 border-accent bg-sheet px-8 py-7"
            }
          >
            {testimonial.isPlaceholder ? (
              <span className="mb-4 block font-data text-label font-medium tracking-[0.16em] text-ink-faint uppercase">
                [ {m.placeholders.notice} &middot; {m.placeholders.testimonial}{" "}
                ]
              </span>
            ) : null}
            <blockquote className="max-w-prose font-display text-h3 leading-snug font-normal text-pretty text-ink">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 grid gap-1.5">
              <span className="text-small text-ink">{testimonial.author}</span>
              {testimonial.role ? <Label>{testimonial.role}</Label> : null}
            </figcaption>
          </figure>
        </Band>
      ) : null}

      {next ? (
        <Band tone="light">
          <Link
            href={localePath(l, `/work/${next.slug}`)}
            className="group flex flex-wrap items-center gap-4 rounded-md border border-rule bg-sheet p-7 transition-colors hover:border-ink"
          >
            <span className="grid gap-2">
              <Label>{m.common.nextProject}</Label>
              <span className="font-display text-h3 font-medium tracking-[-0.02em] transition-colors group-hover:text-accent">
                {next.title}
              </span>
            </span>
            <span className="flex-1" />
            <Arrow className="text-h3 text-accent transition-transform group-hover:translate-x-1" />
          </Link>
        </Band>
      ) : null}
    </article>
  );
}
