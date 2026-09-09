// Creator mode: the user types a topic, and this module:
//   1. Asks Claude to write a storyboard (narration + image prompt per scene)
//   2. Renders each narration line to a voiceover via ElevenLabs
//   3. Generates an image per scene via fal.ai
//   4. Assembles everything into a Project and writes public/project.json
//
// Work runs as a background job so the UI can poll for progress.

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { fal } from "@fal-ai/client";
import { defaultProject } from "../src/project/defaultProject";
import type { ImageScene, Project, Scene, TextScene, TextEffectKey } from "../src/project/types";

// ---------------------------------------------------------------------------

export type CreateStep = { label: string; done: boolean };

export type CreateJob = {
  id: string;
  topic: string;
  status: "running" | "done" | "error";
  steps: CreateStep[];
  log: string[];
  result?: Project;
  error?: string;
  createdAt: number;
};

export const createJobs = new Map<string, CreateJob>();

export type CreateFormat = "images" | "text" | "animated" | "mix";

/** AI image services supported for generated stills. "typography" renders the
 *  scene as a typographic poster (text + a rotating font) — no AI, no key. */
export type ImageProvider = "fal" | "pollinations" | "typography";

// Distinct system font stacks for typographic posters — no downloads, so every
// font always renders. Rotated per scene for variety.
const FONT_STACKS = [
  "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
  "Georgia, 'Times New Roman', serif",
  "'Courier New', Courier, monospace",
  "'Franklin Gothic Medium', 'Arial Narrow', sans-serif",
  "'Palatino Linotype', 'Book Antiqua', 'URW Palladio L', serif",
  "'Trebuchet MS', 'Segoe UI', sans-serif",
  "'Arial Black', Gadget, sans-serif",
  "'Comic Sans MS', 'Chalkboard SE', cursive",
];
const posterFont = (i: number, isTypo: boolean): string | undefined =>
  isTypo ? FONT_STACKS[i % FONT_STACKS.length] : undefined;

const escXml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Deterministic hash so the same prompt always picks the same font/colors. */
const hashOf = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/**
 * Builds a typographic poster as an SVG string — the "image" is pure text set
 * in one of the rotated fonts. No AI, no key, works offline.
 */
export const renderTypographySvg = (
  prompt: string,
  width: number,
  height: number,
): { svg: string; font: string } => {
  const clean = prompt.replace(/[\s]+/g, " ").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const h = hashOf(clean || "poster");
  const font = FONT_STACKS[h % FONT_STACKS.length];
  const bg = ["#0b1021", "#16245b", "#3d1a5e", "#0f3443", "#1e3a2f", "#5a1638"][h % 6];
  const glow = ["#FF0063", "#ffd23f", "#00e5ff", "#7CFC00", "#ff8c42", "#ff3d9a"][h % 6];

  // Wrap the words into lines that never overflow the width.
  const fontSize = Math.max(20, Math.round(Math.min(height * 0.16, (width * 0.9) / 12)));
  const maxChars = Math.max(2, Math.floor((width * 0.86) / (fontSize * 0.6)));
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars && cur) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = `${cur} ${w}`.trim();
    }
  }
  if (cur) lines.push(cur.trim());
  const rendered = lines.slice(0, 4).join("\n");
  const lineCount = Math.min(4, lines.length);
  const lineGap = fontSize * 1.02;
  const blockH = lineCount * lineGap;
  const startY = (height - blockH) / 2 + lineGap / 2;

  const textLines = rendered
    .split("\n")
    .map(
      (ln, i) =>
        `<text x="50%" y="${(startY + i * lineGap).toFixed(1)}" text-anchor="middle" dominant-baseline="central" ` +
        `font-family="${escXml(font)}" font-size="${fontSize}" font-weight="800" ` +
        `fill="#ffffff" letter-spacing="1">${ln === "" ? " " : escXml(ln)}</text>`,
    )
    .join("\n  ");

  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}"/><stop offset="100%" stop-color="#05070e"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <circle cx="12%" cy="18%" r="${Math.round(height * 0.28)}" fill="${glow}" opacity="0.16"/>
  <circle cx="90%" cy="86%" r="${Math.round(height * 0.34)}" fill="${glow}" opacity="0.12"/>
  <rect x="6%" y="6%" width="${Math.round(width * 0.88)}" height="${Math.round(height * 0.88)}" fill="none" stroke="${glow}" stroke-width="3" opacity="0.35" rx="18"/>
  ${textLines}
  <rect x="50%" y="${(height - 30).toFixed(0)}" width="220" height="4" fill="${glow}" transform="translate(-110 0)" opacity="0.85" rx="2"/>
</svg>`,
    font,
  };
};

export type CreateOptions = {
  topic: string;
  title: string;
  style: string;
  numScenes?: number;
  /** Desired total video length in seconds. When set, scene count and narration length are tuned to land near it. */
  targetDuration?: number;
  /** Optional output resolution (e.g. { width: 1080, height: 1920 }). Defaults to 1280x720. */
  width?: number;
  height?: number;
  /** How the visuals are built: fal.ai images, text cards, animated text, or a mix. */
  format: CreateFormat;
  /** The fal.ai image model id, e.g. "fal-ai/fast-sdxl". Empty = default. */
  imageModel?: string;
  /**
   * Which AI image service generates the scene stills.
   * "fal": fal.ai (needs FAL_KEY, best quality). "pollinations": Pollinations.ai
   * (free, no key). Defaults to fal when a key is present, else pollinations.
   */
  imageProvider?: ImageProvider;
  /**
   * Uploaded images (paths relative to public/) the user wants mixed into the
   * generated video, in the order they appear. They replace generated stills
   * scene-by-scene to fill as many as possible.
   */
  uploadedImages?: string[];
  anthropicKey: string;
  anthropicModel?: string;
  falKey?: string;
  elevenKey?: string;
  voiceId?: string;
  readProject: () => Project;
  writeProject: (p: Project) => void;
};

// ---------------------------------------------------------------------------

const generatedDir = join(process.cwd(), "public", "uploads", "generated");
mkdirSync(generatedDir, { recursive: true });

let idCounter = 0;
export const newJobId = () =>
  `job-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Rough spoken length: ~12.5 chars/second. */
