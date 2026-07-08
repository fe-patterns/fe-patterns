# Hero images

Drop a post's hero image here, then reference it by filename in the post's
frontmatter:

```yaml
---
title: Some Post
hero: some-post.jpg
---
```

A `hero` drives two surfaces from this one file:

- the in-page hero band (full-width, 1.91:1 cover-cropped, above the title)
- the OG share card (Variant B — image + bottom scrim + brand lockup + title)

Omit `hero` and the post gets no band and the generated Variant A card
(logo + wordmark + title + optional description).

Use **PNG, JPEG, or WebP** (not AVIF — the OG card renderer can't decode it).
Prefer images at least 1200×630; they're cover-cropped to 1.91:1.
