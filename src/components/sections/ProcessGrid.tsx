import { processSteps } from "@/lib/site";

/**
 * How we work.
 *
 * Numbered because this genuinely is a sequence — the numbering carries
 * information rather than decorating. Renders however many steps are in
 * data/process.json, so adding or removing one is a data edit.
 *
 * A heavy top rule per column instead of a bordered cell: the steps read
 * as a progression across the page rather than as four separate cards.
 */
export function ProcessGrid() {
  return (
    <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-x-7 gap-y-10">
      {processSteps.map((step, i) => (
        <li
          key={step.step}
          className="grid content-start gap-3.5 border-t-2 border-ink pt-5"
        >
          <span className="font-data text-micro font-semibold text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="text-h4">{step.step}</h3>
          <p className="text-small text-pretty text-ink-muted">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}
