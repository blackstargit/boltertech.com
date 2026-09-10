import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * The mark is used as-is, on the page ground.
 *
 * public/logo-mark.png is transparent; the dark plate that used to sit
 * behind it was removed on request.
 *
 * When public/logo-flat.svg is replaced with a real flat single-colour
 * mark, that file is what should be used for the favicon and for any
 * context that needs one solid colour (print, 16px, LinkedIn's square).
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
      /**
       * Only label the link when there is no visible wordmark.
       *
       * With the wordmark shown, an aria-label of just "Bolter
       * Technologies" overrides visible text that also reads
       * "Technologies" — so a voice-control user saying what
       * they can see matches the accessible name.
       */
      aria-label={showWordmark ? undefined : site.name}
    >
      <Image
        src="/logo-mark.png"
        alt=""
        width={size}
        height={size}
        priority
        className="block h-auto"
        style={{ width: size + 16 }}
      />
      {showWordmark ? (
        <span className="font-display text-base font-bold tracking-[0.16em]">
          {site.shortName.toUpperCase()}
          <span className="block font-data text-[0.5625rem] font-normal tracking-[0.1em] text-ink-muted">
            Technologies
          </span>
        </span>
      ) : null}
    </Link>
  );
}
