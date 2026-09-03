import Link from "next/link";
import { Chivo, IBM_Plex_Sans, Martian_Mono } from "next/font/google";

import "./globals.css";

export const metadata = {
  title: "Page not found",
  description: "The page you asked for does not exist, or it moved.",
};
import { defaultLocale, directionOf, localePath } from "@/lib/i18n";
import { site } from "@/lib/site";

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

export default function GlobalNotFound() {
  return (
    <html
      lang={defaultLocale}
      dir={directionOf(defaultLocale)}
      className={`${chivo.variable} ${plexSans.variable} ${martianMono.variable}`}
      data-theme="light"
    >
      <body>
        <main className="mx-auto grid max-w-sheet gap-5 px-gutter py-24">
          <span className="font-data text-label tracking-[0.07em] text-ink-muted uppercase">
            Error 404
          </span>
          <h1 className="max-w-[16ch] text-h1">This page is not in the set.</h1>
          <p className="max-w-prose text-lede text-ink-muted">
            The page you asked for does not exist, or it moved. The work index
            is the best place to pick the thread back up.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={localePath(defaultLocale, "/work")}
              className="border border-ink bg-ink px-4 py-2.5 font-data text-micro tracking-[0.08em] text-ink-invert uppercase transition-colors hover:border-accent hover:bg-accent"
            >
              See our work
            </Link>
            <Link
              href={localePath(defaultLocale)}
              className="font-data text-micro tracking-[0.08em] text-accent uppercase hover:text-ink"
            >
              Home
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="font-data text-micro tracking-[0.08em] text-ink-muted uppercase hover:text-accent"
            >
              {site.email}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