const estimateSeconds = (text: string): number => {
  const chars = text.replace(/\s+/g, " ").trim().length;
  return Math.min(60, Math.max(1.5, Math.ceil(chars / 12.5) + 0.5));
};

/** Longest a single scene may run when squeezing to a target length. */
const BudgetMaxDuration = (scene: Scene): number =>
  scene.audioSrc ? Math.max(2, scene.durationInSeconds) : 2.5;

const saveUrl = async (url: string, filePath: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status} ${res.statusText})`);
  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(join(filePath, ".."), { recursive: true });
  writeFileSync(filePath, buf);
};

// ---------------------------------------------------------------------------
// 1. Storyboard --------------------------------------------------------------

type StoryKineticEffect =
  | "slide"
  | "wordpop"
  | "rotate3d"
  | "spin"
  | "char"
  | "zoomcut"
  | "colorcycle"
  | "zoom"
  | "multi"
  | "shake"
  | TextEffectKey;

type StoryKineticWord = {
  text: string;
  x: number; // 0..1 horizontal center
  y: number; // 0..1 vertical center
  size: number; // fraction of frame height
  rotation: number; // degrees
  color: string; // hex
  dir: "left" | "right" | "up" | "down" | "zoom" | "pop";
  start: number; // start time in seconds (into the scene)
  dur: number; // entry duration in seconds
  order: number; // z-order (higher on top)
  /** Creative motion style the LLM picks for this word. */
  effect?: StoryKineticEffect;
};

type StoryScene = {
  narration: string;
  imagePrompt: string;
  caption: string;
  /** A hex background color that fits this scene's mood/topic (for text cards). */
  background?: string;
  /**
   * For kinetic text scenes the LLM decides the exact words to show and how
   * each one animates. Empty string = scene is an image card instead.
   */
  kineticText?: string;
  /** LLM-decided per-word layout/animation for kinetic scenes. */
  kineticWords?: StoryKineticWord[];
  /** Small tagline/strapline shown at the bottom (e.g. "MAKE YOUR MESSAGE MATTER."). */
  tagline?: string;
  /** One sentence describing the intended screen + animation (handed to the code writer). */
  design?: string;
};

const parseStoryboard = (text: string): StoryScene[] | null => {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fence ? fence[1] : text).trim();
  const tryParse = (s: string): StoryScene[] | null => {
    try {
      const arr = JSON.parse(s);
      if (!Array.isArray(arr)) return null;
      return arr
        .filter((x) => x && typeof x === "object")
        .map((x) => {
          const words = Array.isArray(x.kineticWords)
            ? (x.kineticWords as unknown[])
                .filter((w) => w && typeof w === "object")
                .map((w) => {
                  const o = w as Record<string, unknown>;
                  const dir = String(o.dir ?? "pop");
                  const effect = String(o.effect ?? "slide").toLowerCase();
                  const effects: StoryKineticEffect[] = [
                    "slide",
                    "wordpop",
                    "rotate3d",
                    "spin",
                    "char",
                    "zoomcut",
                    "colorcycle",
                  ];
                  return {
                    text: String(o.text ?? "").trim(),
                    x: clamp0to1(Number(o.x)),
                    y: clamp0to1(Number(o.y)),
                    size: Math.max(0.06, Math.min(0.6, Number(o.size) || 0.25)),
                    rotation: Number(o.rotation) || 0,
                    color: typeof o.color === "string" ? o.color : "#ffffff",
                    dir: ["left", "right", "up", "down", "zoom", "pop"].includes(dir) ? (dir as StoryKineticWord["dir"]) : "pop",
                    start: Math.max(0, Number(o.start) || 0),
                    dur: Math.max(0.1, Number(o.dur) || 0.6),
                    order: Number(o.order) || 0,
                    ...(effects.includes(effect as StoryKineticEffect) ? { effect: effect as StoryKineticEffect } : {}),
                  };
                })
                .filter((w) => !!w.text)
            : undefined;
          return {
            narration: String((x as Record<string, unknown>).narration ?? "").trim(),
            imagePrompt: String((x as Record<string, unknown>).imagePrompt ?? "").trim(),
            caption: String((x as Record<string, unknown>).caption ?? "").trim(),
            background:
              typeof (x as Record<string, unknown>).background === "string" &&
              /^#[0-9a-fA-F]{6}$/.test(String((x as Record<string, unknown>).background).trim())
                ? String((x as Record<string, unknown>).background).trim()
                : undefined,
            kineticText: String((x as Record<string, unknown>).kineticText ?? "").trim() || undefined,
            kineticWords: words,
            tagline: String((x as Record<string, unknown>).tagline ?? "").trim() || undefined,
            design: String((x as Record<string, unknown>).design ?? "").trim() || undefined,
          };
        })
        .filter((x) => x.kineticText || x.kineticWords?.length || (x.narration && x.imagePrompt));
    } catch {
      return null;
    }
  };
  const direct = tryParse(raw);
  if (direct) return direct;
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start >= 0 && end > start) return tryParse(raw.slice(start, end + 1));
  return null;
};

const clamp0to1 = (n: number): number => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0.5);

const generateStoryboard = async (
  client: Anthropic,
  model: string,
  topic: string,
  style: string,
  numScenes?: number,
  targetSeconds?: number,
): Promise<StoryScene[]> => {
  const styleLine = style && style !== "auto" ? `Art direction: ${style}. ` : "";
  // Tune how wordy each narration is so the whole video stays close to the target.
  const lengthLine =
    targetSeconds && targetSeconds >= 5
      ? `Keep the ENTIRE video around ${targetSeconds} seconds. Write each narration as ONE very short phrase of about ${Math.max(
          2,
          Math.round((targetSeconds / (numScenes ?? 5)) * 1.5),
        )} words — do not ramble.`
      : "Keep each narration to one or two spoken sentences (25-45 words).";
  const resp = await client.messages.create({
    model,
    max_tokens: 8000,
    system:
      "You are a hyper-creative TitleFX motion designer / edit director that turns a user's brief into a scene-by-scene spec. " +
      "You MUST honor the user's own text and animation instructions — never replace or invent " +
      "different words unless the brief is empty.\n\n" +
      "Respond with ONLY a JSON array (no prose, no code fences). Each element is ONE visual moment/scene with these keys:\n" +
      '- "caption": a short label for this scene (2-5 words).\n' +
      '- "narration": spoken words for the voice-over (one short phrase).\n' +
      '- "imagePrompt": a detailed English text-to-image prompt for THIS scene (used only if the video uses images).\n' +
      '- "background": a hex color fitting the scene/mood.\n' +
      // kinetic text
      '- "kineticText": the exact words to show big in THIS moment (for typography-only videos). Use the user\'s words verbatim.\n' +
      '- "kineticWords": array describing how each word of kineticText appears:\n' +
      '   { "text": string, "x": 0..1 center, "y": 0..1 center, "size": fraction of frame height (0.2-0.45), "rotation": degrees, "color": hex, "dir": "left"|"right"|"up"|"down"|"zoom"|"pop", "start": seconds into the scene, "dur": seconds to enter, "order": z-index int, "effect": one of the effect names in EFFECTS LIBRARY below (EVERY single one is valid and fully animated) }\n' +
      '- "design": ONE vivid sentence describing the exact screen + ANIMATION this scene should have, written for a motion designer to implement in code. Be specific about MOTION, not just the text: direction of entry, speed/energy, rotation, scale, timing (e.g. "the word SLAMS in from the far right with a springy bounce, lands rotated 6°, oversized bold white on the brand background").\n' +
      '- "tagline": optional small strapline shown at the bottom (e.g. "MAKE YOUR MESSAGE MATTER.").\n\n' +
      "EFFECTS LIBRARY — every value below is implemented & animated, pick the most exciting for each word and VARY them:\n" +
      '- legacy: "slide"|"wordpop"|"rotate3d"|"spin"|"char"|"zoomcut"|"colorcycle"|"zoom"|"multi"|"shake".\n' +
      "- 40-pattern CSS library (identical names to text-animation-library.css):\n" +
      '01 "explosive" letter burst rings · 02 "dancingShadow" two-color dancing shadow · 03 "melt" dripping liquid · 04 "matrix" green glitch rain · 05 "textMask" moving gradient · 06 "spin3d" continuous 3D spin · 07 "glitch" colored clipped glitch · 08 "neon" neon pulse glow · 09 "wavy" per-letter wave · 10 "split" halves slide from left/right ·\n' +
      '11 "glow3d" wobble + glow · 12 "heartbeat" pumping heartbeat · 13 "marquee3d" 3D marquee sweep · 14 "nabla" extrusion depth · 15 "cylinder" rotateX cylinder · 16 "rollBg" roll-in gradient · 17 "gooey" blur marquee · 18 "ghost" blending ghost glide · 19 "schitts" pop + sparkle · 20 "frame" bordered frame wiggle ·\n' +
      '21 "typewriter" typed reveal + caret · 22 "typing" typewriter loop · 23 "gradientTyping" gradient typewriter · 24 "editor" terminal code typing · 25 "typingBg" typing with moving bg · 26 "hoverUnderline" sweeping underline · 27 "linkSplit" split highlight · 28 "barReveal" two-layer reveal · 29 "halvesSplit" halves into the air · 30 "fontPulse" weight pulse ·\n' +
      '31 "aurora" aurora gradient · 32 "cityLights" city neon pulse · 33 "paintReveal" paint sweep · 34 "hologram" holographic shimmer · 35 "spotlight" rainbow spotlight sweep · 36 "breathe" weight breathing · 37 "fontTransition" thin-to-heavy · 38 "curved" letters on an arc · 39 "worklife" opposing weight swap · 40 "drawIn" layered draw-in.\n' +
      '41 "vibrate" violent electric jitter · 42 "rattle" nervous shaking · 43 "error" corrupted-text glitch · 44 "blurpop" blur-in snap · 45 "fillSweep" color band endlessly filling the text · 46 "wipeFill" marker-style fill sweep · 47 "drawOn" outline draws then fills · 48 "stackDrop" letters drop and stack in.\n\n' +
      "Rules:\n" +
      "- Be SUPER creative: vary the effect from scene to scene, don't repeat the same effect twice in a row, match the effect to the word's meaning (e.g. SHARP -> \"zoomcut\" or \"slide\", BOLD. -> \"zoomcut\", FEARLESS -> \"rotate3d\", D2 -> \"colorcycle\").\n" +
      "- If the brief is a typography / brand-reel prompt with a word sequence and timing (e.g. 0-2s \"BOLD.\", 2-4s \"DIFFERENT.\"), output ONE scene per word, place each word oversize, rotated and clearly separated. NEVER let one word sit on top of another word — overlapping text is only allowed when the user's brief EXPLICITLY asks for stacked/overlapping words.\n" +
      "- Only add kineticText/kineticWords when the brief asks for typography; otherwise leave them out.\n" +
      "- Keep backgrounds consistent per the brief (e.g. one dominant brand color).\n" +
      `Narration length: ${lengthLine}\n` +
      (numScenes
        ? `Produce EXACTLY ${numScenes} moments — no more, no fewer.`
        : `Choose how many moments this brief deserves (2-8). Short briefs / ~10s targets: 3-6 tight moments. Long reels: 6-8. Never pad — every moment must add real visual value.`),
    messages: [
      {
        role: "user",
        content: `Make a ${styleLine}video from this brief:\n\n${topic}`,
      },
    ],
  });
  const text = resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  const scenes = parseStoryboard(text);
  if (!scenes || scenes.length === 0) {
    throw new Error("Could not parse the storyboard from Claude's response.");
  }
  return scenes.slice(0, 8);
};

// ---------------------------------------------------------------------------
// 1b. Animation code generation (STEP 2 of the per-prompt pipeline)
// ---------------------------------------------------------------------------

// The generated file's canonical props contract. Must match
// src/generated/CustomScenes.tsx and what GeneratedVideo passes.
const CUSTOM_SCENE_TYPE = `export type CustomSceneProps = {
  scene: {
    caption: string;
    narration: string;
    background: string;
    color: string;
    accent: string;
    tagline?: string;
    design: string;
    words: string[];
  };
};`;

const CODE_FILE = join(process.cwd(), "src", "generated", "CustomScenes.tsx");

const REMOTION_API = [
  "AbsoluteFill",
  "Sequence",
  "useCurrentFrame",
  "useVideoConfig",
  "interpolate",
  "Easing",
  "spring",
] as const;
const REACT_TYPE_NAMES = ["CSSProperties", "FC"] as const;
const EFFECT_SYMBOLS = ["WordFX", "TEXT_EFFECT_KEYS", "TEXT_EFFECT_LIBRARY"] as const;

const renderImports = (body: string): string => {
  const usedRemotion = REMOTION_API.filter((name) => new RegExp(`\\b${name}\\b`).test(body));
  const usedReact = REACT_TYPE_NAMES.filter((name) => new RegExp(`\\b${name}\\b`).test(body));
  const usedEffects = EFFECT_SYMBOLS.filter((name) => new RegExp(`\\b${name}\\b`).test(body));
  const lines: string[] = [];
  if (usedRemotion.length > 0) lines.push(`import { ${usedRemotion.join(", ")} } from "remotion";`);
  if (usedEffects.length > 0) lines.push(`import { ${usedEffects.join(", ")} } from "../GeneratedVideo/effects/TextEffects";`);
  if (usedReact.length > 0) lines.push(`import type { ${usedReact.join(", ")} } from "react";`);
  return lines.join("\n");
};

export const typecheckProject = (): Promise<string | null> =>
  new Promise((resolve, reject) => {
    const child = spawn(
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["tsc", "--noEmit"],
      { cwd: process.cwd(), shell: process.platform === "win32" },
    );
    let out = "";
    child.stdout.on("data", (d: Buffer) => (out += d.toString()));
    child.stderr.on("data", (d: Buffer) => (out += d.toString()));
    child.on("error", reject);
    child.on("close", (code) => resolve(code === 0 ? null : out.slice(-1200) || "typecheck failed"));
  });

const writeCodeFile = (code: string): void => {
  mkdirSync(join(process.cwd(), "src", "generated"), { recursive: true });
  writeFileSync(CODE_FILE, code, "utf8");
};

const readCodeFile = (): string =>
  existsSync(CODE_FILE) ? readFileSync(CODE_FILE, "utf8") : "";

const STUB_FALLBACK = `/* eslint-disable */
/* No animation code yet — generate a Text / Animated text video in Creator mode. */
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { FC } from "react";

