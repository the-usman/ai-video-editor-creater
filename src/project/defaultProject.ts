import type { Project } from "./types";

/**
 * The project shown before the user has built anything. Also used by the
 * server to seed `public/project.json` on first run.
 */
export const defaultProject: Project = {
  title: "My generated video",
  fps: 30,
  width: 1280,
  height: 720,
  transition: "fade",
  transitionDurationInSeconds: 0.5,
  assets: [],
  audio: null,
  scenes: [
    {
      id: "intro",
      type: "text",
      durationInSeconds: 3,
      overlays: [],
      prompt: "Ask the chatbot to build your video",
      subtitle: "Upload a video, images or music, then describe what you want",
      background: "#0b1021",
      color: "#ffffff",
    },
  ],
};

export const SERVER_URL = "http://localhost:3001";
