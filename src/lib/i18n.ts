/**
 * Locale registry.
 *
 * English only today, but the locale already lives in the URL so adding
 * a language never changes a published URL. Add an entry here, drop a
 * matching messages/<code>.json alongside it, and the router, the <html>
 * dir attribute and the (future) switcher all pick it up.
 */

export const locales = [
  { code: "en", label: "English", dir: "ltr" },
  // { code: "ur", label: "اردو",    dir: "rtl" },
  // { code: "ar", label: "العربية", dir: "rtl" },
] as const;

export type Locale = (typeof locales)[number]["code"];
export type Direction = "ltr" | "rtl";

export const defaultLocale: Locale = "en";
export const localeCodes = locales.map((l) => l.code) as readonly Locale[];

export function isLocale(value: string): value is Locale {
  return (localeCodes as readonly string[]).includes(value);
}

export function directionOf(locale: Locale): Direction {
  return locales.find((l) => l.code === locale)?.dir ?? "ltr";
}

/**
 * UI copy. Every user-facing string on the site comes from here or from
 * the content files — never from inside a component. That is the single
 * thing that makes adding a language cheap rather than a rewrite.
 */
export async function getMessages(locale: Locale) {
  const messages = await import(`../../messages/${locale}.json`);
  return messages.default as Messages;
}

export type Messages = typeof import("../../messages/en.json");

/** Prefix a path with its locale. Always use this instead of writing hrefs by hand. */
export function localePath(locale: Locale, path = "/") {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}
