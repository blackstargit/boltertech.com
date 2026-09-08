import type { ReactNode } from "react";

/**
 * A full-bleed horizontal band, and the only structural container on the
 * site.
 *
 * Two jobs:
 *
 *  1. The ground colour reaches the viewport edge while the content inside
 *     still caps at --container-sheet. Without this the alternating bands
 *     read as boxes rather than as strata.
 *
 *  2. It carries `data-theme`, which re-resolves every colour token beneath
 *     it. That is why a component written against `bg-sheet` / `text-ink` /
 *     `border-rule` needs no per-band variant — it simply asks the nearest
 *     band what those mean. See globals.css.
 *
 * `flush` drops the vertical padding, for bands that own their own spacing
 * (the ticker) or that bleed into the next one.
 */

type Props = {
  children: ReactNode;
  tone?: "dark" | "light";
  id?: string;
  labelledBy?: string;
  /** No vertical padding at all — for a band that owns its own spacing. */
  flush?: boolean;
  className?: string;
};

export function Band({
  children,
  tone = "dark",
  id,
  labelledBy,
  flush = false,
  className = "",
}: Props) {
  const pad = flush ? "" : "py-section";
  return (
    <section
      id={id}
      data-theme={tone}
      aria-labelledby={labelledBy}
      className={`bg-paper px-gutter ${pad} ${className}`}
    >
      <div className="mx-auto max-w-sheet">{children}</div>
    </section>
  );
}
