import Link from "next/link";
import { site, serviceLines } from "@/lib/site";
import { localePath, type Locale, type Messages } from "@/lib/i18n";
import { Label } from "@/components/primitives/drafting";
import { LogoLock } from "./LogoLock";

/**
 * Footer.
 *
 * A real street address and a real phone number here is a legitimacy
 * signal that directory reviewers look for specifically — it is one of
 * the things Clutch and GoodFirms check when deciding whether a company
 * is what it claims to be.
 *
 * The column headings used to be typed in English directly in this file
 * while the rest of the site routed every string through the messages
 * file. Same words, correct home.
 */
export function SiteFooter({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const year = new Date().getFullYear();
  const { address } = site;

  const linkClass =
    "text-small text-ink-muted transition-colors hover:text-accent";

  return (
    <footer
      data-theme="dark"
      className="border-t border-rule bg-paper px-gutter pt-16 pb-9"
    >
      <div className="mx-auto grid max-w-sheet grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-10">
        <div className="grid content-start gap-5">
          <LogoLock locale={locale} size={24} />
          <address className="text-small leading-relaxed text-ink-muted not-italic">
            {site.legalName}
            <br />
            {address.line1}
            <br />
            {address.line2}
            <br />
            {address.city}, {address.countryName}
          </address>
        </div>

        <div className="grid content-start gap-4">
          <Label>{messages.footer.practice}</Label>
          <ul className="grid gap-2.5">
            {serviceLines.map((s) => (
              <li key={s.id}>
                <Link
                  href={localePath(locale, `/services#${s.id}`)}
                  className={linkClass}
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid content-start gap-4">
          <Label>{messages.footer.company}</Label>
          <ul className="grid gap-2.5">
            <li>
              <Link href={localePath(locale, "/about")} className={linkClass}>
                {messages.nav.about}
              </Link>
            </li>
            <li>
              <Link href={localePath(locale, "/work")} className={linkClass}>
                {messages.nav.work}
              </Link>
            </li>
            <li>
              <Link href={localePath(locale, "/privacy")} className={linkClass}>
                {messages.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href={localePath(locale, "/terms")} className={linkClass}>
                {messages.footer.terms}
              </Link>
            </li>
          </ul>
        </div>

        <div className="grid content-start gap-4">
          <Label>{messages.footer.contact}</Label>
          <ul className="grid gap-2.5">
            <li>
              <a href={`mailto:${site.email}`} className={linkClass}>
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phoneHref}`} className={linkClass} dir="ltr">
                {site.phone}
              </a>
            </li>
            <li className="text-small text-ink-faint">
              {messages.footer.replies} {site.responseTime}
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-sheet flex-wrap gap-4 border-t border-rule pt-7 font-data text-micro text-ink-faint">
        <span>
          &copy; {year} {site.name}. {messages.footer.rights}
        </span>
        <span className="ms-auto">
          {messages.footer.registered} &middot; {site.companyType}
        </span>
      </div>
    </footer>
  );
}
