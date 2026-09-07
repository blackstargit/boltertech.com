import Link from "next/link";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";

export const metadata = {
  title: "Page not found",
  description: "The page you asked for does not exist, or it moved.",
};
import { defaultLocale, directionOf, localePath } from "@/lib/i18n";
import { site } from "@/lib/site";
import { ctaClasses } from "@/components/primitives/Cta";

/**
 * Not found.
 *
 * This renders its OWN <html> and <body>.
 *
 * The root layout of this app lives at app/[locale]/layout.tsx, so a
 * not-found triggered from inside a locale renders in Next's error shell
 * rather than in that layout — which means no stylesheet link, no font
 * variables, and no lang attribute. Left alone, the 404 arrives completely
 * unstyled and fails WCAG for a missing document language, on a site whose
 * whole job is to look credible.
 *
 * Declaring the document here is the fix. It costs a little duplication of
 * the layout's shell, which is why the page is kept deliberately small.
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

export default function GlobalNotFound() {
  return (
    <html
      lang={defaultLocale}
      dir={directionOf(defaultLocale)}
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable}`}
      data-theme="dark"
    >
      <body>
        <main className="mx-auto grid max-w-sheet gap-6 px-gutter py-32">
          <span className="font-data text-label font-medium tracking-[0.16em] text-ink-faint uppercase">
            Error 404
          </span>
          <h1 className="max-w-[16ch] text-h1">This page is not in the set.</h1>
          <p className="max-w-prose text-lede text-ink-muted">
            The page you asked for does not exist, or it moved. The work index
            is the best place to pick the thread back up.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link
              href={localePath(defaultLocale, "/work")}
              className={ctaClasses("solid")}
            >
              See our work
            </Link>
            <Link
              href={localePath(defaultLocale)}
              className={ctaClasses("outline")}
            >
              Home
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="text-small text-ink-muted transition-colors hover:text-accent"
            >
              {site.email}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
