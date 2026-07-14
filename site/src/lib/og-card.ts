// Hand-rolled 1200×630 OG card renderer, built on canvaskit-wasm. Two layouts:
//
//   Variant A (no hero image) — dark gradient, accent edge, [logo + wordmark]
//     lockup at top, big post title + optional description bottom-anchored.
//   Variant B (hero image)    — the photo fills the card (cover), a bottom scrim
//     keeps text legible, and [logo + wordmark] + title sit at the bottom.
//
// The logo is drawn as a vector path straight from the shared brand module —
// no PNG artifact, no duplicated path data.
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import CanvasKitInit from "canvaskit-wasm";
import type { CanvasKit, Paragraph, FontMgr, Canvas } from "canvaskit-wasm";
import { LOGO_PATH, LOGO_VIEWBOX, WORDMARK, ACCENT } from "./brand";

const WIDTH = 1200;
const HEIGHT = 630;
const PAD = 70;

// Palette (matches the site's dark theme).
const BG_TOP: RGB = [26, 27, 32];
const BG_BOTTOM: RGB = [17, 17, 16];
const TITLE_COLOR: RGB = [236, 236, 234];
const MUTED_COLOR: RGB = [154, 154, 147];

type RGB = [number, number, number];

export interface CardOptions {
  title: string;
  description?: string;
  /** Absolute path to a hero image → renders Variant B. */
  heroPath?: string;
}

// --- CanvasKit + fonts, initialised once and reused across every post. --------
let kitPromise: Promise<{ CanvasKit: CanvasKit; fontMgr: FontMgr }> | undefined;

function initKit() {
  if (!kitPromise) {
    kitPromise = (async () => {
      // Resolve via node's module resolution so it survives Astro bundling the
      // endpoint into dist/ (import.meta.url would point at the output chunk).
      const wasmPath = createRequire(import.meta.url).resolve("canvaskit-wasm/bin/canvaskit.wasm");
      const CanvasKit = await CanvasKitInit({
        locateFile: () => wasmPath,
        // Feed the .wasm bytes directly — Emscripten's default fetch() path is
        // unreliable under Node. Not in the published type, hence the cast.
        wasmBinary: new Uint8Array(await readFile(wasmPath)),
      } as Parameters<typeof CanvasKitInit>[0]);
      const toArrayBuffer = (b: Buffer): ArrayBuffer =>
        b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
      // Fonts live in the project source; resolve from the build's cwd (the site
      // package root during `astro build`).
      const [bold, regular] = await Promise.all([
        readFile(resolve(process.cwd(), "src/fonts/inter-700.ttf")),
        readFile(resolve(process.cwd(), "src/fonts/inter-400.ttf")),
      ]);
      const fontMgr = CanvasKit.FontMgr.FromData(toArrayBuffer(bold), toArrayBuffer(regular));
      if (!fontMgr) throw new Error("Failed to load Inter fonts");
      return { CanvasKit, fontMgr };
    })();
  }
  return kitPromise;
}

export async function renderCard(opts: CardOptions): Promise<Buffer> {
  const { CanvasKit, fontMgr } = await initKit();
  const color4f = (rgb: RGB, a = 1) =>
    CanvasKit.Color4f(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, a);

  const surface = CanvasKit.MakeSurface(WIDTH, HEIGHT)!;
  const canvas = surface.getCanvas();

  if (opts.heroPath) {
    await paintHeroBackground(CanvasKit, canvas, opts.heroPath);
  } else {
    paintGradientBackground(CanvasKit, canvas, color4f);
  }

  // Brand lockup: the vector mark + the wordmark laid out beside it, anchored at
  // the given top y. Returns the mark height so callers can stack relative to it.
  const drawLockup = (topY: number) => {
    const markH = 52;
    const markW = markH * (LOGO_VIEWBOX.w / LOGO_VIEWBOX.h);
    // Mark.
    const path = CanvasKit.Path.MakeFromSVGString(LOGO_PATH)!;
    path.setFillType(CanvasKit.FillType.EvenOdd);
    const paint = new CanvasKit.Paint();
    paint.setColor(color4f(ACCENT));
    paint.setAntiAlias(true);
    canvas.save();
    canvas.translate(PAD, topY);
    canvas.scale(markH / LOGO_VIEWBOX.h, markH / LOGO_VIEWBOX.h);
    canvas.drawPath(path, paint);
    canvas.restore();
    path.delete();
    paint.delete();
    // Wordmark, vertically centred against the mark.
    const wm = makeParagraph(CanvasKit, fontMgr, WORDMARK, {
      fontSize: 34,
      weight: CanvasKit.FontWeight.Bold,
      color: color4f(TITLE_COLOR),
      maxWidth: WIDTH,
    });
    canvas.drawParagraph(wm, PAD + markW + 22, topY + (markH - wm.getHeight()) / 2);
    wm.delete();
    return markH;
  };

  const maxTextW = WIDTH - PAD * 2;

  if (opts.heroPath) {
    // Variant B: title + lockup anchored to the bottom, over the scrim.
    const title = makeParagraph(CanvasKit, fontMgr, opts.title, {
      fontSize: 60,
      weight: CanvasKit.FontWeight.Bold,
      color: color4f(TITLE_COLOR),
      maxWidth: maxTextW,
      maxLines: 3,
      lineHeight: 1.1,
    });
    const titleY = HEIGHT - PAD - title.getHeight();
    // Lockup sits a row above the title.
    drawLockup(titleY - 52 - 28);
    canvas.drawParagraph(title, PAD, titleY);
    title.delete();
  } else {
    // Variant A: lockup at top, title (+ optional description) bottom-anchored.
    drawLockup(PAD);

    const parts: Paragraph[] = [];
    const title = makeParagraph(CanvasKit, fontMgr, opts.title, {
      fontSize: 66,
      weight: CanvasKit.FontWeight.Bold,
      color: color4f(TITLE_COLOR),
      maxWidth: maxTextW,
      maxLines: 3,
      lineHeight: 1.1,
    });
    parts.push(title);
    let desc: Paragraph | undefined;
    if (opts.description) {
      desc = makeParagraph(CanvasKit, fontMgr, opts.description, {
        fontSize: 32,
        weight: CanvasKit.FontWeight.Normal,
        color: color4f(MUTED_COLOR),
        maxWidth: maxTextW,
        maxLines: 2,
        lineHeight: 1.3,
      });
      parts.push(desc);
    }
    const gap = 24;
    const totalH = parts.reduce((h, p) => h + p.getHeight(), 0) + (desc ? gap : 0);
    let y = HEIGHT - PAD - totalH;
    canvas.drawParagraph(title, PAD, y);
    if (desc) {
      y += title.getHeight() + gap;
      canvas.drawParagraph(desc, PAD, y);
    }
    parts.forEach((p) => p.delete());

    // Accent edge stripe (brand cue; Variant A only).
    const stripe = new CanvasKit.Paint();
    stripe.setColor(color4f(ACCENT));
    canvas.drawRect(CanvasKit.LTRBRect(0, 0, 12, HEIGHT), stripe);
    stripe.delete();
  }

  surface.flush();
  const img = surface.makeImageSnapshot();
  const png = img.encodeToBytes(CanvasKit.ImageFormat.PNG, 100);
  if (!png) throw new Error("Failed to encode OG PNG");
  const buf = Buffer.from(png);
  img.delete();
  surface.delete();
  return buf;
}

