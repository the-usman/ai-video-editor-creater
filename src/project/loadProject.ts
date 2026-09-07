import { staticFile } from "remotion";
import { defaultProject } from "./defaultProject";
import { normalizeProject } from "./normalize";
import type { Project } from "./types";

/**
 * Reads `public/project.json`. Falls back to the default project when the file
 * has not been written yet (e.g. the server has never run).
 */
export const loadProject = async (): Promise<Project> => {
  try {
    const res = await fetch(`${staticFile("project.json")}?t=${Date.now()}`);
    if (!res.ok) {
      return defaultProject;
    }
    const parsed = (await res.json()) as Partial<Project>;
    if (!Array.isArray(parsed.scenes)) {
      return defaultProject;
    }
    return normalizeProject(parsed);
  } catch {
    return defaultProject;
  }
};
