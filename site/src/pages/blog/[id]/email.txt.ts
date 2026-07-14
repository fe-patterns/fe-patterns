import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { excerptBlocks, DEFAULT_EXCERPT_BLOCKS } from "../../../lib/excerpt";
import { postHref } from "../../../lib/blog";

// Paste-ready newsletter draft for a post, at /blog/<id>/email.txt. The body is
// the post's excerpt (first `excerpt-blocks` blocks, default 2) followed by a
// Buttondown "Keep reading" button that links back to the canonical post. Copy
// it straight into Buttondown's Markdown-mode composer — no HTML/Naked mode or
// custom CSS needed (both are paywalled). See docs/newsletter-setup.md.
export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}

export async function GET(context: APIContext) {
  const { entry } = context.props;
  const site = (context.site ?? "https://fepatterns.dev").toString().replace(/\/$/, "");
  const blocks = entry.data["excerpt-blocks"] ?? DEFAULT_EXCERPT_BLOCKS;
  const excerpt = excerptBlocks(entry.body, blocks);
  const url = `${site}${postHref(entry)}`;

  const body = `${excerpt}\n\n<buttondown-button href="${url}">Keep reading</buttondown-button>\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
