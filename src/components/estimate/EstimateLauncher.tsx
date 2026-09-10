import Link from "next/link";

import { localePath, type Locale, type Messages } from "@/lib/i18n";

/**
 * The sticky "Cost Estimator" launcher, bottom-start of the homepage.
 *
 * A plain server component — no client JavaScript. A big amber disc carries
 * the icon and the label reads out of it like a tail. `start-*` and `ps-`
 * so it mirrors under RTL; `z-20` sits it under the `z-30` sticky header.
 */
export function EstimateLauncher({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  return (
    <div className="fixed start-5 bottom-5 z-20 print:hidden">
      <Link
        href={localePath(locale, "/estimate")}
        className="group inline-flex items-center gap-3.5 rounded-full border border-rule bg-sheet pe-7 shadow-xl shadow-black/30 transition-colors hover:border-accent"
      >
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-200 group-hover:scale-105">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-8"
          >
            <rect width="16" height="20" x="4" y="2" rx="2" />
            <line x1="8" x2="16" y1="6" y2="6" />
            <line x1="16" x2="16" y1="14" y2="18" />
            <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
          </svg>
        </span>
        <span className="text-body font-semibold text-ink">
          {messages.estimate.launcherLabel}
        </span>
      </Link>
    </div>
  );
}
