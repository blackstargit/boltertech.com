import type { ReactNode } from "react";
import { Label } from "./drafting";

/**
 * Section header — eyebrow, heading, and an optional link or note pushed
 * to the end of the baseline.
 *
 * The heading is real h2 size. The previous version hardcoded text-h3 for
 * every section on the site regardless of its `level`, which is why the
 * page had almost no vertical hierarchy: a section heading and a card
 * heading were the same size, so nothing announced a new subject.
 */
export function SectionHead({
  eyebrow,
  title,
  note,
  id,
  level = 2,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  note?: ReactNode;
  id?: string;
  level?: 2 | 3;
  className?: string;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div
      className={`mb-10 flex flex-wrap items-end gap-x-6 gap-y-4 ${className}`}
    >
      <div className="grid gap-3.5">
        {eyebrow ? <Label>{eyebrow}</Label> : null}
        <Heading id={id} className={level === 2 ? "text-h2" : "text-h3"}>
          {title}
        </Heading>
      </div>
      <span className="flex-1" />
      {note ? <div className="pb-1 text-small">{note}</div> : null}
    </div>
  );
}
