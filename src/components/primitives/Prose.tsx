import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";

/**
 * Long-form MDX rendering.
 *
 * Tailwind's typography plugin is deliberately not installed: it ships a
 * whole opinionated colour and spacing system that would fight the tokens,
 * and everything below is a dozen rules. The measure is capped at
 * --container-prose so case studies stay readable at 1,500 words.
 *
 * Element overrides live in one map so the design language applies to
 * authored content too, without anyone writing HTML in an MDX file.
 */

/**
 * URL fragment for a heading inside an MDX body. Shared with
 * `proseHeadings` so the on-this-page rail and the headings it links to
 * cannot drift apart.
 *
 * Prefixed because authored content and page chrome share one id
 * namespace: every case study body has an `## Outcome` heading, and the
 * outcome band's own SectionHead already owns `id="outcome"`. Without the
 * prefix that is a duplicate id — a real accessibility failure, and the
 * rail would scroll to whichever came first rather than to the section.
 */
export function slugify(text: string) {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
  return `s-${slug}`;
}

/**
 * The `##` headings in an MDX body, in document order.
 *
 * Fenced code is stripped first, so a comment like `## note` inside a code
 * block does not turn up in the contents rail.
 */
export function proseHeadings(source: string) {
  const prose = source.replace(/```[\s\S]*?```/g, "");
  return [...prose.matchAll(/^##[ \t]+(.+?)[ \t]*$/gm)].map((match) => ({
    text: match[1],
    id: slugify(match[1]),
  }));
}

/** MDX passes a plain string for a simple heading; anything richer gets no
 *  anchor rather than a wrong one. */
function headingId(children: ReactNode) {
  return typeof children === "string" ? slugify(children) : undefined;
}

const components = {
  h2: ({ children, ...props }: { children?: ReactNode }) => (
    <h2
      id={headingId(children)}
      /* scroll-mt clears the sticky header when the rail jumps here. */
      className="mt-14 scroll-mt-28 text-h3 first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3 className="mt-10 scroll-mt-28 text-h4" {...props} />
  ),
  p: (props: { children?: ReactNode }) => (
    <p className="mt-5 text-pretty text-ink-muted" {...props} />
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul
      className="mt-5 grid list-disc gap-2.5 ps-5 text-ink-muted marker:text-accent"
      {...props}
    />
  ),
  ol: (props: { children?: ReactNode }) => (
    <ol
      className="mt-5 grid list-decimal gap-2.5 ps-5 text-ink-muted marker:font-data marker:text-accent"
      {...props}
    />
  ),
  a: (props: { children?: ReactNode; href?: string }) => (
    <a
      className="text-accent underline underline-offset-2 hover:text-ink"
      {...props}
    />
  ),
  blockquote: (props: { children?: ReactNode }) => (
    <blockquote
      className="mt-7 rounded-e-md border-s-2 border-accent bg-sheet px-6 py-4 text-ink"
      {...props}
    />
  ),
  pre: (props: { children?: ReactNode }) => (
    <pre
      className="mt-6 overflow-x-auto rounded-md border border-rule bg-sheet p-5 font-data text-micro leading-relaxed"
      {...props}
    />
  ),
  code: (props: { children?: ReactNode }) => (
    <code className="font-data text-[0.85em] text-accent" {...props} />
  ),
  table: (props: { children?: ReactNode }) => (
    <div className="mt-7 overflow-x-auto rounded-md border border-rule">
      <table className="w-full border-collapse text-small" {...props} />
    </div>
  ),
  th: (props: { children?: ReactNode }) => (
    <th
      className="border-b border-rule bg-sheet px-4 py-3 text-start font-data text-label font-medium tracking-[0.16em] text-ink-faint uppercase"
      {...props}
    />
  ),
  td: (props: { children?: ReactNode }) => (
    <td
      className="border-b border-rule-faint px-4 py-3 align-top text-ink-muted"
      {...props}
    />
  ),
  hr: () => <hr className="mt-12 border-rule" />,
};

export function Prose({ source }: { source: string }) {
  return (
    <div className="max-w-prose text-lede">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
