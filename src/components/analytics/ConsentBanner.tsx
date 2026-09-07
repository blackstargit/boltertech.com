"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";

/**
 * GA4 is opt-in: the tag only loads after the visitor accepts. Choice is
 * remembered in localStorage, not a cookie, so declining sets nothing.
 * No Google Consent Mode signals here on purpose — with nothing loaded
 * pre-consent, there is nothing for Consent Mode to gate.
 */

const CONSENT_KEY = "analytics-consent";
type Consent = "pending" | "unset" | "granted" | "denied";

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
  const [consent, setConsent] = useState<Consent>("pending");

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    setConsent(stored === "granted" || stored === "denied" ? stored : "unset");
  }, []);

  function choose(value: "granted" | "denied") {
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  }

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
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-wrap items-center justify-between gap-3 border-t border-rule bg-sheet px-gutter py-4">
      <p className="text-small text-ink-muted">
        {messages.message}{" "}
        <Link href={privacyHref} className="text-accent hover:text-ink">
          {messages.privacyLink}
        </Link>
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="border border-rule px-4 py-2 font-data text-micro tracking-[0.08em] text-ink-muted uppercase transition-colors hover:text-ink"
        >
          {messages.decline}
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="border border-ink bg-ink px-4 py-2 font-data text-micro tracking-[0.08em] text-ink-invert uppercase transition-colors hover:border-accent hover:bg-accent"
        >
          {messages.accept}
        </button>
      </div>
    </div>
  );
}
