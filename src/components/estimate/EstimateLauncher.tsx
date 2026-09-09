import Link from "next/link";

import { localePath, type Locale, type Messages } from "@/lib/i18n";
import { Arrow } from "@/components/primitives/drafting";

/**
 * The sticky "estimate your project" tab, bottom-start of the homepage.
 *
 * A server component on purpose: the homepage ships zero client JavaScript
 * and this keeps it that way. Dismissal is a visually-hidden checkbox and a
 * `peer-checked:hidden` sibling — the same no-JS pattern as the FAQ
 * <details> and the .tabset in globals.css. The dismissal lasts the page
 * view, which is the right lifetime for a launcher.
 *
 * `start-0` / `bottom-0` and `ps-`/`pe-` so it mirrors under RTL. `z-20`
 * sits it under the `z-30` sticky header.
 */
export function EstimateLauncher({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  return (
    <div className="pointer-events-none fixed start-0 bottom-0 z-20 p-gutter">
      <input
        type="checkbox"
        id="estimate-launcher-dismiss"
        className="peer sr-only"
      />
      <div className="pointer-events-auto flex items-center gap-2 rounded-md border border-rule bg-sheet py-2 ps-4 pe-2 shadow-lg shadow-black/25 peer-checked:hidden">
        <Link
          href={localePath(locale, "/estimate")}
          className="inline-flex items-center gap-2 text-small font-semibold text-ink transition-colors hover:text-accent"
        >
          {messages.estimate.launcherLabel}
          <Arrow />
        </Link>
        <label
          htmlFor="estimate-launcher-dismiss"
          className="grid size-6 cursor-pointer place-items-center rounded-xs text-ink-faint transition-colors hover:bg-paper hover:text-ink"
        >
          <span className="sr-only">{messages.estimate.launcherDismiss}</span>
          <span aria-hidden="true" className="text-body leading-none">
            &times;
          </span>
        </label>
      </div>
    </div>
  );
}
