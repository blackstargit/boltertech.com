"use client";

import { useState } from "react";
import Link from "next/link";
import { Label } from "@/components/primitives/drafting";
import { categories, type Category } from "@/lib/schemas";
import { localePath, type Locale, type Messages } from "@/lib/i18n";

/**
 * Project index with category filtering.
 *
 * Every project is rendered into the HTML up front and filtering only
 * hides rows — so crawlers and answer engines see the full list, the page
 * stays statically prerendered, and with JavaScript disabled you get all
 * projects rather than none. The filter is an enhancement, not a
 * dependency.
 */

export type WorkRow = {
  slug: string;
  title: string;
  summary: string;
  category: Category;
  year: number;
  client: string;
  clientSector: string;
};

export function WorkList({
  projects,
  locale,
  messages: m,
}: {
  projects: WorkRow[];
  locale: Locale;
  messages: Messages;
}) {
  const [active, setActive] = useState<Category | "all">("all");

  // Only offer a filter for categories that actually have projects.
  const present = categories.filter((c) =>
    projects.some((p) => p.category === c),
  );

  const visible =
    active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2">
        <FilterButton
          active={active === "all"}
          onClick={() => setActive("all")}
          count={projects.length}
        >
          {m.work.filterAll}
        </FilterButton>
        {present.map((c) => (
          <FilterButton
            key={c}
            active={active === c}
            onClick={() => setActive(c)}
            count={projects.filter((p) => p.category === c).length}
          >
            {m.categories[c]}
          </FilterButton>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="border border-rule bg-sheet p-6 text-small text-ink-muted">
          {m.work.empty}
        </p>
      ) : (
        <ul className="border-t border-rule">
          {visible.map((p, i) => (
            <li key={p.slug} className="border-b border-rule">
              <Link
                href={localePath(locale, `/work/${p.slug}`)}
                className="group grid gap-x-4 gap-y-1 py-4 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-baseline"
              >
                <Label>{`W-${String(i + 1).padStart(2, "0")}`}</Label>
                <span className="grid gap-1">
                  <span className="text-body transition-colors group-hover:text-accent">
                    {p.title}
                  </span>
                  <span className="text-small text-ink-muted">{p.summary}</span>
                </span>
                <span className="flex items-baseline gap-3">
                  <Label>{m.categories[p.category]}</Label>
                  <Label>{p.year}</Label>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function FilterButton({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-3 py-1.5 font-data text-label tracking-[0.07em] uppercase transition-colors ${
        active
          ? "border-ink bg-ink text-ink-invert"
          : "border-rule text-ink-muted hover:border-accent hover:text-accent"
      }`}
    >
      {children}
      <span className="ms-2 opacity-60">{count}</span>
    </button>
  );
}