${CUSTOM_SCENE_TYPE}

export const CustomScenes: FC<CustomSceneProps>[] = [];
`;

const extractCodeFence = (text: string): string | null => {
  const fence = text.match(/```(?:tsx|ts|typescript)?\s*([\s\S]*?)```/);
  if (fence && fence[1].trim()) return fence[1].trim();
  const trimmed = text.trim();
  return trimmed.startsWith("export const Scene0") ? trimmed : null;
};

const codeIsSafe = (body: string): string | null => {
  if (!body.includes("CustomScenes")) return "missing `export const CustomScenes`";
  if (!body.includes("CustomSceneProps")) return "missing CustomSceneProps reference";
  if (/\bimport\b/.test(body)) return "the code must not contain its own import statements";
  for (const bad of ["Math.random", "useState", "useEffect", "document.", "window.", "localStorage"]) {
    if (body.includes(bad)) return `forbidden API/symbol: ${bad}`;
  }
  return null;
};

/**
 * STEP 2: ask the LLM to write the actual animation code for every scene
 * decided in STEP 1, then write src/generated/CustomScenes.tsx. Returns true
 * when the written code type-checks; on failure the previous file is restored.
 */
export const writeGeneratedScenes = async (
  client: Anthropic,
  model: string,
  story: StoryScene[],
  opts: { fps: number; width: number; height: number },
): Promise<boolean> => {
  const scenes = story.map((s, i) => ({
    index: i,
    caption: s.caption,
    narration: s.narration,
    background: s.background ?? "#0b1021",
    color: s.kineticWords?.[0]?.color ?? "#ffffff",
    accent:
      s.kineticWords && s.kineticWords.length > 1 && s.kineticWords[1]?.color
        ? s.kineticWords[1].color
        : "#FF0063",
    tagline: s.tagline,
    design:
      s.design ||
      `Show "${s.kineticText || s.caption}" in a striking kinetic-typography moment on ${s.background ?? "a solid brand background"}.`,
    words:
      s.kineticWords && s.kineticWords.length > 0
        ? s.kineticWords.map((w) => w.text)
        : (s.kineticText || s.caption).split(/\s+/).filter(Boolean),
  }));

  const system =
    "You are a senior Remotion / keyframe-motion engineer. You write the animation CODE " +
    "that brings a director's scene designs to life. The code must be deterministic (pure " +
    "functions of useCurrentFrame() and useVideoConfig()), safe, and look GREAT.\n\n" +
    "CONTRACT — write EXACTLY this structure, nothing more:\n" +
    "  export const Scene0: FC<CustomSceneProps> = ({ scene }) => { ... };\n" +
    "  ...one such component per scene, in order...\n" +
    "  export const CustomScenes: FC<CustomSceneProps>[] = [Scene0, Scene1, ...];\n" +
    "Do NOT write any import statements, do NOT redefine CustomSceneProps — both are supplied for you.\n\n" +
    "AVAILABLE API (imported for you — you may use any of these):\n" +
    '  remotion: AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing, spring\n' +
    '  react (type only): CSSProperties, FC\n' +
    '  SIGNATURE EFFECTS LIBRARY (the star of the show — STRONGLY PREFERRED):\n' +
    '    WordFX — a ready-made, frame-driven animation component. It replicates the 40 patterns of the text-animation-library.css. Usage: <WordFX text={w} fontSize={n} color={c} accent={c2} effect="glitch" />. Deterministic, safe, always fits, always looks professional. Wrap it in a positioned div for placement:\n' +
    '      <div style={{ position: "absolute", left: "50%", top: `${18 + i * 18}%`, transform: "translateX(-50%)" }}>\n' +
    "        <WordFX text={w} fontSize={sizeFor(w)} color={scene.color} accent={scene.accent} effect={EFFECTS[i % EFFECTS.length]} />\n" +
    "      </div>\n" +
    '    TEXT_EFFECT_KEYS — array of every valid effect name; TEXT_EFFECT_LIBRARY — same list with `label` + `group` (pick DIFFERENT effects per word scene by group).\n' +
    "    The 48 effect names (the 40 identical to the CSS file, plus 8 vibration/fill extras): explosive, dancingShadow, melt, matrix, textMask, spin3d, glitch, neon, wavy, split, glow3d, heartbeat, marquee3d, nabla, cylinder, rollBg, gooey, ghost, schitts, frame, typewriter, typing, gradientTyping, editor, typingBg, hoverUnderline, linkSplit, barReveal, halvesSplit, fontPulse, aurora, cityLights, paintReveal, hologram, spotlight, breathe, fontTransition, curved, worklife, drawIn, vibrate, rattle, error, blurpop, fillSweep, wipeFill, drawOn, stackDrop.\n" +
    "Props give you: scene.caption, scene.narration, scene.background, scene.color, scene.accent, " +
    "scene.tagline, scene.design, scene.words (string[] — the words to animate).\n\n" +
    "RULES (breaking any of them fails the build):\n" +
    "- Pure animation only: all values derive from useCurrentFrame() (+ useVideoConfig for fps/width/height/durationInFrames).\n" +
    "- No useState/useEffect/Math.random/document/window — random timing flickers.\n" +
    "- Use interpolate(frame, [a,b], [x,y], { extrapolateLeft: \"clamp\", extrapolateRight: \"clamp\", easing: Easing.out(Easing.cubic) }).\n" +
    "- NEVER let text go outside the frame — this is the #1 priority. On PORTRAIT videos (width < height, e.g. 1080x1920) the width is the tight edge: size every word from the width, not the height. Use a helper like const sizeFor = (w: string) => Math.min(minDim * 0.14, (width * 0.8) / Math.max(1, w.length * 0.6)); and set fontSize: sizeFor(w).\n" +
    "- Horizontally CENTER every word: use left: \"50%\" with transform: \"translateX(-50%) ...\" (combine with translateY/rotate/scale). Never place words with left%/top% alone — a wide word at left:20% spills off screen on portrait. Keep vertical spots inside the frame: each word's top must be >= 8% of height and bottom <= 92% (stack words in non-overlapping bands that divide that 84% vertical range).\n" +
    "- NEVER overlap words/text — words may never collide with each other. When a scene has several words, lay them out in separate vertical bands that can't intersect, or show one word at a time. Overlapping is only allowed if the scene's \"design\" field explicitly says the user asked for stacked/overlapping words.\n" +
    "- Map over scene.words and vary each word deterministically by its index i (rotation, color, x/y, delay) so any word list looks composed.\n" +
    "- Example style (mimic this EXACTLY — data-driven, clean, one word element per word, safe on both landscape AND portrait, animated through the WordFX library):\n" +
    "  export const Scene0: FC<CustomSceneProps> = ({ scene }) => {\n" +
    "    const { width, height } = useVideoConfig();\n" +
    "    const minDim = Math.min(width, height);\n" +
    "    const sizeFor = (w: string) => Math.min(minDim * 0.14, (width * 0.8) / Math.max(1, w.length * 0.6));\n" +
    "    const fx = [\"glitch\", \"neon\", \"wavy\", \"melt\"];\n" +
    "    return (\n" +
    "      <AbsoluteFill style={{ backgroundColor: scene.background, overflow: \"hidden\" }}>\n" +
    "        {scene.words.map((w, i) => (\n" +
    "          <div key={w} style={{ position: \"absolute\", left: \"50%\", top: `${16 + i * 20}%`, transform: \"translateX(-50%)\" }}>\n" +
    "            <WordFX text={w} fontSize={sizeFor(w)} color={i % 2 === 0 ? scene.color : scene.accent} accent={scene.accent} effect={fx[i % fx.length]} />\n" +
    "          </div>\n" +
    "        ))}\n" +
    "      </AbsoluteFill>\n" +
    "    );\n" +
    "  };\n" +
    "- Follow each scene's \"design\" field faithfully (it is the director's EXACT intent for shape, motion, timing and colors).\n" +
    "- Make EVERY entrance huge and FAST: most of the travel happens in the first 25-35% of the entrance, then it settles. Add overshoot with 3 keyframes, e.g. interpolate(frame, [s, s + d, s + d + 8], [0, 1.15, 1], { extrapolateLeft: \"clamp\", extrapolateRight: \"clamp\" }).\n" +
    "- Combine 2+ motion dimensions per scene (translate + rotate, and/or scale + color change). Plain single fades are FORBIDDEN.\n" +
    "- Scale is your drama lever — let a word grow until it FILLS most of the screen (shockingly big), hold it giant for a beat, then settle or flip its color. A word that fills the whole frame and then changes color is the signature move. NEVER be timid.\n" +
    "- For the word animation itself, PREFER the WordFX library over hand-rolled code: it is the 40-pattern CSS library rendered deterministically and every effect is punchy. Give each word a DIFFERENT effect (cycle TEXT_EFFECT_KEYS by index, shuffle groups across scenes) — never the same effect twice in a row. Frame safety still belongs to you: position the WordFX wrapper with left:\"50%\" + translateX(-50%) and stack words in non-overlapping vertical bands inside 8%..92% height.\n" +
    "- Assign ONE dramatic, DIFFERENT recipe per scene — never repeat the same recipe twice in a row, never a boring fade. MOTION RECIPES:\n" +
    "   1. SCREEN-FILL ZOOM — the word grows to FULL SCREEN size over the entrance (e.g. scale 0.25 -> 1 where 1 = fontSize that fills the width), holds giant, then its color flips from scene.color to scene.accent.\n" +
    "   2. VERTICAL STACK SLAM — words appear one at a time, stacked vertically in separate non-overlapping bands, each slamming in from the side with rotation overshoot + a scale pop.\n" +
    "   3. SLAM — the word whips in from off-screen right/left (translate + rotate), lands slightly tilted with a 5% overshoot breathe.\n" +
    "   4. WAVE — the word's letters rise one-by-one in a wave (staggered delay + slight rotation each).\n" +
    "   5. 3D FLIP — perspective rotateY 120deg -> 0, scale 0.6 -> 1, soft glow behind the word.\n" +
    "   6. TUMBLE — the word does a 0-720 spin landing with a scale pop, or tumbles in place the whole scene.\n" +
    "   7. ZOOM PULSE — the word breathes: scales up past the frame, settles, then slowly zooms in/out again (camera feel).\n" +
    "   8. MULTIPLY — several copies of the same word burst outward from it (spreading + fading), then collapse to one that holds.\n" +
    "   9. QUAKE — the word vibrates on the spot (small jagged translate keyframes) with a fast scale pop.\n" +
    "- Match the recipe to the word's meaning: SCREEN-FILL ZOOM for punchy one-word moments, VERTICAL STACK SLAM for lists/turning-points, SLAM for power words, TUMBLE for playful words.\n\n" +
    "Output ONLY a single fenced code block (```tsx ... ```) with the components.";

  const user =
    `DIMENSIONS: ${opts.width} x ${opts.height} at ${opts.fps}fps.` +
    (opts.width < opts.height
      ? " This is a PORTRAIT / vertical video (width is the tight edge) — every word MUST stay fully inside the frame width.\n\n"
      : " This is a landscape video.\n\n") +
    "SCENES TO IMPLEMENT (one component each, in order):\n" +
    scenes.map((s) => JSON.stringify(s)).join("\n");

  const resp = await client.messages.create({
    model,
    max_tokens: 8192,
    system,
    messages: [{ role: "user", content: user }],
  });
  const text = resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  const body = extractCodeFence(text);
  if (!body) {
    throw new Error("Code generation returned no code block.");
  }
  const unsafe = codeIsSafe(body);
  if (unsafe) {
    throw new Error(`Code generation rejected: ${unsafe}.`);
  }

  const before = readCodeFile();
  const imports = renderImports(body);
  const file = `${imports}\n\n${CUSTOM_SCENE_TYPE}\n\n${body}\n`;
  writeCodeFile(file);

  const tscError = await typecheckProject();
  if (tscError) {
    // Restore the previous file so the project stays green; creator falls back
    // to the built-in kinetic engine.
    try {
      writeCodeFile(before || STUB_FALLBACK);
    } catch {
      /* keep current file */
    }
    throw new Error(`Generated code failed typecheck:\n${tscError}`);
  }
  return true;
};

// ---------------------------------------------------------------------------
// 2. AI image generation (fal.ai and the free Pollinations.ai) ---------------

const generateFalImage = async (
  falKey: string | undefined,
  imageModel: string,
  prompt: string,
): Promise<string> => {
  fal.config({ credentials: falKey });
  const model = imageModel || "fal-ai/fast-sdxl";
  // Newlines / control characters can make fal reject a prompt (422).
  const clean = prompt.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();

  const attempts = [
    { prompt: clean.slice(0, 1000), image_size: "landscape_16_9", guidance_scale: 4, num_inference_steps: 30, num_images: 1 },
    { prompt: clean.slice(0, 1000), image_size: "landscape_16_9", num_images: 1 },
    { prompt: clean.slice(0, 1000), image_size: "landscape_16_9" },
    { prompt: clean.slice(0, 400) },
    { prompt: clean.slice(0, 200) },
  ];

  // Different fal endpoints return their image in slightly different shapes.
  // Dig out the first usable URL regardless of which box it lives in.
  const urlFromResult = (result: unknown): string | undefined => {
    const inspect = (node: unknown): string | undefined => {
      if (typeof node === "string") return node.startsWith("http") ? node : undefined;
      if (Array.isArray(node)) {
        for (const item of node) {
          const found = inspect(item);
          if (found) return found;
        }
        return undefined;
      }
      if (node && typeof node === "object") {
        const obj = node as Record<string, unknown>;
        for (const key of ["url", "src", "image_url"]) {
          if (typeof obj[key] === "string" && (obj[key] as string).startsWith("http")) {
            return obj[key] as string;
          }
        }
        for (const key of ["images", "image", "output", "result", "video", "data"]) {
          const found = inspect(obj[key]);
          if (found) return found;
        }
      }
      return undefined;
    };
    return inspect(result);
  };

  let url: string | undefined;
  let lastError: unknown;
  for (const input of attempts) {
    try {
      const result = await fal.subscribe(model, { input });
      url = urlFromResult(result.data ?? result);
      if (url) break;
      lastError = new Error("fal.ai returned no usable image.");
    } catch (err) {
      lastError = err;
    }
  }
  if (!url) throw lastError ?? new Error("fal.ai request failed.");
  return url;
};

/**
 * Pollinations.ai free image endpoint — no API key required, just a GET.
 * Retries a few times with different models/params before giving up.
 */
const generatePollinationsImage = async (prompt: string, width: number, height: number): Promise<string> => {
  const clean = prompt.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 800);
  const attempts = [
    { width, height, seed: Math.floor(Date.now() / 60000) % 100000, nologo: true, model: "flux" },
    { width, height, seed: Math.floor(Date.now() / 60000) % 100000, nologo: true },
    { width, height, seed: Math.floor(Date.now() / 60000) % 100000, nologo: true, model: "turbo" },
  ];
  let lastError: unknown;
  for (const att of attempts) {
    const q = new URLSearchParams(Object.entries(att).map(([k, v]) => [k, String(v)]));
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(clean)}?${q.toString()}`;
    try {
      const res = await fetch(url, { headers: { accept: "image/*" } });
      if (!res.ok) {
        lastError = new Error(`pollinations.ai returned ${res.status}`);
        continue;
      }
      return url;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("pollinations.ai failed to generate an image.");
};

