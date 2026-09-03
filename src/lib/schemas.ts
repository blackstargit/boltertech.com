import { z } from "zod";

/**
 * Content schemas.
 *
 * Every content file is validated at build time. A typo in a category or
 * a missing title fails the build naming the file and the field, instead
 * of shipping a broken card — which matters because these files are
 * edited by people who are not reading component code.
 */

export const categories = ["ai-automation", "software", "data"] as const;
export type Category = (typeof categories)[number];

/** A project can carry any number of outbound links: a live demo on a
 *  subdomain, a repository, a writeup. Rendered only when present. */
const linkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  type: z.enum(["demo", "repo", "article", "other"]).default("other"),
});

const metricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const testimonialSchema = z.object({
  quote: z.string().min(1),
  author: z.string().min(1),
  role: z.string().default(""),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  /** Empty or absent means the client is not named; the sector is shown
   *  instead and marked withheld. Never render an empty label. */
  client: z.string().default(""),
  clientSector: z.string().min(1),
  category: z.enum(categories),
  summary: z.string().min(1),
  stack: z.array(z.string()).default([]),
  duration: z.string().default(""),
  year: z.number().int().min(2000).max(2100),
  status: z.enum(["Live", "Delivered", "Ongoing", "Archived"]).default("Delivered"),
  featured: z.boolean().default(false),
  order: z.number().int().default(999),
  metrics: z.array(metricSchema).default([]),
  links: z.array(linkSchema).default([]),
  cover: z.string().default(""),
  testimonial: testimonialSchema.nullable().default(null),
  draft: z.boolean().default(false),
});

export const legalSchema = z.object({
  title: z.string().min(1),
  updated: z.string().min(1),
  summary: z.string().default(""),
  draft: z.boolean().default(false),
});

/** Adding the blog later is this line plus a content/posts folder. */
// export const postSchema = z.object({ ... });

export type Project = z.infer<typeof projectSchema> & { slug: string };
export type Legal = z.infer<typeof legalSchema> & { slug: string };