// --- helpers -----------------------------------------------------------------

function paintGradientBackground(
  CanvasKit: CanvasKit,
  canvas: Canvas,
  color4f: (rgb: RGB, a?: number) => Float32Array,
) {
  const paint = new CanvasKit.Paint();
  paint.setShader(
    CanvasKit.Shader.MakeLinearGradient(
      [0, 0],
      [0, HEIGHT],
      [color4f(BG_TOP), color4f(BG_BOTTOM)],
      [0, 1],
      CanvasKit.TileMode.Clamp,
    ),
  );
  canvas.drawRect(CanvasKit.LTRBRect(0, 0, WIDTH, HEIGHT), paint);
  paint.delete();
}

async function paintHeroBackground(CanvasKit: CanvasKit, canvas: Canvas, heroPath: string) {
  const bytes = await readFile(heroPath);
  const img = CanvasKit.MakeImageFromEncoded(bytes);
  if (!img) throw new Error(`Failed to decode hero image (use PNG, JPEG, or WebP): ${heroPath}`);
  const iw = img.width();
  const ih = img.height();

  // cover-fit: crop the source to the card's 1200×630 aspect, centred.
  const targetAspect = WIDTH / HEIGHT;
  const imgAspect = iw / ih;
  let sx = 0,
    sy = 0,
    sw = iw,
    sh = ih;
  if (imgAspect > targetAspect) {
    sw = ih * targetAspect;
    sx = (iw - sw) / 2;
  } else {
    sh = iw / targetAspect;
    sy = (ih - sh) / 2;
  }
  const paint = new CanvasKit.Paint();
  paint.setAntiAlias(true);
  canvas.drawImageRect(
    img,
    CanvasKit.LTRBRect(sx, sy, sx + sw, sy + sh),
    CanvasKit.LTRBRect(0, 0, WIDTH, HEIGHT),
    paint,
  );
  img.delete();

  // Bottom scrim so text stays legible over any photo.
  const scrim = new CanvasKit.Paint();
  const scrimTop = HEIGHT * 0.5;
  scrim.setShader(
    CanvasKit.Shader.MakeLinearGradient(
      [0, scrimTop],
      [0, HEIGHT],
      [CanvasKit.Color4f(0, 0, 0, 0), CanvasKit.Color4f(0, 0, 0, 0.82)],
      [0, 1],
      CanvasKit.TileMode.Clamp,
    ),
  );
  canvas.drawRect(CanvasKit.LTRBRect(0, scrimTop, WIDTH, HEIGHT), scrim);
  scrim.delete();
  paint.delete();
}

function makeParagraph(
  CanvasKit: CanvasKit,
  fontMgr: FontMgr,
  text: string,
  opts: {
    fontSize: number;
    weight: { value: number };
    color: Float32Array;
    maxWidth: number;
    maxLines?: number;
    lineHeight?: number;
  },
): Paragraph {
  const style = new CanvasKit.ParagraphStyle({
    textStyle: {
      color: opts.color,
      fontFamilies: ["Inter"],
      fontSize: opts.fontSize,
      fontStyle: { weight: opts.weight },
      heightMultiplier: opts.lineHeight,
    },
    textAlign: CanvasKit.TextAlign.Left,
    maxLines: opts.maxLines,
    ellipsis: opts.maxLines ? "…" : undefined,
  });
  const builder = CanvasKit.ParagraphBuilder.Make(style, fontMgr);
  builder.addText(text);
  const para = builder.build();
  para.layout(opts.maxWidth);
  builder.delete();
  return para;
}
