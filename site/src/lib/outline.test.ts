import { describe, expect, it } from "vite-plus/test";

import { outlineEntries } from "./outline";

const h = (depth: number, slug: string) => ({ depth, slug, text: slug });

describe("outlineEntries", () => {
  it("keeps only h2 headings", () => {
    const entries = outlineEntries([
      h(1, "title"),
      h(2, "one"),
      h(3, "one-a"),
      h(2, "two"),
      h(2, "three"),
    ]);
    expect(entries.map((e) => e.slug)).toEqual(["one", "two", "three"]);
  });

  it("returns no entries when the post has fewer than 3 h2s", () => {
    expect(outlineEntries([h(2, "one"), h(3, "one-a"), h(2, "two")])).toEqual([]);
  });

  it("returns no entries for a post with no headings", () => {
    expect(outlineEntries([])).toEqual([]);
  });
});
