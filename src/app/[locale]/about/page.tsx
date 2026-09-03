import type { Metadata } from "next";
import Image from "next/image";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { site, team, serviceLines } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema-org";
import { TitleBlock } from "@/components/primitives/TitleBlock";
import { Section, SectionHead } from "@/components/primitives/SectionHead";
import { ProcessGrid } from "@/components/sections/ProcessGrid";
import { Cta } from "@/components/primitives/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Label, DimensionRule } from "@/components/primitives/drafting";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);
  return {
    title: m.about.metaTitle,
    description: m.about.metaDescription,
    alternates: { canonical: localePath(locale as Locale, "/about") },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const m = await getMessages(l);
  const lead = serviceLines.find((s) => s.lead) ?? serviceLines[0];

  return (
    <>
      <JsonLd
        schema={breadcrumbSchema(l, [
          { name: site.name, path: "/" },
          { name: m.about.heading, path: "/about" },
        ])}
      />

      <TitleBlock
        className="mt-6"
        fields={[
          { label: m.fields.established, value: String(site.founded) },
          { label: m.fields.team, value: `${site.teamSize} engineers` },
          { label: m.fields.practice, value: lead.name },
          {
            label: m.fields.base,
            value: `${site.address.city}, ${site.address.countryName}`,
          },
        ]}
      >
        <h1 className="max-w-[18ch] text-h1">{site.tagline}</h1>
        <p className="max-w-prose text-lede text-ink-muted">
          {site.description}
        </p>
      </TitleBlock>

      {/* Renders however many founders are in data/founders.json — two,
          three or five all lay out correctly without touching this file. */}
      <Section labelledBy="team">
        <SectionHead
          id="team"
          title={m.about.teamHeading}
          note={`${team.length}`}
        />
        <div className="grid gap-px border border-rule bg-rule md:grid-cols-2 lg:grid-cols-3">
          {team.map((person) => (
            <article key={person.id} className="grid content-start gap-4 bg-sheet p-6">
              <FounderPortrait name={person.name} photo={person.photo} />
              <div className="grid gap-1.5">
                <h3 className="text-body font-medium">{person.name}</h3>
                <Label>{person.role}</Label>
                <DimensionRule tone="accent" className="max-w-24" />
              </div>
              <p className="text-small text-ink-muted">{person.bio}</p>
              {person.linkedin ? (
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="justify-self-start font-data text-label uppercase tracking-[0.07em] text-accent hover:text-ink"
                >
                  LinkedIn
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </Section>

      <Section labelledBy="process">
        <SectionHead id="process" title={m.about.processHeading} />
        <ProcessGrid />
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

/**
 * Founder portrait.
 *
 * With no photo yet, falls back to initials on the same dark plate the
 * logo uses — so an unfilled profile reads as deliberate rather than
 * broken, and the grid keeps its rhythm while headshots are being taken.
 */
function FounderPortrait({ name, photo }: { name: string; photo: string }) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        width={320}
        height={320}
        className="aspect-square w-full object-cover"
      />
    );
  }

  const initials = name
    .replace(/PLACEHOLDER\s*-\s*/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      aria-hidden="true"
      className="grid aspect-square w-full place-items-center border border-rule bg-plate"
    >
      <span className="font-display text-h2 font-bold tracking-[0.08em] text-ink-invert opacity-70">
        {initials}
      </span>
    </div>
  );
}
