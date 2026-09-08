import type { Metadata } from "next";
import Image from "next/image";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site, team, serviceLines, commitmentList } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema-org";
import { PageHero, FieldRow } from "@/components/primitives/TitleBlock";
import { SectionHead } from "@/components/primitives/SectionHead";
import { Band } from "@/components/primitives/Band";
import { ProcessGrid } from "@/components/sections/ProcessGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Label } from "@/components/primitives/drafting";
import { Placeholder } from "@/components/primitives/Placeholder";

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

      {/* The commitments come before the founders deliberately: a
          sceptical first-time visitor cares what you are on the hook for
          before they care who you are. */}
      <Band tone="light" labelledBy="commitments">
        <SectionHead
          id="commitments"
          title={m.about.commitmentsHeading}
          eyebrow={m.about.processHeading}
        />
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-x-7 gap-y-10">
          {commitmentList.map((c, i) => (
            <li
              key={c.id}
              className="grid content-start gap-3.5 border-t-2 border-ink pt-5"
            >
              <span className="font-data text-micro font-semibold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h4">{c.name}</h3>
              <p className="text-small text-pretty text-ink-muted">
                {c.detail}
              </p>
            </li>
          ))}
        </ol>
      </Band>

      {/* Renders however many founders are in data/founders.json — two,
          three or five all lay out correctly without touching this file. */}
      <Band labelledBy="team">
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
              <FounderPortrait
                name={person.name}
                photo={person.photo}
                placeholder={{
                  notice: m.placeholders.notice,
                  label: m.placeholders.portrait,
                  hint: m.placeholders.portraitHint,
                }}
              />
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

      {/* Seamed: two dark bands in a row would merge into one field. */}
      <Band labelledBy="process" className="border-t border-rule">
        <SectionHead id="process" title={m.about.processHeading} />
        <ProcessGrid />
      </Band>

      <CtaBand locale={l} messages={m} showContactDetails={false} />
    </>
  );
}

/**
 * Founder portrait, in three states.
 *
 * A real photo; or, for a real person whose headshot has not been taken
 * yet, their initials on the same dark plate the logo uses — an unfilled
 * profile that reads as deliberate rather than broken. A founder whose
 * *name* is still a placeholder gets the hatched frame instead, because
 * initials derived from "Founder One" carry no information at all.
 */
function FounderPortrait({
  name,
  photo,
  placeholder,
}: {
  name: string;
  photo: string;
  placeholder: { notice: string; label: string; hint: string };
}) {
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

  const unnamed = /PLACEHOLDER/i.test(name);
  if (unnamed) {
    return (
      <Placeholder
        pad="tight"
        className="aspect-[4/5] content-center"
        notice={placeholder.notice}
        label={placeholder.label}
        hint={placeholder.hint}
      />
    );
  }

  const initials = name
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
