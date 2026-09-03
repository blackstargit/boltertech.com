import { faqList, type Faq } from "@/lib/site";

/**
 * Native <details>, so it works with JavaScript disabled and costs
 * nothing in INP. The matching FAQPage JSON-LD is emitted by the page
 * that renders this — currently /services, where objections actually
 * surface.
 */
export function FaqList({ faqs = faqList }: { faqs?: Faq[] }) {
  return (
    <div className="border-t border-rule">
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-rule">
          <summary className="flex cursor-pointer items-center justify-between gap-4 py-3.5 text-body marker:content-['']">
            {f.q}
            <span
              aria-hidden="true"
              className="font-data text-label text-accent transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="max-w-prose pb-4 text-small text-ink-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
