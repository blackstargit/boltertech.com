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
  /**
   * Drop the padding below the content, for a band that runs straight
   * into the next one.
   *
   * A prop rather than a `pb-0` passed through `className`: Tailwind
   * orders utilities by value, not by their position in the class
   * string, so whether an override wins is an accident of which number
   * happens to sort later. `pb-0` beating `py-section` today is luck,
   * not a rule to build on.
   */
  joinNext?: boolean;
  className?: string;
};

export function Band({
  children,
  tone = "dark",
  id,
  labelledBy,
  flush = false,
  joinNext = false,
  className = "",
}: Props) {
  const pad = flush ? "" : joinNext ? "pt-section pb-0" : "py-section";
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
