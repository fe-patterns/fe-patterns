// The post Outline (issue #5): a flat list of the post's h2 sections, shown
// only when there are enough of them to be worth navigating.

/** Structural subset of Astro's MarkdownHeading. */
export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

export interface OutlineEntry {
  slug: string;
  text: string;
}

/** A two-entry outline barely earns its screen space; three is where it helps. */
const MIN_ENTRIES = 3;

export function outlineEntries(headings: Heading[]): OutlineEntry[] {
  const entries = headings.filter((h) => h.depth === 2).map(({ slug, text }) => ({ slug, text }));
  return entries.length >= MIN_ENTRIES ? entries : [];
}
