import type { ReactNode } from "react";

/**
 * The drawing devices, taken from the logo's own grammar.
 *
 * All four are written with logical properties (inline/block, start/end)
 * so they mirror correctly under dir="rtl" without a second stylesheet.
 * Anything directional that CSS cannot mirror on its own carries the
 * `mirror-x` class defined in globals.css.
 */

/** Uppercase mono label. The only place the data face is allowed at size. */
export function Label({
  children,
  as: Tag = "span",
  className = "",
}: {
  children: ReactNode;
  as?: "span" | "div" | "p" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={`font-data text-label uppercase tracking-[0.07em] text-ink-muted ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * Dimension rule — a line with end ticks. Reads as measurement, which is
 * the claim every case study metric is making. Used under figures and as
 * the section rule.
 */
export function DimensionRule({
  tone = "rule",
  className = "",
}: {
  tone?: "rule" | "accent";
  className?: string;
}) {
  const color = tone === "accent" ? "bg-accent" : "bg-rule";
  return (
    <span
      aria-hidden="true"
      className={`flex h-3 items-center ${className}`}
    >
      <i className={`block h-[9px] w-px ${color}`} />
      <s className={`block h-px flex-1 no-underline ${color}`} />
      <i className={`block h-[9px] w-px ${color}`} />
    </span>
  );
}

/**
 * Node connector — 1px trace, 5px terminal dot, lifted off the mark's
 * circuit paths. Used for annotation callouts and as the hover indicator
 * on work rows.
 */
export function NodeTrace({
  length = 26,
  reverse = false,
  className = "",
}: {
  length?: number;
  reverse?: boolean;
  className?: string;
}) {
  const dot = <i className="block size-[5px] shrink-0 rounded-full bg-accent" />;
  const trace = (
    <s
      className="block h-px bg-accent no-underline"
      style={{ inlineSize: `${length}px` }}
    />
  );
  return (
    <span aria-hidden="true" className={`flex items-center ${className}`}>
      {reverse ? (
        <>
          {dot}
          {trace}
        </>
      ) : (
        <>
          {trace}
          {dot}
        </>
      )}
    </span>
  );
}

/**
 * Corner brackets — crop marks instead of a full border. Separates an
 * object without spending a border, a radius and a shadow on every block,
 * which is what flattens most agency sites into a grid of identical cards.
 */
export function Bracketed({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative bg-sheet p-5 sm:p-7 ${className}`}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute start-0 top-0 size-3.5 border-s border-t border-accent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 end-0 size-3.5 border-b border-e border-accent"
      />
      {children}
    </div>
  );
}

/**
 * Directional arrow that flips under RTL. Use this rather than typing a
 * literal arrow, which would point the wrong way in Urdu or Arabic.
 */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`mirror-x ${className}`}>
      &rarr;
    </span>
  );
}
