import { processSteps } from "@/lib/site";
import { Label } from "@/components/primitives/drafting";

/**
 * How we work.
 *
 * Numbered because this genuinely is a sequence — the numbering carries
 * information rather than decorating. Renders however many steps are in
 * data/process.json, so adding or removing one is a data edit.
 */
export function ProcessGrid() {
  return (
    <ol className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
      {processSteps.map((step, i) => (
        <li key={step.step} className="grid content-start gap-2 bg-sheet p-5">
          <Label>{String(i + 1).padStart(2, "0")}</Label>
          <h3 className="text-body font-medium">{step.step}</h3>
          <p className="text-small text-ink-muted">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}
