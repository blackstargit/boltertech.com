import { Band } from "@/components/primitives/Band";
import { Cta } from "@/components/primitives/Cta";
import { site } from "@/lib/site";
import { localePath, type Locale, type Messages } from "@/lib/i18n";

/**
 * The closing call to action.
 *
 * This block was previously copy-pasted verbatim into three page files,
 * which is the usual way a site ends up with three slightly different
 * versions of the same thing. One component, one band tone, one place to
 * change the phone number.
 */
export function CtaBand({
  locale,
  messages,
  showContactDetails = true,
  tone = "light",
}: {
  locale: Locale;
  messages: Messages;
  showContactDetails?: boolean;
  /** Set by the page so the strict dark/bone alternation is unbroken. */
  tone?: "dark" | "light";
}) {
  return (
    <Band tone={tone}>
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <h2 className="max-w-[20ch] text-h2">{messages.contact.heading}</h2>
        <div className="grid gap-6 lg:justify-items-start">
          {showContactDetails && (
            <p className="max-w-[38ch] text-ink-muted">
              {site.email} &middot; <span dir="ltr">{site.phone}</span> &middot;{" "}
              {messages.footer.replies.toLowerCase()} {site.responseTime}
            </p>
          )}
          <Cta href={localePath(locale, "/contact")}>
            {messages.common.startProject}
          </Cta>
        </div>
      </div>
    </Band>
  );
}
