// The teaser shared by the newsletter email draft (/blog/<id>/email.txt) and the
// RSS feed. Both show the post's first few blocks and then link back to the
// canonical post, so the email and the feed tell the same short story.

/** Default number of leading blocks a post's excerpt shows. */
export const DEFAULT_EXCERPT_BLOCKS = 2;

/**
 * The first `blocks` non-empty blocks of a markdown body, as markdown. A "block"
 * is a blank-line-separated chunk (a paragraph, list, heading…), so formatting
 * inside it — bold, links, list items — is preserved. Leading frontmatter, if any
 * survives into the body, is dropped.
 */
export function excerptBlocks(
  body: string | undefined,
  blocks = DEFAULT_EXCERPT_BLOCKS,
): string {
  if (!body) return "";
  const withoutFrontmatter = body.replace(/^---[\s\S]*?---\s*/, "");
  return withoutFrontmatter
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0)
    .slice(0, Math.max(0, blocks))
    .join("\n\n");
}
