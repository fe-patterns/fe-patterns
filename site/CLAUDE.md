# fe-patterns site

## Social cards / hero images

The site's OG cards are rendered at build time (`src/lib/og-card.ts`, canvaskit-wasm). A blog post's optional `hero` frontmatter — a **PNG/JPEG/WebP** filename in `src/assets/hero/` — drives both the in-page hero band and the "Variant B" OG card; without it the post gets the generated "Variant A" card. Brand primitives (logo path, wordmark, accent) live in `src/lib/brand.ts`.
