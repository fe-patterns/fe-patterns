import { defineConfig } from "vite-plus";

// Catalog workspace root config: dev, test, lint, and format in one place.
// No libraries yet — see ADR-0008 (toolchain) and ADR-0006 (workspace packages).
export default defineConfig({
  plugins: [],
  test: {
    include: ["libs/**/*.test.ts"],
  },
  lint: {
    ignorePatterns: ["dist/**", "node_modules/**"],
  },
});
