import type { Project } from "@shared/project/types";

// All requests go through the Vite dev-server proxy to the helper server (:3001).

export const getProject = async (): Promise<Project> => {
  const res = await fetch(`/api/project?t=${Date.now()}`);
  return (await res.json()) as Project;
};

export const saveProject = async (project: Project): Promise<void> => {
  const res = await fetch("/api/project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project }),
  });
  if (!res.ok) throw new Error(`save failed (${res.status})`);
};

export const uploadFiles = async (files: File[]): Promise<Project["assets"]> => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error(`upload failed (${res.status})`);
  const data = (await res.json()) as { assets: Project["assets"] };
  return data.assets;
};

export const removeAsset = async (src: string): Promise<Project> => {
  const res = await fetch("/api/asset", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ src }),
  });
  if (!res.ok) throw new Error(`delete failed (${res.status})`);
  const data = (await res.json()) as { project: Project };
  return data.project;
};

export const renderVideo = async (): Promise<{ ok?: boolean; name?: string; error?: string }> => {
  const res = await fetch("/api/render", { method: "POST" });
  return (await res.json()) as { ok?: boolean; name?: string; error?: string };
};

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type ChatResponse = {
  reply?: string;
  project?: Project;
  actions?: string[];
  error?: string;
};

export const sendChat = async (
  messages: ChatTurn[],
  project: Project,
): Promise<ChatResponse> => {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, project }),
  });
  return (await res.json()) as ChatResponse;
};

// --- creator mode ---------------------------------------------------------

export type CreateStatus = {
  status: "running" | "done" | "error";
  steps: { label: string; done: boolean }[];
  log: string[];
  result?: Project;
  error?: string;
  topic?: string;
};

export type CreateFormatId = "images" | "text" | "animated" | "mix";

export type StartCreateResponse = {
  jobs?: { jobId: string; format: CreateFormatId; title: string }[];
  error?: string;
};

export type ImageProviderChoice = "fal" | "pollinations" | "typography";

export type CreateImageResponse = {
  /** public-relative URL of the created image, e.g. /uploads/generated/img-....jpg */
  src?: string;
  /** filename to download with */
  name?: string;
  error?: string;
};

/** Creates ONE downloadable image from text (AI models or a typographic SVG poster). */
export const createImage = async (body: {
  prompt: string;
  provider?: ImageProviderChoice; // omit = auto
  width?: number;
  height?: number;
  imageModel?: string;
}): Promise<CreateImageResponse> => {
  try {
    const res = await fetch("/api/image/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await res.json()) as CreateImageResponse;
  } catch {
    return { error: "Could not reach the server." };
  }
};

export const startCreate = async (body: {
  topic: string;
  title?: string;
  style?: string;
  numScenes?: number;
  /** Desired total length in seconds; scenes/narration are tuned to land near it. */
  targetDuration?: number;
  /** Output resolution. */
  width?: number;
  height?: number;
  /** One video is generated per format. Defaults to ["images"]. */
  formats?: CreateFormatId[];
  /** fal.ai image model id; empty/undefined uses .env FAL_IMAGE_MODEL or the default. */
  imageModel?: string;
  /** Image source: "fal" (needs key), "pollinations" (free AI, no key), or "typography" (text posters). Omit for auto. */
  imageProvider?: "fal" | "pollinations" | "typography";
  /** Uploaded image srcs (public-relative) to mix into the generated video, in order. */
  uploadedImages?: string[];
}): Promise<StartCreateResponse> => {
  const res = await fetch("/api/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json()) as StartCreateResponse;
};

export const fetchCreateStatus = async (jobId: string): Promise<CreateStatus> => {
  const res = await fetch(`/api/create/status/${jobId}`);
  return (await res.json()) as CreateStatus;
};

export type CreatorVersion = {
  id: string;
  format: CreateFormatId;
  title: string;
  createdAt: number;
};

export const getCreatorVersions = async (): Promise<CreatorVersion[]> => {
  const res = await fetch("/api/creator-versions");
  const data = (await res.json()) as { versions: CreatorVersion[] };
  return data.versions;
};

export const setActiveVersion = async (id: string): Promise<Project> => {
  const res = await fetch("/api/creator-versions/set", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error(`set version failed (${res.status})`);
  const data = (await res.json()) as { project: Project };
  return data.project;
};

// --- code editor ---------------------------------------------------------
// `src/generated/CustomScenes.tsx` — the generated animation code ("code of the
// video"). The "Open in editor" button opens this file in the user's installed
// code editor (VS Code preferred, else the OS-default app).

export const openEditorCode = async (): Promise<{ ok: boolean; message?: string; error?: string }> => {
  const res = await fetch("/api/code/open", { method: "POST" });
  return (await res.json()) as { ok: boolean; message?: string; error?: string };
};
