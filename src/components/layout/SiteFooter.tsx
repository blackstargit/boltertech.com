import Link from "next/link";
import { site } from "@/lib/site";
import { localePath, type Locale, type Messages } from "@/lib/i18n";
import { Label } from "@/components/primitives/drafting";

/**
 * Footer.
 *
 * A real street address and a real phone number here is a legitimacy
 * signal that directory reviewers look for specifically — it is one of
 * the things Clutch and GoodFirms check when deciding whether a company
 * is what it claims to be.
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

  return (
    <footer className="mt-section border-t border-ink bg-paper">
      <div className="mx-auto grid max-w-sheet gap-8 px-gutter py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="grid gap-2">
          <Label>{site.legalName}</Label>
          <address className="text-small not-italic leading-relaxed text-ink-muted">
            {address.line1}
            <br />
            {address.line2}
            <br />
            {address.city}, {address.countryName}
          </address>
        </div>

        <div className="grid gap-2 content-start">
          <Label>Contact</Label>
          <a
            href={`mailto:${site.email}`}
            className="text-small text-ink transition-colors hover:text-accent"
          >
            {site.email}
          </a>
          <a
            href={`tel:${site.phoneHref}`}
            className="text-small text-ink transition-colors hover:text-accent"
            dir="ltr"
          >
            {site.phone}
          </a>
          <span className="text-small text-ink-muted">
            Replies {site.responseTime}
          </span>
        </div>

        <div className="grid gap-2 content-start">
          <Label>Legal</Label>
          <Link
            href={localePath(locale, "/privacy")}
            className="text-small text-ink transition-colors hover:text-accent"
          >
            {messages.footer.privacy}
          </Link>
          <Link
            href={localePath(locale, "/terms")}
            className="text-small text-ink transition-colors hover:text-accent"
          >
            {messages.footer.terms}
          </Link>
        </div>

        <div className="grid gap-2 content-start">
          <Label>{messages.footer.registered}</Label>
          <span className="text-small text-ink-muted">
            {messages.footer.registered} &middot; {site.companyType}
          </span>
          <span className="text-small text-ink-muted">
            &copy; {year} {site.name}. {messages.footer.rights}
          </span>
        </div>
      </div>
    </footer>
  );
}
