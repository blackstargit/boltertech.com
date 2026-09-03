/**
 * Scroll progress hairline.
 *
 * Driven by a native CSS scroll timeline — no scroll listener, no
 * requestAnimationFrame, no animation library, and therefore no INP cost.
 * Browsers without scroll-driven animation support simply never see it
 * grow, which is a non-issue for a decorative rule.
 *
 * The reduced-motion override lives in globals.css and applies globally.
 */
export function ScrollProgress() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-40 h-0.5 origin-[0_50%] scale-x-0 bg-accent"
      style={{
        animation: "draw-x linear both",
        animationTimeline: "scroll(root block)",
      }}
    />
  );
}
