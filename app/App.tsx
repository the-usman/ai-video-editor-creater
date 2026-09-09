import { useCallback, useEffect, useRef, useState } from "react";
import { applyAction } from "@shared/project/operations";
import { normalizeProject } from "@shared/project/normalize";
import { defaultProject } from "@shared/project/defaultProject";
import type { Project, UploadedAsset } from "@shared/project/types";
import {
  getProject,
  openEditorCode,
  removeAsset,
  renderVideo,
  saveProject,
  sendChat,
  uploadFiles,
  type ChatTurn,
} from "./api";
import { probeDuration, probeDurationFromUrl } from "./probeDuration";
import { AssetTray } from "./components/AssetTray";
import { Chat } from "./components/Chat";
import { Creator } from "./components/Creator";
import { ImageMaker } from "./components/ImageMaker";
import { Inspector } from "./components/Inspector";
import { Preview } from "./components/Preview";
import { box, btn, c, label, primaryBtn } from "./theme";

export const App: React.FC = () => {
  const [project, setProject] = useState<Project>(defaultProject);
  const [mode, setMode] = useState<"editor" | "creator" | "image">("editor");
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [rendering, setRendering] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragDepth = useRef(0);

  useEffect(() => {
    let cancelled = false;
    getProject()
      .then(async (raw) => {
        const p = normalizeProject(raw);
        if (cancelled) return;
        setProject(p);

        // Backfill natural durations for media uploaded before this was tracked.
        const missing = p.assets.filter(
          (a) => (a.kind === "video" || a.kind === "audio") && a.durationInSeconds === undefined,
        );
        if (missing.length === 0) return;
        const found = await Promise.all(
          missing.map((a) =>
            probeDurationFromUrl(a.kind as "video" | "audio", `http://localhost:3001/${a.src}`),
          ),
        );
        if (cancelled || found.every((d) => d === undefined)) return;
        setProject((cur) => {
          const next = {
            ...cur,
            assets: cur.assets.map((a) => {
              const i = missing.findIndex((m) => m.src === a.src);
              return i >= 0 && found[i] !== undefined ? { ...a, durationInSeconds: found[i] } : a;
            }),
          };
          void saveProject(next);
          return next;
        });
      })
      .catch(() => setStatus("Server offline — run `npm run dev`"));
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounced autosave for local (inspector / quick-add / upload) edits.
  const update = useCallback((next: Project, save = true) => {
    setProject(next);
    if (!save) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveProject(next)
        .then(() => setStatus("Saved ✓"))
        .catch(() => setStatus("Save failed — is the server running?"));
    }, 350);
  }, []);

  const doUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      setStatus("Uploading…");
      try {
        const durations = await Promise.all(files.map(probeDuration));
        const assets = (await uploadFiles(files)).map((a, i) =>
          durations[i] !== undefined ? { ...a, durationInSeconds: durations[i] } : a,
        );
        setProject((prev) => {
          const next = { ...prev, assets: [...prev.assets, ...assets] };
          void saveProject(next);
          return next;
        });
        setStatus(`Added ${assets.length} file(s)`);
      } catch {
        setStatus("Upload failed");
      }
    },
    [],
  );

  const deleteAsset = useCallback(
    async (src: string, name: string) => {
      if (!window.confirm(`Delete "${name}"? Any scenes using it are removed too.`)) return;
      setStatus("Deleting…");
      setSelected((s) => s.filter((x) => x !== src));
      try {
        setProject(normalizeProject(await removeAsset(src)));
        setStatus("Deleted");
      } catch {
        setStatus("Delete failed");
      }
    },
    [],
  );

  const openCode = useCallback(async () => {
    setStatus("Opening the animation code in your editor…");
    try {
      const r = await openEditorCode();
      setStatus(r.error ?? r.message ?? (r.ok ? "Opened in your editor ✓" : "Could not open"));
    } catch {
      setStatus("Could not open the editor — is the server running?");
    }
  }, []);

  const downloadVideo = useCallback(async () => {
    if (rendering) return;
    if (project.scenes.length === 0) {
      setStatus("Add something to the video first");
      return;
    }
    setRendering(true);
    setStatus("Rendering… this takes a few minutes for a long video — keep this tab open");
    try {
      const r = await renderVideo();
      if (r.error || !r.ok) {
        setStatus(`Render failed: ${r.error ?? "unknown error"}`);
      } else {
        setStatus("Rendered ✓ — downloading");
        const a = document.createElement("a");
        a.href = `/api/download?name=${encodeURIComponent(r.name ?? "video.mp4")}&t=${Date.now()}`;
        a.download = r.name ?? "video.mp4";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch {
      setStatus("Render failed — is the server running?");
    } finally {
      setRendering(false);
    }
  }, [rendering, project.scenes.length]);

  const quickAdd = useCallback(
    (asset: UploadedAsset) => {
      const map = { image: "add_image_scene", video: "add_video_scene", audio: "set_audio" } as const;
      try {
        const r = applyAction(project, map[asset.kind], { [asset.kind === "audio" ? "audio" : asset.kind]: asset.name });
        update(r.project);
        setStatus(r.message);
      } catch (e) {
        setStatus(String(e));
      }
    },
    [project, update],
  );

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || busy) return;
    const attachedNames = project.assets
      .filter((a) => selected.includes(a.src))
      .map((a) => a.name);
    const content = attachedNames.length
      ? `(Use these uploaded files: ${attachedNames.join(", ")})\n${text}`
      : text;
    const next: ChatTurn[] = [...messages, { role: "user", content }];
    setMessages(next);
    setDraft("");
    setSelected([]);
    setBusy(true);
    setStatus("Claude is editing…");
    try {
      const data = await sendChat(next, project);
      if (data.error) {
        setMessages((m) => [...m, { role: "assistant", content: `⚠ ${data.error}` }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "Done." }]);
        if (data.project) setProject(normalizeProject(data.project));
        setStatus(data.actions?.length ? `Applied: ${data.actions.join(", ")}` : "");
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "⚠ Could not reach the server." }]);
    } finally {
      setBusy(false);
    }
  }, [draft, busy, messages, project, selected]);

  // ---- drag & drop anywhere ----
  const onDragEnter = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    dragDepth.current += 1;
    setDragging(true);
  };
  const onDragLeave = () => {
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) setDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    void doUpload(Array.from(e.dataTransfer.files ?? []));
  };

  const attached = project.assets.filter((a) => selected.includes(a.src));

  return (
    <div
      onDragEnter={onDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{ display: "flex", height: "100%", position: "relative" }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 380,
          flexShrink: 0,
          borderRight: `1px solid ${c.border}`,
          background: c.panel,
          display: "flex",
          flexDirection: "column",
          padding: 14,
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>🤖 AI Video Editor</div>
          <div style={{ fontSize: 12, color: c.dim }}>Chat to build · drop media anywhere</div>
        </div>

        {/* Editor / Creator toggle */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: c.panel2,
            border: `1px solid ${c.border}`,
            borderRadius: 10,
            padding: 4,
          }}
        >
          {(
            [
              { id: "editor", label: "🎬 Editor" },
              { id: "creator", label: "✨ Creator" },
              { id: "image", label: "🖼 Image" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                flex: 1,
                padding: "7px 0",
                borderRadius: 7,
                border: "none",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                background: mode === m.id ? c.accent : "transparent",
                color: mode === m.id ? "#fff" : c.dim,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "creator" ? (
          <Creator onProject={update} setStatus={setStatus} />
        ) : mode === "image" ? (
          <ImageMaker setStatus={setStatus} />
        ) : (
          <>
            <div style={{ ...box, padding: 10 }}>
              <AssetTray
                assets={project.assets}
                selected={selected}
                onToggleSelect={(src) =>
                  setSelected((s) => (s.includes(src) ? s.filter((x) => x !== src) : [...s, src]))
                }
                onPick={doUpload}
                onQuickAdd={quickAdd}
                onDelete={deleteAsset}
              />
            </div>

            <Chat
              messages={messages}
              busy={busy}
              draft={draft}
              setDraft={setDraft}
              attached={attached}
              onClearAttached={() => setSelected([])}
              onSend={send}
            />
          </>
        )}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <input
            value={project.title}
            onChange={(e) => update({ ...project, title: e.target.value })}
            style={{
              background: "none",
              border: "none",
              color: c.text,
              fontSize: 18,
              fontWeight: 700,
              outline: "none",
              flex: 1,
            }}
          />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ ...label, minWidth: 160, textAlign: "right" }}>{status}</span>
            <button style={btn} onClick={() => update(applyAction(project, "clear_scenes", {}).project)}>
              Clear
            </button>
            <button style={primaryBtn} onClick={() => void openCode()}>
              ✏️ Open in editor
            </button>
            <button
              style={{
                ...primaryBtn,
                background: rendering ? c.panel2 : c.good,
                color: rendering ? c.dim : "#04231a",
                fontWeight: 700,
                cursor: rendering ? "default" : "pointer",
              }}
              disabled={rendering}
              onClick={() => void downloadVideo()}
            >
              {rendering ? "Rendering…" : "⬇ Download MP4"}
            </button>
          </div>
        </div>

        <Preview project={project} />

        <div style={{ ...box, padding: 14 }}>
          <Inspector project={project} onChange={update} />
        </div>

        <p style={{ fontSize: 12, color: c.dim }}>
          <b>⬇ Download MP4</b> renders the video and saves it to your computer. A one-minute
          video takes a few minutes to render — leave the tab open while it works.
        </p>
      </main>

      {dragging && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(11,16,33,0.85)",
            border: `3px dashed ${c.accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 700,
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          Drop media to upload
        </div>
      )}
    </div>
  );
};
