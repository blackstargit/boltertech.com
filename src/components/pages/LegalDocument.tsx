import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getEntry } from "@/lib/content";
import { legalSchema } from "@/lib/schemas";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { TitleBlock } from "@/components/primitives/TitleBlock";
import { Prose } from "@/components/primitives/Prose";

/**
 * Shared body for every legal page.
 *
 * Privacy and Terms differ only by slug, and any future one (a cookie
 * policy, an acceptable use policy) will too — so the route files are
 * two lines each and this is the only place the layout lives.
 *
 * Documents are per-locale: content/legal/<locale>/<slug>.mdx. A locale
 * without a translated policy falls back to nothing rather than silently
 * serving English legal text to someone reading in another language.
 */

export async function legalMetadata(
  locale: string,
  slug: string,
  fallbackTitle: string,
): Promise<Metadata> {
  const doc = getEntry(`legal/${locale}`, slug, legalSchema);
  return {
    title: doc?.title ?? fallbackTitle,
    description: doc?.summary,
    alternates: { canonical: localePath(locale as Locale, `/${slug}`) },
  };
}

export async function LegalDocument({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const m = await getMessages(locale);
  const doc = getEntry(`legal/${locale}`, slug, legalSchema);
  if (!doc) notFound();

  return (
    <article>
      <TitleBlock
        className="mt-6"
        fields={[{ label: m.fields.updated, value: doc.updated }]}
      >
        <h1 className="text-h2">{doc.title}</h1>
        {doc.summary ? (
          <p className="max-w-prose text-lede text-ink-muted">{doc.summary}</p>
        ) : null}
      </TitleBlock>
      <div className="mt-10">
        <Prose source={doc.body} />
      </div>
    </article>
  );
}
