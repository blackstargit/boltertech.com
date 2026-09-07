/**
 * Placeholder scaffolding.
 *
 * Optional content is absent-by-default at runtime — that rule has not
 * changed, and it is what keeps invented client metrics off the site.
 * But "absent" is invisible, and an empty slot tells you nothing about
 * how the page will look once it is filled. So while the site is
 * pre-launch, missing optional content renders a clearly-marked stand-in
 * instead of nothing: the real footprint, in wireframe, captioned as a
 * placeholder.
 *
 * Nothing here is ever mistakable for real data. Placeholders are
 * hatched, dashed, monochrome — they never take the accent colour, which
 * is reserved for measured figures.
 *
 * ── BEFORE LAUNCH ──────────────────────────────────────────────────────
 * Set NEXT_PUBLIC_SHOW_PLACEHOLDERS=0 in the Vercel production
 * environment. Every stand-in disappears and the absent-by-default
 * behaviour is what ships. Leave it unset in preview and local so the
 * team keeps seeing what is still unwritten.
 */
export const SHOW_PLACEHOLDERS =
  process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS !== "0";
