import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * The mark always sits on a dark plate.
 *
 * This is not a stylistic choice. The mark's strokes run from mid-cyan to
 * near-white because it was drawn to glow on black; on a light ground the
 * bright interior of every stroke lands within a few percent of the page
 * and the logo visually dissolves. The plate is what makes it legible,
 * and it reads as the stamp on a drawing set.
 *
 * When public/logo-flat.svg is replaced with a real flat single-colour
 * mark, that file is what should be used for the favicon and for any
 * context that cannot carry a plate (print, 16px, LinkedIn's square).
 */
export function LogoLock({
  locale,
  size = 44,
  showWordmark = true,
}: {
  locale: Locale;
  size?: number;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href={localePath(locale)}
      className="flex items-center gap-3.5"
      aria-label={site.name}
    >
      <span className="grid place-items-center border border-rule bg-plate p-2">
        <Image
          src="/logo-mark.png"
          alt=""
          width={size}
          height={size}
          priority
          className="block h-auto"
          style={{ width: size }}
        />
      </span>
      {showWordmark ? (
        <span className="font-display text-base font-bold tracking-[0.16em]">
          {site.shortName.toUpperCase()}
          <span className="block font-data text-[0.5625rem] font-normal tracking-[0.1em] text-ink-muted">
            Technologies &middot; {site.address.city}
          </span>
        </span>
      ) : null}
    </Link>
  );
}
