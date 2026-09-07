import type { Project, Scene } from "./types";

export const sceneDurationInFrames = (scene: Scene, fps: number): number =>
  Math.max(1, Math.round(scene.durationInSeconds * fps));

export const transitionDurationInFrames = (project: Project): number => {
  if (project.transition === "none") {
    return 0;
  }
  return Math.max(1, Math.round(project.transitionDurationInSeconds * project.fps));
};

/**
 * Total length of the composition. Every transition overlaps two scenes, so the
 * overlap has to be subtracted once per transition.
 */
export const totalDurationInFrames = (project: Project): number => {
  const { fps } = project;
  const scenes = project.scenes;
  if (scenes.length === 0) {
    return fps; // 1s placeholder so the composition stays valid
  }

  const sceneFrames = scenes.reduce(
    (sum, scene) => sum + sceneDurationInFrames(scene, fps),
    0,
  );

  const overlap = transitionDurationInFrames(project) * (scenes.length - 1);
  return Math.max(1, sceneFrames - overlap);
};
