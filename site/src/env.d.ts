/// <reference types="astro/client" />

// Fontsource packages ship only CSS (no type declarations). With
// moduleResolution "Bundler", their bare specifiers resolve to `index.css`,
// which TypeScript can't type — this declares them as side-effect imports.
declare module "@fontsource-variable/*";
