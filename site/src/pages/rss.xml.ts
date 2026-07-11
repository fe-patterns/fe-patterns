import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { excerptBlocks, DEFAULT_EXCERPT_BLOCKS } from "../lib/excerpt";

// Excerpt feed: each item carries the post's first few blocks (`excerpt-blocks`,
// default 2) as rendered HTML in `content:encoded`, followed by a "Keep reading"
// link back to the canonical post — the same teaser the newsletter email sends
// (/blog/<id>/email.txt), so feed and email stay in step. See
// docs/newsletter-setup.md.
//
// The body is plain markdown (the blog collection globs **/*.md), so we render
// it with markdown-it and sanitize the result. This won't run Astro's exact
// remark/rehype plugin chain, but it's a faithful-enough render for email.
const md = new MarkdownIt({ html: true, linkify: true });

function toAbsolute(html: string, site: string): string {
  // Rewrite root-relative links/images so they resolve in an email client.
  return html
    .replace(/(href|src)="\/(?!\/)/g, `$1="${site.replace(/\/$/, "")}/`);
}

function renderContent(body: string | undefined, site: string): string {
  if (!body) return "";
  const html = sanitizeHtml(md.render(body), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height"],
    },
  });
  return toAbsolute(html, site);
}

/** First paragraph of the raw markdown body, lightly de-marked and clamped. */
function excerpt(body: string | undefined, max = 280): string {
  if (!body) return "";
  const firstPara = body
    .replace(/^---[\s\S]*?---/, "") // drop any leftover frontmatter
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p.length > 0);
  if (!firstPara) return "";
  const plain = firstPara
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → text
    .replace(/[*_`#>]/g, "") // inline md marks
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? plain.slice(0, max).trimEnd() + "…" : plain;
}

export async function GET(context: APIContext) {
  const site = (context.site ?? "https://fepatterns.dev").toString();
  const base = site.replace(/\/$/, "");
  const posts = (await getCollection("blog")).sort(
    (a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0),
  );

  return rss({
    title: "fe-patterns · Blog",
    description: "Posts exploring frontend patterns.",
    site,
    items: posts.map((post) => {
      const url = `${base}/blog/${post.id}/`;
      const blocks = post.data["excerpt-blocks"] ?? DEFAULT_EXCERPT_BLOCKS;
      const teaser = renderContent(excerptBlocks(post.body, blocks), site);
      return {
        title: post.data.title ?? post.id,
        link: `/blog/${post.id}/`,
        pubDate: post.data.date,
        description: post.data.description ?? excerpt(post.body),
        content: `${teaser}\n<p><a href="${url}">Keep reading →</a></p>`,
      };
    }),
  });
}
