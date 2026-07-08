// Build-time OG cards — one PNG per blog post at /og/blog/<id>.png. Rendering is
// hand-rolled in src/lib/og-card.ts (canvaskit-wasm); a post's `hero` frontmatter
// (a filename in src/assets/hero/) switches it from Variant A to Variant B.
import type { APIRoute, GetStaticPaths } from "astro";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { getCollection } from "astro:content";
import { renderCard } from "../../lib/og-card";

const heroPathFor = (hero?: string): string | undefined => {
  if (!hero) return undefined;
  // Read the original source file (resolved from the build cwd = site root),
  // not the bundled/hashed asset.
  const abs = resolve(process.cwd(), "src/assets/hero", hero);
  if (!existsSync(abs)) throw new Error(`hero image not found: src/assets/hero/${hero}`);
  return abs;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { route: `blog/${post.id}.png` },
    props: {
      title: post.data.title ?? "Frontend Patterns",
      description: post.data.description,
      hero: post.data.hero,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderCard({
    title: props.title,
    description: props.description,
    heroPath: heroPathFor(props.hero),
  });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
