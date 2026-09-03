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
 * Element overrides live in one map so the drafting language applies to
 * authored content too, without anyone writing HTML in an MDX file.
 */
const components = {
  h2: (props: { children?: ReactNode }) => (
    <h2
      className="mt-10 border-b border-ink pb-2 text-h3 first:mt-0"
      {...props}
    />
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3 className="mt-8 text-body font-medium" {...props} />
  ),
  p: (props: { children?: ReactNode }) => (
    <p className="mt-4 text-ink-muted" {...props} />
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className="mt-4 grid list-disc gap-2 ps-5 text-ink-muted" {...props} />
  ),
  ol: (props: { children?: ReactNode }) => (
    <ol
      className="mt-4 grid list-decimal gap-2 ps-5 text-ink-muted"
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
      className="mt-6 border-s-2 border-accent bg-accent-soft px-5 py-3 text-small text-ink"
      {...props}
    />
  ),
  pre: (props: { children?: ReactNode }) => (
    <pre
      className="mt-5 overflow-x-auto border border-rule bg-sheet p-4 font-data text-micro leading-relaxed"
      {...props}
    />
  ),
  code: (props: { children?: ReactNode }) => (
    <code className="font-data text-[0.85em] text-accent" {...props} />
  ),
  table: (props: { children?: ReactNode }) => (
    <div className="mt-6 overflow-x-auto border border-rule">
      <table className="w-full border-collapse text-small" {...props} />
    </div>
  ),
  th: (props: { children?: ReactNode }) => (
    <th
      className="border-b border-ink px-3 py-2 text-start font-data text-label uppercase tracking-[0.07em] font-normal text-ink-muted"
      {...props}
    />
  ),
  td: (props: { children?: ReactNode }) => (
    <td className="border-b border-rule-faint px-3 py-2 align-top" {...props} />
  ),
  hr: () => <hr className="mt-8 border-rule" />,
};

export function Prose({ source }: { source: string }) {
  return (
    <div className="max-w-prose">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
