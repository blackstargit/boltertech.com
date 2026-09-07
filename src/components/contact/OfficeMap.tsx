"use client";

import { useState } from "react";

/**
 * Square map preview plus a copy-address button.
 *
 * The only client-side bit here is the clipboard write, so this stays a
 * small standalone component rather than pulling the contact page's
 * StoreProvider wider - the map itself is a plain iframe.
 */
export function OfficeMap({
  address,
  embedUrl,
  copyLabel,
  copiedLabel,
  googleMapsUrl,
  googleMapsLabel,
}: {
  address: string;
  embedUrl: string;
  copyLabel: string;
  copiedLabel: string;
  googleMapsUrl: string;
  googleMapsLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission).
      // The address is printed in full above the map either way.
    }
  }

  return (
    <div className="grid gap-2">
      <div className="aspect-square w-full overflow-hidden border border-rule">
        <iframe
          src={embedUrl}
          title="Office location"
          className="h-full w-full border-0"
          loading="lazy"
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <button
          type="button"
          onClick={copyAddress}
          className="font-data text-label tracking-[0.07em] text-ink-muted uppercase underline underline-offset-4 transition-colors hover:text-accent"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
        <span aria-hidden="true" className="text-ink-muted">
          &middot;
        </span>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-data text-label tracking-[0.07em] text-ink-muted uppercase underline underline-offset-4 transition-colors hover:text-accent"
        >
          {googleMapsLabel}
        </a>
      </div>
    </div>
  );
}
