// Single source of truth for the fe-patterns brand primitives. Consumed by the
// on-page Logo/Header, the layout's <title>/og:site_name, and the hand-rolled OG
// card renderer — so the mark, the name, and the accent are defined exactly once.

/** The mark — a straightened folk-weave motif. Even-odd fill. */
export const LOGO_PATH =
  "M53.98,93.99 L71.29,76.68 L54.37,59.77 L62.35,51.00 L73.57,51.15 L82.57,60.45 L88.05,60.25 L112.21,35.52 L95.40,18.77 L102.21,11.33 L115.24,11.32 L125.61,22.05 L136.74,11.50 L151.03,10.97 L157.12,18.09 L139.22,35.37 L165.00,61.09 L169.97,60.93 L179.71,50.93 L190.69,51.10 L198.72,59.43 L181.16,77.19 L198.36,94.60 L190.85,101.64 L178.36,101.64 L169.72,93.10 L165.04,93.15 L140.20,118.16 L157.13,135.02 L149.06,143.46 L138.06,143.19 L126.60,131.67 L115.00,143.21 L103.35,143.55 L95.28,135.49 L112.74,118.03 L88.06,93.25 L81.64,93.07 L73.70,101.75 L62.03,101.99 L53.98,93.99 Z M59.40,8.26 L8.50,58.91 L26.49,77.01 L8.00,95.61 L59.14,146.59 L73.80,146.79 L101.97,118.10 L91.18,107.49 L79.45,107.28 L70.61,115.89 L65.11,115.89 L43.87,94.38 L61.28,77.31 L43.73,59.83 L65.86,37.84 L70.24,37.80 L80.19,48.42 L90.75,48.35 L102.19,36.56 L73.96,8.26 L59.40,8.26 Z M192.82,146.53 L243.72,95.88 L225.73,77.78 L244.22,59.18 L193.08,8.20 L178.42,8.00 L150.25,36.69 L161.04,47.30 L172.77,47.51 L181.61,38.90 L187.11,38.90 L208.35,60.41 L190.94,77.48 L208.49,94.96 L186.36,116.95 L181.98,116.99 L172.03,106.37 L161.47,106.44 L150.03,118.23 L178.26,146.53 L192.82,146.53 Z M98.70,76.39 L123.44,101.69 L129.11,101.63 L153.82,77.26 L127.78,51.11 L123.75,51.18 L98.70,76.39 Z M109.37,77.13 L118.14,85.79 L134.14,85.79 L142.65,77.29 L134.14,68.81 L118.11,68.74 L109.37,77.13 Z";

export const LOGO_VIEWBOX = { w: 252.22, h: 154.79 } as const;

/** Human-readable brand name — used in the header, tab title, and OG cards. */
export const WORDMARK = "Frontend Patterns";

/** Brand accent (light-theme value), as [r, g, b] 0–255. */
export const ACCENT: [number, number, number] = [0x91, 0xa7, 0xff];

/** The site's sole author — bylines (post page, RSS) all point at this name. */
export const AUTHOR = "Bogdan Zaharia";