export const generateImage = async (
  provider: ImageProvider,
  falKey: string | undefined,
  imageModel: string,
  prompt: string,
  filePath: string,
  width = 1280,
  height = 720,
): Promise<void> => {
  const url =
    provider === "pollinations"
      ? await generatePollinationsImage(prompt, width, height)
      : await generateFalImage(falKey, imageModel, prompt);
  await saveUrl(url, filePath);
};

// ---------------------------------------------------------------------------
// 3. ElevenLabs voiceover ----------------------------------------------------

const generateVoice = async (
  apiKey: string,
  voiceId: string,
  text: string,
  filePath: string,
): Promise<void> => {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.2,
          use_speaker_boost: false,
        },
      }),
    },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ElevenLabs ${res.status}: ${body.slice(0, 200)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(filePath, buf);
};

// ---------------------------------------------------------------------------
// 4. Run --------------------------------------------------------------------

export const runCreateJob = async (job: CreateJob, opts: CreateOptions): Promise<Project> => {
  const addStep = (label: string): CreateStep => {
    const step = { label, done: false };
    job.steps.push(step);
    job.log.push(label);
    return step;
  };
  const finish = (step: CreateStep) => {
    step.done = true;
  };

  try {
    // undefined numScenes = the LLM decides how many moments the brief deserves.
    const target = opts.targetDuration && opts.targetDuration >= 5 ? Math.round(opts.targetDuration) : undefined;
    const nHint =
      opts.numScenes && opts.numScenes >= 2 ? clamp(Math.round(opts.numScenes), 2, 8) : undefined;

    // --- step 1: script + storyboard ---
    const step0 = addStep("Designing the scenes & animations");
    const client = new Anthropic({ apiKey: opts.anthropicKey });
    const story = await generateStoryboard(
      client,
      opts.anthropicModel || "claude-sonnet-5",
      opts.topic,
      opts.style,
      nHint,
      target,
    );
    const n = story.length; // the LLM decides the real scene count
    finish(step0);

    // STEP 2: generate the actual animation code for typography videos. This is a
    // second LLM call per prompt — the "code writer" that makes the scenes unique.
    const step1b = addStep("Writing the animation code");
    let customScenes = false;
    if (opts.format === "text" || opts.format === "animated") {
      try {
        const codeFps = 30;
        customScenes = await writeGeneratedScenes(client, opts.anthropicModel || "claude-sonnet-5", story, {
          fps: codeFps,
          width: Math.round(clamp(opts.width || 1280, 2, 4096)),
          height: Math.round(clamp(opts.height || 720, 2, 4096)),
        });
        job.log.push("Animation code written — open it with the Open in editor button.");
      } catch (err) {
        job.log.push(`Code generation fell back to built-in animation: ${String(err)}`);
      }
    }
    finish(step1b);

    const tag = job.id.replace(/[^a-z0-9]/gi, "").slice(0, 8);
    const scenes: Scene[] = [];
    const assets: Project["assets"] = [];
    const styleSuffix = "highly detailed, cinematic, consistent art direction";
    const format = opts.format || "images";

    // "typography" image source: no AI at all — each scene becomes a typographic
    // poster (text rendered with a different font). The image IS the typography.
    const isTypo = opts.imageProvider === "typography";
    if (isTypo) {
      job.log.push("Typography mode: building typographic posters with rotating fonts — no AI images.");
    }

    // Formats that never call an image provider: pure text cards / typographic
    // posters, unless the user supplied their own image (uploads are honored).
    const textOnly = isTypo || format === "text" || format === "animated";
    const mixMode = format === "mix";

    // True when this scene's visuals come from the image provider when no upload covers it.
    const needsImage = (i: number): boolean => {
      if (textOnly) return false;
      if (mixMode) return n >= 3 ? i > 0 && i < story.length - 1 : true;
      return true;
    };

    const FALLBACK_PALETTE = ["#0b1021", "#16245b", "#3d1a5e", "#0f3443", "#1e3a2f", "#5a1638"];
    const textVariant = (i: number): "classic" | "wordpop" => {
      if (format === "animated") return "wordpop";
      if (format === "mix") return i === 0 ? "classic" : "wordpop";
      return "classic";
    };

    // --- Prompt-driven behavior ---
    // Uploaded images to spread across scenes (images/mix formats).
    const uploadedImages = (opts.uploadedImages ?? []).filter((src) => !!src);
    // Only cycle background colors across a reused image when the user EXPLICITLY
    // asks for it (e.g. "5 background colors"). Otherwise build visuals purely
    // from the storyboard so the video follows the topic.
    const wantColorCycle =
      (textOnly || mixMode) &&
      /(background|bg|colour|color|colour|colors?|shades?)\s*(change|chang|cycl|different|vary|switch|rotate)/i.test(
        opts.topic,
      );
    const sharedImage =
      textOnly && uploadedImages.length > 0 ? uploadedImages[0] : undefined;
    let uploadedIdx = 0;

    for (let i = 0; i < story.length; i++) {
      const s = story[i];
      const fileStem = `${tag}-${i + 1}`;
      const sceneId = `create-${tag}-${i + 1}`;
      const duration = estimateSeconds(s.narration);
      const narrationSrc = `uploads/generated/voice-${fileStem}.mp3`;
      const falSlot = needsImage(i);

      let imageSrc: string | undefined;
      if (sharedImage && wantColorCycle) {
        // The user explicitly asked for a color cycle: reuse the same image everywhere.
        imageSrc = sharedImage;
      } else if (uploadedIdx < uploadedImages.length && (falSlot || textOnly || mixMode)) {
        // Spread uploaded images across scenes; they replace generated stills.
        imageSrc = uploadedImages[uploadedIdx++];
        job.log.push(`Scene ${i + 1}: using your uploaded image`);
      } else if (falSlot) {
        // fal.ai when a key is present / explicitly chosen, otherwise the free
        // Pollinations.ai endpoint (no key needed).
        const imageProvider: ImageProvider = opts.imageProvider ?? (opts.falKey ? "fal" : "pollinations");
        const stepImg = addStep(
          `Generating image ${i + 1}/${story.length} (${imageProvider === "pollinations" ? "free AI" : "fal.ai"})`,
        );
        const imgFile = join(process.cwd(), "public", `uploads/generated/img-${fileStem}.jpg`);
        try {
          job.log.push(`Scene ${i + 1}: generating image via ${imageProvider === "pollinations" ? "Pollinations.ai (free)" : "fal.ai"}`);
          await generateImage(
            imageProvider,
            opts.falKey ?? "",
            opts.imageModel ?? "fal-ai/fast-sdxl",
            `${s.imagePrompt}. ${styleSuffix}`,
            imgFile,
            opts.width ?? 1280,
            opts.height ?? 720,
          );
          imageSrc = `uploads/generated/img-${fileStem}.jpg`;
          assets.push({ name: `Scene ${i + 1} image`, src: imageSrc, kind: "image" });
        } catch (err) {
          const msg = String(err);
          job.log.push(
            /locked|balance|forbidden/i.test(msg)
              ? "fal.ai image generation failed — switch the Image source in Creator to 'Free' (Pollinations.ai) and try again."
              : `Image ${i + 1} failed (falling back to a title card): ${msg}`,
          );
        }
        finish(stepImg);
      }

      const stepAudio = addStep(`Recording voice-over ${i + 1}/${story.length}`);
      let voiceOk = false;
      try {
        await generateVoice(
          opts.elevenKey ?? "",
          opts.voiceId ?? "21m00Tcm4TlvDq8ikWAM",
          s.narration,
          join(process.cwd(), "public", narrationSrc),
        );
        voiceOk = true;
      } catch (err) {
        job.log.push(`Voice ${i + 1} failed: ${String(err)}`);
      }
      finish(stepAudio);

      const base = {
        id: sceneId,
        durationInSeconds: duration,
        overlays: [],
        audioSrc: voiceOk ? narrationSrc : undefined,
      };
      if (voiceOk) {
        assets.push({
          name: `Scene ${i + 1} narration`,
          src: narrationSrc,
          kind: "audio",
          durationInSeconds: duration,
        });
      }

      if (imageSrc) {
        scenes.push({
          ...base,
          type: "image",
          src: imageSrc,
          // In explicit color-cycle mode the reused image carries no text.
          caption: wantColorCycle && sharedImage ? "" : (s.caption || " "),
          kenBurns: true,
          variant: textVariant(i),
          // Color-cycle mode reuses the palette; otherwise the image just sits
          // on the storyboard-provided (topic-matched) background.
          background: wantColorCycle
            ? FALLBACK_PALETTE[i % FALLBACK_PALETTE.length]
            : (s.background ?? "#0b1021"),
        } satisfies ImageScene);
      } else if (customScenes) {
        // Typography scene driven by LLM-written code (src/generated/CustomScenes.tsx).
        const words = s.kineticWords?.map((w) => ({ ...w }));
        scenes.push({
          ...base,
          type: "text",
          prompt: s.kineticText ?? s.caption,
          subtitle: "",
          background: s.background ?? "#0b1021",
          color: words?.[0]?.color ?? "#ffffff",
          variant: "custom",
          customIndex: i,
          design: s.design,
          kineticWords: words && words.length > 0 ? words : undefined,
          tagline: s.tagline,
          fontFamily: posterFont(i, isTypo),
        } satisfies TextScene);
      } else if (s.kineticWords && s.kineticWords.length > 0) {
        // Typography scene: render the LLM-decided words with their layout/animation.
        const words = s.kineticWords.map((w) => ({ ...w }));
        scenes.push({
          ...base,
          type: "text",
          prompt: s.kineticText ?? s.caption,
          subtitle: "",
          background: s.background ?? "#0b1021",
          color: words[0]?.color ?? "#ffffff",
          variant: "kinetic",
          kineticWords: words,
          tagline: s.tagline,
          fontFamily: posterFont(i, isTypo),
        } satisfies TextScene);
      } else {
        const palette = s.background ?? FALLBACK_PALETTE[i % FALLBACK_PALETTE.length];
        scenes.push({
          ...base,
          type: "text",
          prompt: s.caption,
          subtitle: s.narration.slice(0, 200),
          background: palette,
          color: "#ffffff",
          variant: textVariant(i),
          fontFamily: posterFont(i, isTypo),
        });
      }
    }

    // If a target length was requested, squeeze the total to fit it so a short
    // clip (e.g. 10s over 5 scenes) can never drift longer.
    if (target && scenes.length > 0 && opts.targetDuration) {
      const total = scenes.reduce((sum, sc) => sum + sc.durationInSeconds, 0);
      const budget = target / scenes.length;
      if (total > target) {
        for (const sc of scenes) sc.durationInSeconds = clamp(budget, 1, BudgetMaxDuration(sc));
      }
    }

    const stepFinal = addStep("Assembling the video");
    const current = opts.readProject() ?? defaultProject;
    const w = Math.round(clamp(opts.width || 1280, 2, 4096));
    const h = Math.round(clamp(opts.height || 720, 2, 4096));
    const project: Project = {
      ...current,
      title: opts.title || opts.topic,
      fps: 30,
      width: w,
      height: h,
      transition: "fade",
      transitionDurationInSeconds: 0.5,
      assets: [...current.assets, ...assets],
      audio: null,
      scenes,
    };
    finish(stepFinal);

    opts.writeProject(project);
    job.status = "done";
    job.result = project;
    return project;
  } catch (err) {
    job.status = "error";
    job.error = err instanceof Error ? err.message : String(err);
    job.log.push(`Error: ${job.error}`);
    throw err;
  }
};