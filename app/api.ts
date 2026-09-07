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
