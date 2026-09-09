// Data model shared between the Builder UI, the Node server and the
// GeneratedVideo composition. The whole video is described by a single
// `Project` object that is persisted to `public/project.json`.

export type TransitionKind = "none" | "fade" | "slide" | "wipe";

export type OverlayPosition =
  | "top"
  | "center"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

/** A line of text laid ON TOP of a scene (over a video or image). */
export type TextOverlay = {
  id: string;
  text: string;
  position: OverlayPosition;
  /** When the overlay appears / disappears, in seconds relative to its scene. */
  startSeconds: number;
  endSeconds: number;
  fontSize: number;
  color: string;
  /** Optional pill background behind the text. "" = no background. */
  background: string;
};

type SceneBase = {
  /** Stable id, used as React key and for reordering. */
  id: string;
  /** How long the scene is on screen, in seconds. */
  durationInSeconds: number;
  /** Text laid over this scene. */
  overlays: TextOverlay[];
  /** Optional voiceover / narration audio played during this scene, relative to the public folder. */
  audioSrc?: string;
};

/** The style of motion a kinetic word uses. */
export type KineticEffect =
  | "slide" // slides in from dir
  | "wordpop" // pops in one word at a time
  | "rotate3d" // keeps flipping around the vertical axis
  | "spin" // keeps rolling (z-axis spin) on screen
  | "char" // reveals letter by letter
  | "zoomcut" // zooms in big then gets sliced away at the end
  | "colorcycle" // ghost copies of the word whose colors change one by one
  | "zoom" // camera punch: zooms in then breathes out (zoom in / zoom out)
  | "multi" // the word multiplies into several copies that burst outward, then settles
  | "shake" // the word vibrates/shakes on the spot
  | TextEffectKey; // any of the 40 CSS-library patterns (see TextEffects.tsx)

/** The 40 CSS text-animation patterns ported from `text-animation-library.css`. */
export type TextEffectKey =
  | "explosive"
  | "dancingShadow"
  | "melt"
  | "matrix"
  | "textMask"
  | "spin3d"
  | "glitch"
  | "neon"
  | "wavy"
  | "split"
  | "glow3d"
  | "heartbeat"
  | "marquee3d"
  | "nabla"
  | "cylinder"
  | "rollBg"
  | "gooey"
  | "ghost"
  | "schitts"
  | "frame"
  | "typewriter"
  | "typing"
  | "gradientTyping"
  | "editor"
  | "typingBg"
  | "hoverUnderline"
  | "linkSplit"
  | "barReveal"
  | "halvesSplit"
  | "fontPulse"
  | "aurora"
  | "cityLights"
  | "paintReveal"
  | "hologram"
  | "spotlight"
  | "breathe"
  | "fontTransition"
  | "curved"
  | "worklife"
  | "drawIn"
  | "vibrate"
  | "rattle"
  | "error"
  | "blurpop"
  | "fillSweep"
  | "wipeFill"
  | "drawOn"
  | "stackDrop";

/** One of the kinetic words Claude lined up for a typography scene. */
export type KineticWord = {
  text: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  dir: "left" | "right" | "up" | "down" | "zoom" | "pop";
  start: number;
  dur: number;
  order: number;
  /** Which creative effect to use. Defaults to slide when omitted. */
  effect?: KineticEffect;
};

/** A generated title / caption card built purely from a text prompt. */
export type TextScene = SceneBase & {
  type: "text";
  /** The prompt the user typed – shown as the headline. */
  prompt: string;
  /** Optional smaller line under the headline. */
  subtitle: string;
  background: string;
  color: string;
  /** How the text animates. "classic" fades/scales the whole line; "wordpop" reveals it word by word; "kinetic" uses kineticWords; "custom" renders scene code from src/generated/CustomScenes.tsx. */
  variant?: "classic" | "wordpop" | "kinetic" | "custom";
  /** When variant === "kinetic": the exact words + per-word layout/animation the LLM decided. */
  kineticWords?: KineticWord[];
  /** Optional small tagline shown at the bottom of a kinetic scene. */
  tagline?: string;
  /** Font face for the scene text (e.g. a poster typography stack). Defaults to Arial. */
  fontFamily?: string;
  /** When variant === "custom": index into CustomScenes[]. */
  customIndex?: number;
  /** Natural-language creative spec for this scene, handed to the code writer. */
  design?: string;
};

/** One of the uploaded images, shown full-bleed with an optional Ken Burns move. */
export type ImageScene = SceneBase & {
  type: "image";
  /** Path relative to the public folder, e.g. `uploads/pic.png`. */
  src: string;
  /** Caption shown as a lower third. Comes from the prompt. */
  caption: string;
  kenBurns: boolean;
  /** How the caption animates. "classic" fades in the whole line; "wordpop" reveals it word by word. */
  variant?: "classic" | "wordpop";
  /** Solid background color behind the image. When set the image is shown as a card on this color. */
  background?: string;
};

/** The uploaded video (or a trimmed section of it). */
export type VideoScene = SceneBase & {
  type: "video";
  /** Path relative to the public folder, e.g. `uploads/clip.mp4`. */
  src: string;
  /** Seconds to skip from the start of the source file. */
  trimStartSeconds: number;
  /** Playback speed. 1 = normal, 0.5 = slow-mo, 2 = fast. */
  speed: number;
  caption: string;
};

export type Scene = TextScene | ImageScene | VideoScene;

export type AssetKind = "image" | "video" | "audio";

export type UploadedAsset = {
  name: string;
  /** Path relative to the public folder. */
  src: string;
  kind: AssetKind;
  /** Natural length of the media in seconds (video / audio only). */
  durationInSeconds?: number;
};

export type ProjectAudio = {
  /** Path relative to the public folder. */
  src: string;
  /** 0..1 */
  volume: number;
};

export type Project = {
  title: string;
  fps: number;
  width: number;
  height: number;
  transition: TransitionKind;
  transitionDurationInSeconds: number;
  /** Everything the user has uploaded, whether used in a scene yet or not. */
  assets: UploadedAsset[];
  /** Optional background music / voiceover track played across the whole video. */
  audio: ProjectAudio | null;
  scenes: Scene[];
};
