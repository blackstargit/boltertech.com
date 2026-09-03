import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Chivo, IBM_Plex_Sans, Martian_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "../globals.css";
import {
  directionOf,
  getMessages,
  isLocale,
  localeCodes,
  type Locale,
} from "@/lib/i18n";
import { SITE_URL, site } from "@/lib/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

/**
 * Three typefaces, three jobs. Self-hosted by next/font, so there is no
 * render-blocking request to Google and no layout shift.
 *
 * When an RTL locale ships, add an Arabic/Nastaliq face here and expose
 * it as --font-arabic; the token file already reserves the slot.
 */
const chivo = Chivo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-chivo",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-sans",
  display: "swap",
});

const martianMono = Martian_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-martian-mono",
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
      className={`${chivo.variable} ${plexSans.variable} ${martianMono.variable}`}
      /* Light is the launch theme. Set data-theme="dark" here (or from a
         toggle) to switch the whole site — every colour reads from tokens,
         so no component changes are required. */
      data-theme="light"
    >
      <body>
        <ScrollProgress />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:bg-ink focus:px-4 focus:py-2 focus:text-ink-invert"
        >
          {messages.nav.skipToContent}
        </a>
        <SiteHeader locale={typedLocale} messages={messages} />
        <main id="main" className="mx-auto max-w-sheet px-gutter pb-4">
          {children}
        </main>
        <SiteFooter locale={typedLocale} messages={messages} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
