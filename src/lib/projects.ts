import { getCollection, getEntry, type CollectionEntry } from "@/lib/content";
import { projectSchema, type Category } from "@/lib/schemas";

export type ProjectEntry = CollectionEntry<
  ReturnType<typeof projectSchema.parse>
>;

/** Sorted by explicit `order`, then most recent year. */
export function getProjects(): ProjectEntry[] {
  return getCollection("projects", projectSchema).sort(
    (a, b) => a.order - b.order || b.year - a.year,
  );
}

export function getProject(slug: string) {
  return getEntry("projects", slug, projectSchema);
}

export function getFeaturedProjects(limit = 4): ProjectEntry[] {
  const featured = getProjects().filter((p) => p.featured);
  return (featured.length ? featured : getProjects()).slice(0, limit);
}

export function getProjectsByCategory(category: Category): ProjectEntry[] {
  return getProjects().filter((p) => p.category === category);
}

/**
 * The homepage outcome band reads from real project frontmatter rather
 * than hand-written numbers, so editing a case study updates the home page.
 *
 * One metric per project, not the first three off the top project — three
 * figures from a single case study reads as one client, not a track record.
 */
export function getHeadlineMetrics(limit = 3) {
  return getFeaturedProjects(limit)
    .flatMap((p) => (p.metrics[0] ? [{ ...p.metrics[0], slug: p.slug }] : []))
    .slice(0, limit);
}

/** Next project in the list, wrapping at the end. Keeps readers in the portfolio. */
export function getAdjacentProject(slug: string) {
  const all = getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1 || all.length < 2) return null;
  return all[(i + 1) % all.length];
}
