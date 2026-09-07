import { faqList, type Faq } from "@/lib/site";

/**
 * Native <details>, so it works with JavaScript disabled and costs
 * nothing in INP. The matching FAQPage JSON-LD is emitted by the page
 * that renders this — currently /services, where objections actually
 * surface.
 *
 * The `+` rotating to an `×` is a transform on one glyph, not an icon
 * swap, so there is nothing to load and nothing to get out of sync with
 * the open state.
 */
export function FaqList({ faqs = faqList }: { faqs?: Faq[] }) {
  return (
    <div className="border-t border-rule">
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-rule">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lede font-medium marker:content-[''] hover:text-accent [&::-webkit-details-marker]:hidden">
            {f.q}
            <span
              aria-hidden="true"
              className="shrink-0 font-data text-h4 leading-none text-accent transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="max-w-prose pb-7 text-pretty text-ink-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
