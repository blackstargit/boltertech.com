import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";

/**
 * Generic content collections.
 *
 * Deliberately not projects-specific: adding the blog later is a
 * content/posts folder, a schema, and two route files — no changes here
 * and none to anything that already reads a collection.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type CollectionEntry<T> = T & {
  slug: string;
  body: string;
};

function readDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => {
    if (!f.endsWith(".mdx") && !f.endsWith(".md")) return false;
    // Notes and drafts can live alongside content without being published.
    // Without this, dropping a README into a collection folder fails the
    // build with a frontmatter error, which is a nasty surprise for
    // someone who was only leaving a note for the next person.
    return !f.startsWith("_") && !f.toUpperCase().startsWith("README");
  });
}

/**
 * Read and validate every file in a collection.
 * Throws on the first invalid file, naming the file and the failing field.
 */
export function getCollection<S extends z.ZodTypeAny>(
  collection: string,
  schema: S,
  options: { includeDrafts?: boolean } = {},
): CollectionEntry<z.infer<S>>[] {
  const dir = path.join(CONTENT_ROOT, collection);
  const entries = readDir(dir).map((filename) => {
    const slug = filename.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(dir, filename), "utf8");
    const { data, content } = matter(raw);

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `  · ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      throw new Error(
        `Invalid frontmatter in content/${collection}/${filename}\n${issues}`,
      );
    }

    return {
      ...(parsed.data as Record<string, unknown>),
      slug,
      body: content,
    } as CollectionEntry<z.infer<S>>;
  });

  const includeDrafts =
    options.includeDrafts ?? process.env.NODE_ENV === "development";

  return includeDrafts
    ? entries
    : entries.filter((e) => !("draft" in e && e.draft));
}

export function getEntry<S extends z.ZodTypeAny>(
  collection: string,
  slug: string,
  schema: S,
): CollectionEntry<z.infer<S>> | null {
  return (
    getCollection(collection, schema, { includeDrafts: true }).find(
      (e) => e.slug === slug,
    ) ?? null
  );
}
