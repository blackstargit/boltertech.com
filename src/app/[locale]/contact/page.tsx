import type { Metadata } from "next";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site, officeMapEmbedUrl } from "@/lib/site";
import { TitleBlock } from "@/components/primitives/TitleBlock";
import { Label, DimensionRule } from "@/components/primitives/drafting";
import { StoreProvider } from "@/store/Provider";
import { ContactForm } from "@/components/contact/ContactForm";
import { OfficeMap } from "@/components/contact/OfficeMap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);
  return {
    title: m.contact.metaTitle,
    description: m.contact.metaDescription,
    alternates: {
      canonical: localePath(locale as Locale, "/contact"),
      languages: languageAlternates("/contact"),
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);
  const { address } = site;
  const addressText = [
    address.line1,
    address.line2,
    `${address.city}, ${address.countryName}`,
  ].join(", ");

  return (
    <>
      <TitleBlock
        className="mt-6"
        fields={[
          { label: "Response", value: site.responseTime },
          { label: m.fields.base, value: `${address.city}, UTC+5` },
        ]}
      >
        <h1 className="max-w-[18ch] text-h1">{m.contact.heading}</h1>
        <p className="max-w-[54ch] text-lede text-ink-muted">
          {m.contact.metaDescription}
        </p>
      </TitleBlock>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
        {/* The store is mounted here and nowhere else, so the rest of the
            site ships no Redux at all. */}
        <StoreProvider>
          <ContactForm
            messages={m}
            email={site.email}
            responseTime={site.responseTime}
          />
        </StoreProvider>

        <aside className="grid content-start gap-6">
          <div className="grid gap-2">
            <Label>Direct</Label>
            <DimensionRule tone="accent" />
            <a
              href={`mailto:${site.email}`}
              className="text-body text-ink transition-colors hover:text-accent"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phoneHref}`}
              className="text-body text-ink transition-colors hover:text-accent"
              dir="ltr"
            >
              {site.phone}
            </a>
          </div>

          <div className="grid gap-2">
            <Label>Office</Label>
            <DimensionRule />
            <address className="text-small leading-relaxed text-ink-muted not-italic">
              {address.line1}
              <br />
              {address.line2}
              <br />
              {address.city}, {address.countryName}
            </address>
          </div>

          <OfficeMap
            address={addressText}
            embedUrl={officeMapEmbedUrl}
            copyLabel={m.contact.copyAddress}
            copiedLabel={m.contact.addressCopied}
          />
        </aside>
      </div>
    </>
  );
}
