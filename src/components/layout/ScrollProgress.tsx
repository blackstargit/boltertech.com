/**
 * Scroll progress bar, pinned to the bottom edge of the sticky header.
 *
 * A child of `<header>`, which is `position: sticky` — sticky is itself a
 * positioned element, so it is the containing block for this `absolute`
 * child with no extra `relative` needed on the header.
 *
 * Driven by a native CSS scroll timeline — no scroll listener, no
 * requestAnimationFrame, no animation library, and therefore no INP cost.
 * Browsers without scroll-driven animation support simply never see it
 * grow, which is a non-issue for a decorative rule.
 *
 * The `draw-x` keyframe (globals.css) animates the standalone `scale`
 * property, not `transform` — Tailwind v4's `scale-x-0` utility below sets
 * `scale`, a distinct CSS property. An earlier version animated
 * `transform: scaleX()` against that same base class and the bar was
 * permanently full-width: two different properties that never interacted.
 *
 * The reduced-motion override lives in globals.css and applies globally.
 */
export function ScrollProgress() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-[3px] origin-[0_50%] scale-x-0 bg-accent"
      style={{
        animation: "draw-x linear both",
        animationTimeline: "scroll(root block)",
      }}
    />
  );
}
