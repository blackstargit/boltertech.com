import type { Metadata } from "next";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site, officeMapEmbedUrl, googleMapsUrl } from "@/lib/site";
import { PageHero } from "@/components/primitives/TitleBlock";
import { Band } from "@/components/primitives/Band";
import { Label } from "@/components/primitives/drafting";
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
      <Band>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <div className="grid content-start gap-10">
            <PageHero
              eyebrow={m.nav.contact}
              title={m.contact.heading}
              lede={m.contact.metaDescription}
            />

            <div className="grid gap-6">
              <div className="grid gap-2.5">
                <Label>{m.footer.contact}</Label>
                <a
                  href={`mailto:${site.email}`}
                  className="text-lede text-ink transition-colors hover:text-accent"
                >
                  {site.email}
                </a>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="text-lede text-ink transition-colors hover:text-accent"
                  dir="ltr"
                >
                  {site.phone}
                </a>
                <span className="text-small text-ink-faint">
                  {m.footer.replies} {site.responseTime}
                </span>
              </div>

              <div className="grid gap-2.5">
                <Label>{m.fields.base}</Label>
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
                googleMapsUrl={googleMapsUrl}
                googleMapsLabel={m.contact.openInGoogleMaps}
              />
            </div>
          </div>

          {/* The store is mounted here and nowhere else, so the rest of the
              site ships no Redux at all. */}
          <div className="rounded-lg border border-rule bg-sheet p-6 sm:p-9">
            <StoreProvider>
              <ContactForm
                messages={m}
                email={site.email}
                responseTime={site.responseTime}
              />
            </StoreProvider>
          </div>
        </div>
      </Band>
    </>
  );
}
