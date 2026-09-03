import type { MetadataRoute } from "next";
import { allRoutes, languageAlternates } from "@/lib/routes";
import { localeCodes, localePath, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/**
 * Generated from the route inventory, so it cannot drift from the site.
 * Submit https://boltertech.com/sitemap.xml in Google Search Console.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return allRoutes().flatMap((route) =>
    localeCodes.map((locale) => ({
      url: new URL(
        localePath(locale as Locale, route.path),
        SITE_URL,
      ).toString(),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(route.path)).map(([code, path]) => [
            code,
            new URL(path, SITE_URL).toString(),
          ]),
        ),
      },
    })),
  );
}

export const dynamic = "force-static";
