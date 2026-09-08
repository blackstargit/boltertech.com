import Link from "next/link";
import { LogoLock } from "./LogoLock";
import { MobileMenu } from "./MobileMenu";
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
 * The narrow-viewport menu is a native <details> wrapped in a small client
 * component (see MobileMenu) that adds outside-click, Escape and
 * close-on-navigate. The open/close itself is still the browser's.
 *
 * Breakpoints differ on purpose: the nav links collapse into the menu at
 * 768px, but the "Start a project" button survives down to 540px, because
 * it is the page's primary action and there is room for it long after four
 * nav links stop fitting. Below 540px it lives only inside the menu.
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

        {/* Wrapped, not styled directly: `ctaClasses` bakes in
            `inline-flex`, and Tailwind orders display utilities by value
            rather than by class-string position — `.inline-flex` sits
            after `.hidden` in the sheet, so a `hidden` passed to the Cta
            silently loses and the button showed at every width. A plain
            div has no competing display utility, so it hides properly. */}
        <div className="hidden min-[540px]:block">
          <Cta
            href={localePath(locale, "/contact")}
            arrow={false}
            size="compact"
          >
            {messages.common.startProject}
          </Cta>
        </div>

        {/* Narrow viewports: the same nav in a disclosure. */}
        <MobileMenu label={messages.nav.menu} className="md:hidden">
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
              {/* Below 540px this is the only "Start a project" on screen,
                  which is why the menu carries its own copy of it. */}
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
        </MobileMenu>
      </div>
    </header>
  );
}
