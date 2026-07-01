import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

// Static Catalog site. Its Vite is internal to this package — no interaction with
// the workspace's Vite+ (vp) toolchain, which builds the libs. See ADR-0011.
export default defineConfig({
  site: "https://fe-patterns.netlify.app",
  integrations: [mdx()],
});
