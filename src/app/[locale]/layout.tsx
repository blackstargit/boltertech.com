import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "../globals.css";
import {
  directionOf,
  getMessages,
  isLocale,
  localeCodes,
  localePath,
  type Locale,
} from "@/lib/i18n";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { SITE_URL, site } from "@/lib/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

/**
 * Three typefaces, three jobs. Self-hosted by next/font, so there is no
 * render-blocking request to Google and no layout shift.
 *
 * When an RTL locale ships, add an Arabic/Nastaliq face here and expose
 * it as --font-arabic; the token file already reserves the slot.
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: "website",
  },
  robots: { index: true, follow: true },
};

/** Prerenders one tree per locale. Adding a language needs no change here. */
export function generateStaticParams() {
  return localeCodes.map((locale) => ({ locale }));
}

/**
 * Only the listed locales exist. Without this, a path the proxy skips
 * (anything with a dot, like /favicon.ico) arrives here as locale
 * "favicon.ico", the page loads messages for it before the layout's
 * notFound() runs, and the request 500s instead of 404ing.
 */
export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const messages = await getMessages(typedLocale);
  const dir = directionOf(typedLocale);

  return (
    <html
      lang={typedLocale}
      dir={dir}
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable}`}
      /* Dark is the page ground. Individual sections opt into the bone
         band with data-theme="light" — see the Band primitive. Both token
         blocks are complete, so nothing here needs a per-band variant. */
      data-theme="dark"
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
        >
          {messages.nav.skipToContent}
        </a>
        <SiteHeader locale={typedLocale} messages={messages} />
        {/* No container here — Bands are full-bleed and cap their own
            content, which is what lets the ground colour reach the edge. */}
        <main id="main">{children}</main>
        <SiteFooter locale={typedLocale} messages={messages} />
        <Analytics />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <ConsentBanner
            measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
            privacyHref={localePath(typedLocale, "/privacy")}
            messages={messages.analytics}
          />
        )}
      </body>
    </html>
  );
}
