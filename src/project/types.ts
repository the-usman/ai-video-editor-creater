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
};

/** One of the uploaded images, shown full-bleed with an optional Ken Burns move. */
export type ImageScene = SceneBase & {
  type: "image";
  /** Path relative to the public folder, e.g. `uploads/pic.png`. */
  src: string;
  /** Caption shown as a lower third. Comes from the prompt. */
  caption: string;
  kenBurns: boolean;
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
