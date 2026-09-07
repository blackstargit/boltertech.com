import type { ReactNode } from "react";

/**
 * Mono pill for a stack term, a category, a status. Replaces the four
 * hand-rolled "flex-wrap a list of monospace words" strips that had drifted
 * apart across the services page, the case study header and the outcome
 * panels.
 */

export function Chip({
  children,
  tone = "quiet",
  className = "",
}: {
  children: ReactNode;
  tone?: "quiet" | "accent";
  className?: string;
}) {
  const styles =
    tone === "accent"
      ? "border-accent bg-accent-soft text-accent"
      : "border-rule text-ink-muted";
  return (
    <span
      className={`inline-flex items-center rounded-xs border px-2.5 py-1.5 font-data text-micro font-medium ${styles} ${className}`}
    >
      {children}
    </span>
  );
}

/** A wrapped row of chips. Renders nothing for an empty list. */
export function ChipRow({
  items,
  tone,
  className = "",
}: {
  items: readonly string[];
  tone?: "quiet" | "accent";
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <Chip key={item} tone={tone}>
          {item}
        </Chip>
      ))}
    </div>
  );
}
