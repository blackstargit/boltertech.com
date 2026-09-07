"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ctaClasses } from "@/components/primitives/Cta";
import Script from "next/script";

/**
 * GA4 is opt-in: the tag only loads after the visitor accepts. Choice is
 * remembered in localStorage, not a cookie, so declining sets nothing.
 * No Google Consent Mode signals here on purpose — with nothing loaded
 * pre-consent, there is nothing for Consent Mode to gate.
 */

const CONSENT_KEY = "analytics-consent";
type Consent = "pending" | "unset" | "granted" | "denied";

/**
 * localStorage is an external store, so React reads it through the API
 * built for that rather than through an effect that immediately calls
 * setState — which is a cascading render on every mount, and what
 * react-hooks/set-state-in-effect is pointing at.
 *
 * The `storage` event only fires in *other* tabs, so writes from this one
 * notify the local listeners directly. That is also what makes the choice
 * take effect in every open tab at once.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readConsent(): Consent {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : "unset";
  } catch {
    // Private mode, or site data blocked. Treat as no answer given.
    return "unset";
  }
}

/** No localStorage on the server. "pending" renders nothing, so the banner
 *  never appears in the HTML before the real answer is known. */
function serverConsent(): Consent {
  return "pending";
}

function writeConsent(value: "granted" | "denied") {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Nothing to persist to; the choice still applies for this page view.
  }
  for (const onChange of listeners) onChange();
}

type Props = {
  measurementId: string;
  privacyHref: string;
  messages: {
    message: string;
    privacyLink: string;
    accept: string;
    decline: string;
  };
};

export function ConsentBanner({ measurementId, privacyHref, messages }: Props) {
  const consent = useSyncExternalStore(
    subscribe,
    readConsent,
    serverConsent,
  );

  if (consent === "granted") {
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');`}
        </Script>
      </>
    );
  }

  if (consent !== "unset") return null;

  return (
    <div
      data-theme="dark"
      className="fixed inset-x-0 bottom-0 z-50 flex flex-wrap items-center justify-between gap-4 border-t border-rule bg-sheet px-gutter py-4"
    >
      <p className="text-small text-ink-muted">
        {messages.message}{" "}
        <Link
          href={privacyHref}
          className="text-accent underline-offset-2 hover:underline"
        >
          {messages.privacyLink}
        </Link>
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => writeConsent("denied")}
          className={`${ctaClasses("outline")} px-5 py-2.5`}
        >
          {messages.decline}
        </button>
        <button
          type="button"
          onClick={() => writeConsent("granted")}
          className={`${ctaClasses("solid")} px-5 py-2.5`}
        >
          {messages.accept}
        </button>
      </div>
    </div>
  );
}
