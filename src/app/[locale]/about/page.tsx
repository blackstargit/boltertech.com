import type { Metadata } from "next";
import Image from "next/image";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site, team, serviceLines } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema-org";
import { PageHero, FieldRow } from "@/components/primitives/TitleBlock";
import { SectionHead } from "@/components/primitives/SectionHead";
import { Band } from "@/components/primitives/Band";
import { ProcessGrid } from "@/components/sections/ProcessGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Label } from "@/components/primitives/drafting";

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
    alternates: {
      canonical: localePath(locale as Locale, "/about"),
      languages: languageAlternates("/about"),
    },
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

      <Band>
        <PageHero
          eyebrow={m.about.heading}
          title={site.tagline}
          lede={site.description}
        >
          <FieldRow
            className="mt-5 max-w-2xl"
            fields={[
              { label: m.fields.established, value: String(site.founded) },
              { label: m.fields.team, value: `${site.teamSize} engineers` },
              { label: m.fields.practice, value: lead.name },
              {
                label: m.fields.base,
                value: `${site.address.city}, ${site.address.countryName}`,
              },
            ]}
          />
        </PageHero>
      </Band>

      {/* Renders however many founders are in data/founders.json — two,
          three or five all lay out correctly without touching this file. */}
      <Band tone="light" labelledBy="team">
        <SectionHead
          id="team"
          title={m.about.teamHeading}
          note={<Label>{`${team.length}`}</Label>}
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-px overflow-hidden rounded-md border border-rule bg-rule">
          {team.map((person) => (
            <article
              key={person.id}
              className="grid content-start gap-4 bg-sheet p-7"
            >
              <FounderPortrait name={person.name} photo={person.photo} />
              <div className="grid gap-2">
                <h3 className="text-h4">{person.name}</h3>
                <Label>{person.role}</Label>
              </div>
              <p className="text-small text-pretty text-ink-muted">
                {person.bio}
              </p>
              {person.linkedin ? (
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="justify-self-start border-b border-accent pb-0.5 text-small font-semibold text-accent transition-colors hover:border-ink hover:text-ink"
                >
                  LinkedIn
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </Band>

      <Band labelledBy="process">
        <SectionHead id="process" title={m.about.processHeading} />
        <ProcessGrid />
      </Band>

      <CtaBand locale={l} messages={m} showContactDetails={false} />
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
        height={400}
        className="aspect-[4/5] w-full rounded-md object-cover"
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
      className="grid aspect-[4/5] w-full place-items-center rounded-md border border-rule bg-plate"
    >
      <span className="font-display text-h2 font-semibold tracking-[0.08em] text-ink-invert opacity-60">
        {initials}
      </span>
    </div>
  );
}
