import { serviceLines } from "@/lib/site";

/**
 * Scrolling band of the things we actually build with.
 *
 * Terms come from the `stack` arrays in data/services.json rather than a
 * list typed in here, so the ticker cannot drift from the services page.
 *
 * The list is rendered twice and the track slides exactly -50%, which is
 * what makes the loop seamless — the second copy is under the cursor by
 * the time the first has left. Marked aria-hidden: it is decorative
 * repetition, and a screen reader would read every term twice. The
 * animation is one CSS keyframe, killed by the global reduced-motion rule.
 */
export function Ticker() {
  const terms = [...new Set(serviceLines.flatMap((s) => s.stack))];
  if (terms.length === 0) return null;

  return (
    <div aria-hidden="true" className="overflow-hidden py-4">
      <div className="ticker-track flex w-max gap-11">
        {[...terms, ...terms].map((term, i) => (
          <span
            key={`${term}-${i}`}
            className="font-data text-micro font-medium tracking-[0.13em] whitespace-nowrap text-ink-faint uppercase"
          >
            {term}
          </span>
        ))}
      </div>
    </div>
  );
}
