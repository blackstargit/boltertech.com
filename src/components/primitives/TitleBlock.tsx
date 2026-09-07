import type { ReactNode } from "react";
import { Label } from "./drafting";

/**
 * The page hero, and the facts strip that goes under it.
 *
 * The facts answer "are these people real" before a visitor reads a word
 * of marketing copy, which is what a directory referral or a cold-outbound
 * click is actually checking. The same fields feed the JSON-LD, so
 * metadata cannot drift from what the page displays.
 */

export type FieldSpec = {
  label: string;
  value: string;
  /** Rendered small and muted beside the value, e.g. "name withheld". */
  note?: string;
};

export function Field({ label, value, note }: FieldSpec) {
  return (
    <div className="grid content-start gap-2 bg-paper px-4 py-4">
      <Label>{label}</Label>
      <b className="font-display text-small font-medium text-ink">
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
 *
 * The 1px gap over a rule-coloured ground is what draws the hairlines —
 * no per-cell borders to get wrong at the edges.
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
      className={`grid grid-cols-[repeat(auto-fit,minmax(min(140px,100%),1fr))] gap-px overflow-hidden rounded-md border border-rule bg-rule ${className}`}
    >
      {present.map((f) => (
        <Field key={f.label} {...f} />
      ))}
    </div>
  );
}

/**
 * Page hero. Eyebrow, h1, lede, then whatever the page needs — CTAs, a
 * facts strip, a panel.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
  className = "",
}: {
  /** A plain string is wrapped in a Label; pass a node to decorate it. */
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`grid content-start gap-6 ${className}`}>
      {typeof eyebrow === "string" ? <Label>{eyebrow}</Label> : eyebrow}
      <h1 className="max-w-[20ch] text-h1">{title}</h1>
      {lede ? (
        <p className="max-w-[56ch] text-lede text-pretty text-ink-muted">
          {lede}
        </p>
      ) : null}
      {children}
    </header>
  );
}
