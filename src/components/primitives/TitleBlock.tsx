import type { ReactNode } from "react";
import { Label } from "./drafting";

/**
 * Title block — the header device from a drawing set.
 *
 * A row of real fields above the content. On a case study it carries
 * client, sector, stack, duration and status; on the homepage it carries
 * the company facts that answer "are these people real" before a visitor
 * reads a word of marketing copy.
 *
 * The same fields feed the JSON-LD, so metadata cannot drift from what
 * the page displays.
 */

export type FieldSpec = {
  label: string;
  value: string;
  /** Rendered small and muted beside the value, e.g. "name withheld". */
  note?: string;
};

export function Field({ label, value, note }: FieldSpec) {
  return (
    <div className="grid gap-0.5 px-3 py-2">
      <Label>{label}</Label>
      <b className="font-data text-micro font-semibold tracking-[-0.01em] text-ink">
        {value}
        {note ? (
          <span className="ms-1.5 font-normal text-ink-muted">({note})</span>
        ) : null}
      </b>
    </div>
  );
}

/**
 * Fields whose value is empty are dropped, not rendered blank. That is
 * what lets a project ship with three fields filled in and grow to six
 * without anyone touching this component.
 */
export function FieldRow({
  fields,
  className = "",
}: {
  fields: FieldSpec[];
  className?: string;
}) {
  const present = fields.filter((f) => f.value.trim().length > 0);
  if (present.length === 0) return null;

  return (
    <div
      className={`grid grid-cols-[repeat(auto-fit,minmax(122px,1fr))] divide-x divide-rule ${className}`}
    >
      {present.map((f) => (
        <Field key={f.label} {...f} />
      ))}
    </div>
  );
}

export function TitleBlock({
  fields,
  children,
  className = "",
}: {
  fields: FieldSpec[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <header className={`border border-ink bg-sheet ${className}`}>
      <FieldRow fields={fields} className="border-b border-ink" />
      <div className="grid gap-5 px-5 py-7 sm:px-9 sm:py-10">{children}</div>
    </header>
  );
}
