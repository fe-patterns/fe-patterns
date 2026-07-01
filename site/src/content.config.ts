import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// The site is a Projection: it renders the Catalog's source-of-truth markdown in
// place (../patterns, ../blog) rather than duplicating it. Schemas are permissive
// for now — the Obsidian frontmatter edges (contributes-to, uses, guards…) will be
// pinned once real content lands.
const patterns = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "../patterns" }),
  schema: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .passthrough(),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "../blog" }),
  schema: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      date: z.coerce.date().optional(),
    })
    .passthrough(),
});

export const collections = { patterns, blog };
