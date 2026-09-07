// Every edit the chatbot (or the local command bar) can make to a Project.
//
// Each operation takes the current project plus a small args object and returns
// a brand-new project together with a short human-readable message. Scene
// numbers in the public API are 1-based, because that is what users see.

import type {
  ImageScene,
  OverlayPosition,
  Project,
  Scene,
  TextOverlay,
  TextScene,
  TransitionKind,
  VideoScene,
} from "./types";

let counter = 0;
const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const clone = (project: Project): Project => ({
  ...project,
  assets: project.assets.map((a) => ({ ...a })),
  audio: project.audio ? { ...project.audio } : null,
  scenes: project.scenes.map((s) => ({
    ...s,
    overlays: s.overlays.map((o) => ({ ...o })),
  })),
});

const OVERLAY_POSITIONS: OverlayPosition[] = [
  "top",
  "center",
  "bottom",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

export class OperationError extends Error {}

const sceneAt = (project: Project, oneBased: number): Scene => {
  const scene = project.scenes[oneBased - 1];
  if (!scene) {
    throw new OperationError(
      `There is no scene ${oneBased}. The video has ${project.scenes.length} scene(s).`,
    );
  }
  return scene;
};

const insertAt = (scenes: Scene[], scene: Scene, position?: number) => {
  if (position === undefined || position < 1 || position > scenes.length) {
    scenes.push(scene);
  } else {
    scenes.splice(position - 1, 0, scene);
  }
};

const assetByRef = (
  project: Project,
  kind: "image" | "video" | "audio",
  ref?: string | number,
) => {
  const pool = project.assets.filter((a) => a.kind === kind);
  if (ref === undefined) {
    return undefined;
  }
  if (typeof ref === "number") {
    return pool[ref - 1];
  }
  const lower = ref.toLowerCase();
  return (
    pool.find((a) => a.name.toLowerCase() === lower) ??
    pool.find((a) => a.name.toLowerCase().includes(lower)) ??
    pool.find((a) => a.src.toLowerCase().includes(lower))
  );
};

const firstUnusedImage = (project: Project) => {
  const used = new Set(
    project.scenes
      .filter((s): s is ImageScene => s.type === "image")
      .map((s) => s.src),
  );
  return project.assets.find((a) => a.kind === "image" && !used.has(a.src));
};

const makeOverlay = (partial: Partial<TextOverlay> & { text: string }): TextOverlay => ({
  id: newId("ov"),
  text: partial.text,
  position: partial.position ?? "bottom",
  startSeconds: partial.startSeconds ?? 0,
  endSeconds: partial.endSeconds ?? 9999,
  fontSize: partial.fontSize ?? 48,
  color: partial.color ?? "#ffffff",
  background: partial.background ?? "",
});

// ---------------------------------------------------------------------------

export type ActionResult = { project: Project; message: string };
type Args = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" ? v : undefined);
const num = (v: unknown) => {
  const n = typeof v === "string" ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : undefined;
};
const bool = (v: unknown) => (typeof v === "boolean" ? v : undefined);

const ACTIONS: Record<string, (p: Project, a: Args) => ActionResult> = {
  set_project(input, a) {
    const project = clone(input);
    if (str(a.title)) project.title = str(a.title)!;
    if (num(a.width)) project.width = Math.round(num(a.width)!);
    if (num(a.height)) project.height = Math.round(num(a.height)!);
    if (num(a.fps)) project.fps = clamp(Math.round(num(a.fps)!), 1, 60);
    return { project, message: "Updated the project settings." };
  },

  add_text_scene(input, a) {
    const project = clone(input);
    const scene: TextScene = {
      id: newId("text"),
      type: "text",
      durationInSeconds: num(a.durationInSeconds) ?? 3,
      overlays: [],
      prompt: str(a.text) ?? "Untitled",
      subtitle: str(a.subtitle) ?? "",
      background: str(a.background) ?? "#0b1021",
      color: str(a.color) ?? "#ffffff",
    };
    insertAt(project.scenes, scene, num(a.position));
    return { project, message: `Added a title card: "${scene.prompt}"` };
  },

  add_image_scene(input, a) {
    const project = clone(input);
    const asset =
      assetByRef(project, "image", (str(a.image) ?? num(a.image)) as string | number) ??
      firstUnusedImage(project);
    if (!asset) {
      throw new OperationError("No image is available. Upload one first.");
    }
    const scene: ImageScene = {
      id: newId("image"),
      type: "image",
      durationInSeconds: num(a.durationInSeconds) ?? 4,
      overlays: [],
      src: asset.src,
      caption: str(a.caption) ?? "",
      kenBurns: bool(a.kenBurns) ?? true,
    };
    insertAt(project.scenes, scene, num(a.position));
    return { project, message: `Added an image scene from ${asset.name}.` };
  },

  add_video_scene(input, a) {
    const project = clone(input);
    const asset =
      assetByRef(project, "video", (str(a.video) ?? num(a.video)) as string | number) ??
      project.assets.find((x) => x.kind === "video");
    if (!asset) {
      throw new OperationError("No video uploaded yet.");
    }
    const trimStartSeconds = Math.max(0, num(a.trimStartSeconds) ?? 0);
    const speed = num(a.speed) ?? 1;
    // Default to the whole clip (after any trim, adjusted for speed) so a
    // 1-minute upload doesn't silently become 6 seconds.
    const remaining =
      asset.durationInSeconds !== undefined
        ? Math.max(0.2, (asset.durationInSeconds - trimStartSeconds) / speed)
        : 6;
    const scene: VideoScene = {
      id: newId("video"),
      type: "video",
      durationInSeconds: num(a.durationInSeconds) ?? remaining,
      overlays: [],
      src: asset.src,
      trimStartSeconds,
      speed,
      caption: str(a.caption) ?? "",
    };
    insertAt(project.scenes, scene, num(a.position));
    return {
      project,
      message: `Added a video scene from ${asset.name} (${scene.durationInSeconds.toFixed(1)}s).`,
    };
  },

  remove_asset(input, a) {
    const project = clone(input);
    const ref = (str(a.asset) ?? num(a.asset)) as string | number | undefined;
    const target =
      assetByRef(project, "video", ref) ??
      assetByRef(project, "image", ref) ??
      assetByRef(project, "audio", ref) ??
      project.assets.find((x) => x.src === ref);
    if (!target) {
      throw new OperationError("Couldn't find that asset.");
    }
    project.assets = project.assets.filter((x) => x.src !== target.src);
    project.scenes = project.scenes.filter(
      (s) => !((s.type === "image" || s.type === "video") && s.src === target.src),
    );
    if (project.audio?.src === target.src) {
      project.audio = null;
    }
    return { project, message: `Removed ${target.name} and any scenes using it.` };
  },

  add_slideshow(input, a) {
    let project = clone(input);
    const captions = Array.isArray(a.captions) ? (a.captions as unknown[]).map(String) : [];
    const durationEach = num(a.durationEach) ?? 4;
    const kenBurns = bool(a.kenBurns) ?? true;
    const used = new Set(
      project.scenes.filter((s): s is ImageScene => s.type === "image").map((s) => s.src),
    );
    const images = project.assets.filter((x) => x.kind === "image" && !used.has(x.src));
    if (images.length === 0) {
      throw new OperationError("No unused images to build a slideshow from.");
    }
    images.forEach((asset, i) => {
      project.scenes.push({
        id: newId("image"),
        type: "image",
        durationInSeconds: durationEach,
        overlays: [],
        src: asset.src,
        caption: captions[i] ?? "",
        kenBurns,
      });
    });
    if (str(a.transition)) {
      project = ACTIONS.set_transition(project, { kind: str(a.transition) }).project;
    }
    return { project, message: `Built a ${images.length}-image slideshow.` };
  },

  add_text_overlay(input, a) {
    const project = clone(input);
    const scene = sceneAt(project, num(a.scene) ?? 1);
    const text = str(a.text);
    if (!text) throw new OperationError("An overlay needs some text.");
    const position = (str(a.position) as OverlayPosition) ?? "bottom";
    if (!OVERLAY_POSITIONS.includes(position)) {
      throw new OperationError(`position must be one of: ${OVERLAY_POSITIONS.join(", ")}`);
    }
    scene.overlays.push(
      makeOverlay({
        text,
        position,
        startSeconds: num(a.startSeconds) ?? 0,
        endSeconds: num(a.endSeconds) ?? scene.durationInSeconds,
        fontSize: num(a.fontSize) ?? 48,
        color: str(a.color) ?? "#ffffff",
        background: str(a.background) ?? "",
      }),
    );
    return { project, message: `Added an overlay to scene ${num(a.scene) ?? 1}: "${text}"` };
  },

  remove_overlays(input, a) {
    const project = clone(input);
    const scene = sceneAt(project, num(a.scene) ?? 1);
    const count = scene.overlays.length;
    scene.overlays = [];
    return { project, message: `Removed ${count} overlay(s) from scene ${num(a.scene) ?? 1}.` };
  },

  split_scene(input, a) {
    const project = clone(input);
    const index = (num(a.scene) ?? 1) - 1;
    const scene = sceneAt(project, index + 1);
    const at = num(a.atSeconds);
    if (at === undefined || at <= 0 || at >= scene.durationInSeconds) {
      throw new OperationError(
        `atSeconds must be between 0 and ${scene.durationInSeconds}.`,
      );
    }
    const first = {
      ...scene,
      overlays: scene.overlays.map((o) => ({ ...o })),
      durationInSeconds: at,
    };
    const second: Scene = {
      ...scene,
      id: newId(scene.type),
      overlays: [],
      durationInSeconds: scene.durationInSeconds - at,
    };
    if (second.type === "video") {
      (second as VideoScene).trimStartSeconds += at * (second as VideoScene).speed;
    }
    project.scenes.splice(index, 1, first, second);
    return { project, message: `Split scene ${index + 1} at ${at}s.` };
  },

  trim_scene(input, a) {
    const project = clone(input);
    const scene = sceneAt(project, num(a.scene) ?? 1);
    if (num(a.durationInSeconds) !== undefined) {
      scene.durationInSeconds = clamp(num(a.durationInSeconds)!, 0.2, 3600);
    }
    if (scene.type === "video" && num(a.trimStartSeconds) !== undefined) {
      (scene as VideoScene).trimStartSeconds = Math.max(0, num(a.trimStartSeconds)!);
    }
    return { project, message: `Trimmed scene ${num(a.scene) ?? 1}.` };
  },

  set_speed(input, a) {
    const project = clone(input);
    const scene = sceneAt(project, num(a.scene) ?? 1);
    if (scene.type !== "video") {
      throw new OperationError(`Scene ${num(a.scene) ?? 1} is not a video.`);
    }
    (scene as VideoScene).speed = clamp(num(a.speed) ?? 1, 0.25, 4);
    return {
      project,
      message: `Scene ${num(a.scene) ?? 1} now plays at ${(scene as VideoScene).speed}x.`,
    };
  },

  set_duration(input, a) {
    const project = clone(input);
    const scene = sceneAt(project, num(a.scene) ?? 1);
    scene.durationInSeconds = clamp(num(a.durationInSeconds) ?? 3, 0.2, 3600);
    return { project, message: `Scene ${num(a.scene) ?? 1} is now ${scene.durationInSeconds}s.` };
  },

  reorder_scene(input, a) {
    const project = clone(input);
    const from = (num(a.from) ?? 0) - 1;
    const to = (num(a.to) ?? 0) - 1;
    if (from < 0 || from >= project.scenes.length || to < 0 || to >= project.scenes.length) {
      throw new OperationError("from/to are out of range.");
    }
    const [moved] = project.scenes.splice(from, 1);
    project.scenes.splice(to, 0, moved);
    return { project, message: `Moved scene ${from + 1} to position ${to + 1}.` };
  },

  delete_scene(input, a) {
    const project = clone(input);
    const index = (num(a.scene) ?? 1) - 1;
    sceneAt(project, index + 1);
    const [removed] = project.scenes.splice(index, 1);
    return { project, message: `Deleted scene ${index + 1} (${removed.type}).` };
  },

  set_transition(input, a) {
    const project = clone(input);
    const kind = (str(a.kind) as TransitionKind) ?? "fade";
    if (!["none", "fade", "slide", "wipe"].includes(kind)) {
      throw new OperationError("kind must be none, fade, slide or wipe.");
    }
    project.transition = kind;
    if (num(a.durationInSeconds) !== undefined) {
      project.transitionDurationInSeconds = clamp(num(a.durationInSeconds)!, 0.1, 3);
    }
    return { project, message: `Transitions set to ${kind}.` };
  },

  set_audio(input, a) {
    const project = clone(input);
    const asset =
      assetByRef(project, "audio", (str(a.audio) ?? num(a.audio)) as string | number) ??
      project.assets.find((x) => x.kind === "audio");
    if (!asset) {
      throw new OperationError("No audio uploaded yet.");
    }
    project.audio = { src: asset.src, volume: clamp(num(a.volume) ?? 0.7, 0, 1) };
    return { project, message: `Background audio set to ${asset.name}.` };
  },

  remove_audio(input) {
    const project = clone(input);
    project.audio = null;
    return { project, message: "Removed the background audio." };
  },

  clear_scenes(input) {
    const project = clone(input);
    project.scenes = [];
    return { project, message: "Cleared every scene." };
  },
};

export const ACTION_NAMES = Object.keys(ACTIONS);

export const applyAction = (project: Project, name: string, args: Args): ActionResult => {
  const fn = ACTIONS[name];
  if (!fn) {
    throw new OperationError(`Unknown action "${name}".`);
  }
  return fn(project, args);
};

// ---------------------------------------------------------------------------

/** A compact text description of the project for the model's system prompt. */
export const describeProject = (project: Project): string => {
  const lines: string[] = [
    `Title: ${project.title} · ${project.width}x${project.height} @ ${project.fps}fps`,
    `Transition: ${project.transition} (${project.transitionDurationInSeconds}s)`,
    `Background audio: ${project.audio ? project.audio.src : "none"}`,
  ];

  const assets = project.assets;
  lines.push(
    `Uploaded assets: ${
      assets.length === 0
        ? "none"
        : assets
            .map((x, i) => {
              const kindIndex =
                assets.filter((y, j) => y.kind === x.kind && j <= i).length;
              const dur =
                x.durationInSeconds !== undefined
                  ? ` (${x.durationInSeconds.toFixed(1)}s)`
                  : "";
              return `[${x.kind} ${kindIndex}] ${x.name}${dur}`;
            })
            .join(", ")
    }`,
  );

  if (project.scenes.length === 0) {
    lines.push("Scenes: none yet");
  } else {
    lines.push("Scenes:");
    project.scenes.forEach((scene, i) => {
      const bits: string[] = [`${i + 1}. ${scene.type} · ${scene.durationInSeconds}s`];
      if (scene.type === "text") bits.push(`text="${scene.prompt}"`);
      if (scene.type === "image") bits.push(`img=${scene.src.split("/").pop()}`);
      if (scene.type === "video")
        bits.push(`vid=${scene.src.split("/").pop()} trim=${scene.trimStartSeconds}s speed=${scene.speed}x`);
      if (scene.overlays.length) {
        bits.push(`overlays=[${scene.overlays.map((o) => `"${o.text}"@${o.position}`).join(", ")}]`);
      }
      lines.push("  " + bits.join(" "));
    });
  }

  return lines.join("\n");
};
