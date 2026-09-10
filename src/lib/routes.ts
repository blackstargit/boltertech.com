import { getProjects } from "@/lib/projects";
import { localeCodes, localePath, type Locale } from "@/lib/i18n";

/**
 * The site's route inventory, in one place.
 *
 * The sitemap, the hreflang alternates and any future navigation all read
 * from here, so a new page cannot be added and then quietly forgotten by
 * the sitemap — which is the usual way pages end up unindexed.
 */

export type RouteDef = {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

/** Static pages. Add a route here when you add a page. */
export const staticRoutes: RouteDef[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/work", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  { path: "/estimate", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

/** Every content-driven route. Case studies today; posts too, later. */
export function contentRoutes(): RouteDef[] {
  return getProjects().map((p) => ({
    path: `/work/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
}

export function allRoutes(): RouteDef[] {
  return [...staticRoutes, ...contentRoutes()];
}

/**
 * hreflang map for a path: every locale that serves it, plus x-default
 * pointing at the default locale. Search engines use this to serve the
 * right language and to avoid treating translations as duplicates.
 */
export function languageAlternates(path: string) {
  return Object.fromEntries(
    localeCodes.map((code) => [code, localePath(code as Locale, path)]),
  );
}
