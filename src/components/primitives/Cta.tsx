import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow } from "./drafting";

/**
 * The button styles, and the single source for them.
 *
 * `ctaClasses` is exported separately because four places on the site need
 * this styling on something that is not a link — a submit button, the two
 * consent-banner buttons, the work filters. They each used to carry a
 * hand-copied duplicate of the class string, so restyling the primary
 * button meant finding and editing five files and inevitably missing one.
 * Import the function instead.
 */

export type CtaVariant = "solid" | "outline" | "quiet";

const BASE =
  "inline-flex items-center justify-center gap-2 font-body text-small font-semibold transition-colors";

export function ctaClasses(variant: CtaVariant = "solid") {
  switch (variant) {
    case "outline":
      return `${BASE} rounded-sm border border-rule px-6 py-3.5 text-ink hover:border-ink hover:bg-sheet`;
    case "quiet":
      return `${BASE} border-b-[1.5px] border-ink pb-1 text-ink hover:border-accent hover:text-accent`;
    default:
      return `${BASE} rounded-sm bg-accent px-6 py-3.5 text-on-accent hover:bg-ink hover:text-paper`;
  }
}

type Props = {
  href: string;
  children: ReactNode;
  variant?: CtaVariant;
  className?: string;
  external?: boolean;
  /** Trailing arrow. On by default — it is what marks these as journeys. */
  arrow?: boolean;
};

export function Cta({
  href,
  children,
  variant = "solid",
  className = "",
  external = false,
  arrow = true,
}: Props) {
  const content = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  );
  const classes = `${ctaClasses(variant)} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
