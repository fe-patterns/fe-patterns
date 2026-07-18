import type { CollectionEntry } from "astro:content";

// Single source of truth for a blog post's public URL. Posts are addressed by a
// date-stamped path — /blog/YYYY/MM/DD/<slug> — so the URL carries the
// publication date. The date segments are formatted in UTC: frontmatter dates
// like `2026-07-04` parse as UTC midnight, and UTC getters keep the build
// machine's timezone from rolling the day back (e.g. to 07/03 in the Americas).

/** Path segment for a post: `YYYY/MM/DD/<slug>`, or just `<slug>` when undated. */
export function postSlug(entry: CollectionEntry<"blog">): string {
  const date = entry.data.date;
  if (!date) return entry.id;
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}/${m}/${d}/${entry.id}`;
}

/** Site-root-relative URL for a post, e.g. `/blog/2026/07/04/why-talk-about`. */
export function postHref(entry: CollectionEntry<"blog">): string {
  return `/blog/${postSlug(entry)}`;
}

const longDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

/** Reader-facing date, e.g. `July 4, 2026` — UTC, matching the URL segments. */
export function formatDate(date?: Date): string {
  return date ? longDate.format(date) : "";
}
