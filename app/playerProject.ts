import type { Project } from "@shared/project/types";

// The Vite app does not serve the Remotion public/ folder, so rewrite every
// uploaded-asset path to an absolute URL on the helper server (which serves
// /uploads and sends permissive CORS headers). Scene components see an http(s)
// URL and use it directly instead of staticFile().
const ASSET_HOST = "http://localhost:3001";

const abs = (src: string): string => {
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${ASSET_HOST}/${src.replace(/^\/+/, "")}`;
};

export const toPlayerProject = (project: Project): Project => ({
  ...project,
  audio: project.audio ? { ...project.audio, src: abs(project.audio.src) } : null,
  scenes: project.scenes.map((scene) => {
    if (scene.type === "image" || scene.type === "video") {
      return { ...scene, src: abs(scene.src) };
    }
    return scene;
  }),
});
