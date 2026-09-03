import Link from "next/link";
import type { ReactNode } from "react";
import { NodeTrace } from "./drafting";

/**
 * The one button style on the site, plus a quiet text variant.
 *
 * The trailing node connector is the same device used on work rows, so
 * "this leads somewhere" reads the same way everywhere. It mirrors under
 * RTL because NodeTrace is built from logical properties.
 */

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "quiet";
  className?: string;
  external?: boolean;
};

export function Cta({
  href,
  children,
  variant = "solid",
  className = "",
  external = false,
}: Props) {
  const base =
    "inline-flex items-center gap-2.5 font-data text-micro uppercase tracking-[0.08em] transition-colors";
  const styles =
    variant === "solid"
      ? "border border-ink bg-ink px-4 py-2.5 text-ink-invert hover:border-accent hover:bg-accent"
      : "text-accent hover:text-ink";

  const content = (
    <>
      {children}
      <NodeTrace length={16} />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${styles} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {content}
    </Link>
  );
}
