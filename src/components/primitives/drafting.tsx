import type { ReactNode } from "react";

/**
 * The small marking devices.
 *
 * Written with logical properties (inline/block, start/end) so they mirror
 * correctly under dir="rtl" without a second stylesheet. Anything
 * directional that CSS cannot mirror on its own carries the `mirror-x`
 * class defined in globals.css.
 */

/**
 * Uppercase mono label — the eyebrow above a heading, the key in a field,
 * the caption under a chart. The only place the data face is allowed at
 * size, and the smallest text on the site, which is why it reads from
 * --ink-faint: that token is the governed contrast floor.
 */
export function Label({
  children,
  as: Tag = "span",
  tone = "faint",
  id,
  className = "",
}: {
  children: ReactNode;
  as?: "span" | "div" | "p" | "h2" | "h3";
  tone?: "faint" | "accent" | "ink";
  id?: string;
  className?: string;
}) {
  const color =
    tone === "accent"
      ? "text-accent"
      : tone === "ink"
        ? "text-ink"
        : "text-ink-faint";
  return (
    <Tag
      id={id}
      className={`font-data text-label font-medium tracking-[0.16em] uppercase ${color} ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * A live indicator. Slow opacity pulse, killed by the global
 * prefers-reduced-motion rule.
 */
export function PulseDot({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pulse-dot block size-[7px] shrink-0 rounded-full bg-accent ${className}`}
    />
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
