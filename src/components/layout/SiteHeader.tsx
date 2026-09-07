import Link from "next/link";
import { LogoLock } from "./LogoLock";
import { localePath, type Locale, type Messages } from "@/lib/i18n";

/**
 * Site header.
 *
 * Nav entries are data, not markup, so adding a route (the blog, careers)
 * is one line. The language switcher slots in beside the nav once
 * locales.ts carries more than one entry — nothing here needs to change
 * for that to work, since every href already goes through localePath.
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

  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-sheet flex-wrap items-center gap-4 px-gutter py-4">
        <LogoLock locale={locale} size={26} />
        <span className="flex-1" />
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={localePath(locale, item.href)}
                  className="font-data text-label tracking-[0.07em] text-ink-muted uppercase transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
