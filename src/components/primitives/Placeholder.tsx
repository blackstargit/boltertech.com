import type { ReactNode } from "react";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";

/**
 * A marked stand-in for content that has not been written yet.
 *
 * Hatched, dashed, monochrome, and captioned. It shows the footprint the
 * real thing will occupy without ever looking like the real thing —
 * placeholders never take the accent colour, which is reserved for
 * measured figures.
 *
 * Renders nothing at all once placeholders are switched off, at which
 * point the absent-by-default rule is what ships. See
 * src/lib/placeholders.ts.
 */
export function Placeholder({
  label,
  notice,
  hint,
  children,
  className = "",
}: {
  /** What is missing, e.g. "Cover image". */
  label: string;
  /** The word "Placeholder" in the current locale. */
  notice: string;
  /** How to fill it in. Written for whoever edits the content files. */
  hint?: string;
  /** Optional wireframe drawn behind the caption. */
  children?: ReactNode;
  className?: string;
}) {
  if (!SHOW_PLACEHOLDERS) return null;

  return (
    <div
      role="note"
      className={`hatch relative grid place-items-center gap-2.5 rounded-md border border-dashed border-rule p-7 text-center ${className}`}
    >
      {children}
      <span className="font-data text-label font-medium tracking-[0.16em] text-ink-faint uppercase">
        [ {notice} &middot; {label} ]
      </span>
      {hint ? (
        <span className="max-w-[44ch] font-data text-micro leading-relaxed text-ink-faint">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
