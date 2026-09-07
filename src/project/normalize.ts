import { defaultProject } from "./defaultProject";
import type { Project, Scene } from "./types";

const s = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);
const n = (v: unknown, fallback: number) => (typeof v === "number" ? v : fallback);
const b = (v: unknown, fallback: boolean) => (typeof v === "boolean" ? v : fallback);

let idCounter = 0;

const normalizeScene = (raw: Record<string, unknown>): Scene => {
  const base = {
    id: s(raw.id, `scene-${idCounter++}`),
    durationInSeconds: n(raw.durationInSeconds, 3),
    overlays: Array.isArray(raw.overlays) ? (raw.overlays as Scene["overlays"]) : [],
  };
  if (raw.type === "image") {
    return {
      ...base,
      type: "image",
      src: s(raw.src, ""),
      caption: s(raw.caption, ""),
      kenBurns: b(raw.kenBurns, true),
    };
  }
  if (raw.type === "video") {
    return {
      ...base,
      type: "video",
      src: s(raw.src, ""),
      caption: s(raw.caption, ""),
      trimStartSeconds: n(raw.trimStartSeconds, 0),
      speed: n(raw.speed, 1),
    };
  }
  return {
    ...base,
    type: "text",
    prompt: s(raw.prompt, ""),
    subtitle: s(raw.subtitle, ""),
    background: s(raw.background, "#0b1021"),
    color: s(raw.color, "#ffffff"),
  };
};

/** Fill in any missing fields so older project.json files still load. */
export const normalizeProject = (raw: Partial<Project>): Project => ({
  ...defaultProject,
  ...raw,
  audio: raw.audio ?? null,
  assets: Array.isArray(raw.assets) ? raw.assets : [],
  scenes: Array.isArray(raw.scenes)
    ? raw.scenes.map((sc) => normalizeScene(sc as Record<string, unknown>))
    : defaultProject.scenes,
});
