import type { ReactNode } from "react";
import { Label } from "./drafting";

/**
 * Section header — a heading with an optional code on the start side and
 * an optional note on the end side, over a full rule.
 *
 * The code is only worth using where a real sequence exists (numbered
 * work rows, ordered process steps). Do not number things that are not
 * ordered; the numbering is meant to carry information, not decorate.
 */
export function SectionHead({
  code,
  title,
  note,
  id,
  level = 2,
}: {
  code?: string;
  title: string;
  note?: ReactNode;
  id?: string;
  level?: 2 | 3;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div className="mb-6 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-ink pb-2">
      {code ? <Label>{code}</Label> : null}
      <Heading id={id} className="text-h3">
        {title}
      </Heading>
      <span className="flex-1" />
      {note ? <Label>{note}</Label> : null}
    </div>
  );
}

/** Page-level section wrapper. Keeps vertical rhythm in one place. */
export function Section({
  children,
  className = "",
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`pt-section ${className}`}
    >
      {children}
    </section>
  );
}
