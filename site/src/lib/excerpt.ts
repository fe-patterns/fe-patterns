// The teaser shared by the newsletter email draft (/blog/<id>/email.txt) and the
// RSS feed. Both show the post's first few blocks and then link back to the
// canonical post, so the email and the feed tell the same short story.

/** Default number of leading blocks a post's excerpt shows. */
export const DEFAULT_EXCERPT_BLOCKS = 2;

const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s+/;

/**
 * Insert a blank line before any list that directly follows a paragraph.
 * CommonMark starts the list either way, but Buttondown's markdown only treats
 * it as a list when it's blank-line-separated — so a tight `intro:\n1. …` in the
 * source would otherwise arrive in the email as plain text. Fenced code is left
 * untouched.
 */
export function blankLineBeforeLists(markdown: string): string {
  let inFence = false;
  const out: string[] = [];
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const prev = out[out.length - 1];
    if (
      !inFence &&
      LIST_ITEM.test(line) &&
      prev !== undefined &&
      prev.trim() !== "" &&
      !LIST_ITEM.test(prev)
    ) {
      out.push("");
    }
    out.push(line);
  }
  return out.join("\n");
}

/**
 * The first `blocks` non-empty blocks of a markdown body, as markdown. A "block"
 * is a blank-line-separated chunk (a paragraph, list, heading…), so formatting
 * inside it — bold, links, list items — is preserved. Leading frontmatter, if any
 * survives into the body, is dropped.
 */
export function excerptBlocks(body: string | undefined, blocks = DEFAULT_EXCERPT_BLOCKS): string {
  if (!body) return "";
  const withoutFrontmatter = body.replace(/^---[\s\S]*?---\s*/, "");
  const excerpt = withoutFrontmatter
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0)
    .slice(0, Math.max(0, blocks))
    .join("\n\n");
  // Normalize after slicing so block counting is unaffected.
  return blankLineBeforeLists(excerpt);
}
