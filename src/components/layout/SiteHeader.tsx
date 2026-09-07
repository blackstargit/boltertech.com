import Link from "next/link";
import { LogoLock } from "./LogoLock";
import { Cta } from "@/components/primitives/Cta";
import { localePath, type Locale, type Messages } from "@/lib/i18n";

/**
 * Site header.
 *
 * Nav entries are data, not markup, so adding a route (the blog, careers)
 * is one line. The language switcher slots in beside the nav once
 * locales.ts carries more than one entry — nothing here needs to change
 * for that to work, since every href already goes through localePath.
 *
 * The narrow-viewport menu is a native <details>, so it opens and closes
 * with no client JavaScript, no hydration, and correct keyboard and
 * screen-reader behaviour for free. Previously the nav simply flex-wrapped
 * under the logo, which was the weakest thing on the site on a phone.
 */
export function SiteHeader({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const nav = [
    { href: "/services", label: messages.nav.services },
    { href: "/work", label: messages.nav.work },
    { href: "/about", label: messages.nav.about },
    { href: "/contact", label: messages.nav.contact },
  ];

  const linkClass =
    "text-small font-medium text-ink-muted transition-colors hover:text-accent";

  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-sheet items-center gap-6 px-gutter py-4">
        <LogoLock locale={locale} size={26} />
        <span className="flex-1" />

        {/* Wide viewports: the nav inline. */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={localePath(locale, item.href)}
                  className={linkClass}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Cta
          href={localePath(locale, "/contact")}
          arrow={false}
          className="hidden px-5 py-2.5 md:inline-flex"
        >
          {messages.common.startProject}
        </Cta>

        {/* Narrow viewports: the same nav in a disclosure. */}
        <details className="group relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-sm border border-rule px-3.5 py-2 font-data text-micro font-medium text-ink uppercase marker:content-[''] [&::-webkit-details-marker]:hidden">
            {messages.nav.menu}
            <span
              aria-hidden="true"
              className="text-accent transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <nav
            aria-label="Main"
            className="absolute end-0 z-40 mt-3 w-56 rounded-md border border-rule bg-sheet p-2 shadow-lg shadow-black/20"
          >
            <ul className="grid">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={localePath(locale, item.href)}
                    className="block rounded-xs px-3 py-2.5 text-small font-medium text-ink transition-colors hover:bg-paper hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 border-t border-rule pt-2">
                <Link
                  href={localePath(locale, "/contact")}
                  className="block rounded-xs bg-accent px-3 py-2.5 text-center text-small font-semibold text-on-accent"
                >
                  {messages.common.startProject}
                </Link>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
