"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * The narrow-viewport nav disclosure.
 *
 * The open/close itself is native `<details>` — it works with JavaScript
 * disabled, and the browser already gives it correct keyboard and
 * screen-reader behaviour. This component adds only the three things the
 * element does not do on its own:
 *
 *   1. close when the pointer goes down anywhere outside it
 *   2. close on Escape
 *   3. close after a route change, since the header lives in the layout
 *      and survives client-side navigation — without this the menu stays
 *      hanging open over the page you just navigated to
 *
 * This is the only client component in the site chrome. It exists because
 * "click outside to dismiss" cannot be expressed in CSS: there is no
 * selector for "the user pressed somewhere else". The children are passed
 * in already rendered on the server, so no page content is pulled into
 * the client bundle by this.
 */
export function MobileMenu({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const close = () => {
      el.open = false;
    };

    // pointerdown, not click: dismiss should feel immediate, and it fires
    // before a link inside the page has a chance to steal focus.
    const onPointerDown = (event: PointerEvent) => {
      if (el.open && !el.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && el.open) {
        close();
        el.querySelector("summary")?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Route changed — the menu that opened it is still on screen. Close it.
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details ref={ref} className={`group relative ${className}`}>
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-sm border border-rule px-3.5 py-2 font-data text-micro font-medium text-ink uppercase marker:content-[''] [&::-webkit-details-marker]:hidden">
        {label}
        <span
          aria-hidden="true"
          className="text-accent transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      {children}
    </details>
  );
}
