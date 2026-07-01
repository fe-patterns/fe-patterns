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
      // Edges authored on the Pattern (ADR-0001). Optional here — the
      // "must serve a Goal" invariant is a domain rule, not a build gate.
      "contributes-to": z.array(z.string()).optional(),
      uses: z.array(z.string()).optional(),
      "implemented-by": z.string().nullish(),
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
      // A Blog post explores one or more Patterns.
      explores: z.array(z.string()).optional(),
    })
    .passthrough(),
});

export const collections = { patterns, blog };
