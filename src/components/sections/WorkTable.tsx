import Link from "next/link";

import { Arrow, Label } from "@/components/primitives/drafting";
import type { ProjectEntry } from "@/lib/projects";
import { localePath, type Locale, type Messages } from "@/lib/i18n";

/**
 * The work list, shared by the home page and the work index.
 *
 * A table of rows rather than a grid of cards, because there are no
 * screenshots yet and a card grid with no imagery is a bordered list
 * pretending otherwise. The title carries the weight at h3 size; client
 * and category sit back.
 *
 * Below `sm` the row is a plain stack — five columns squeezed onto a
 * phone is how work indexes end up unreadable.
 */
export function WorkTable({
  projects,
  locale,
  messages,
  startIndex = 0,
}: {
  projects: ProjectEntry[];
  locale: Locale;
  messages: Messages;
  startIndex?: number;
}) {
  if (projects.length === 0) return null;

  return (
    <ul className="border-t border-rule">
      {projects.map((p, i) => (
        <li key={p.slug} className="border-b border-rule">
          <Link
            href={localePath(locale, `/work/${p.slug}`)}
            className="group block py-6 transition-colors hover:bg-sheet sm:grid sm:grid-cols-[3.5rem_minmax(0,3fr)_minmax(0,2fr)_minmax(0,1.4fr)_1.25rem] sm:items-center sm:gap-5 sm:px-2"
          >
            <Label>{`W-${String(startIndex + i + 1).padStart(2, "0")}`}</Label>

            <span className="mt-2 block font-display text-h3 leading-tight font-medium tracking-[-0.02em] transition-colors group-hover:text-accent sm:mt-0">
              {p.title}
            </span>

            <span className="mt-1 block text-small text-ink-muted sm:mt-0">
              {p.client.trim() ||
                `${p.clientSector} · ${messages.common.clientWithheld}`}
            </span>

            <Label tone="accent" className="mt-3 block sm:mt-0">
              {messages.categories[p.category]}
            </Label>

            <Arrow className="hidden text-ink-faint transition-colors group-hover:text-accent sm:block sm:justify-self-end" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
