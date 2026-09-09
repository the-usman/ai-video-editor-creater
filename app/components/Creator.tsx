import { useCallback, useEffect, useRef, useState } from "react";
import type { Project, UploadedAsset } from "@shared/project/types";
import {
  fetchCreateStatus,
  getCreatorVersions,
  setActiveVersion,
  startCreate,
  uploadFiles,
  type CreateFormatId,
  type CreateStatus,
  type CreatorVersion,
} from "../api";
import { probeDurationFromUrl } from "../probeDuration";
import { box, btn, c, input, label, primaryBtn } from "../theme";

const STYLES = [
  { value: "auto", label: "No preference" },
  { value: "cinematic", label: "Cinematic documentary" },
  { value: "travel vlog", label: "Bright travel vlog" },
  { value: "nature", label: "Nature & wildlife" },
  { value: "tech explainer", label: "Tech explainer" },
  { value: "inspirational", label: "Inspirational quotes" },
];

const FORMAT_LABEL: Record<CreateFormatId, string> = {
  images: "Images",
  mix: "Images",
  text: "Text",
  animated: "Animated text",
};

const DIMENSIONS: { label: string; w: number; h: number }[] = [
  { label: "16:9 (1280x720)", w: 1280, h: 720 },
  { label: "16:9 HD (1920x1080)", w: 1920, h: 1080 },
  { label: "9:16 vertical (1080x1920)", w: 1080, h: 1920 },
  { label: "1:1 square (1080x1080)", w: 1080, h: 1080 },
];

export const Creator: React.FC<{
  onProject: (p: Project) => void;
  setStatus: (s: string) => void;
}> = ({ onProject, setStatus }) => {
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("auto");
  const [imageProvider, setImageProvider] = useState<
  "" | "fal" | "pollinations" | "typography" | "off"
>(""); // "" = auto
  const [numScenes, setNumScenes] = useState<number | undefined>(undefined);
  const [targetDuration, setTargetDuration] = useState<number | undefined>(undefined);
  const [dimension, setDimension] = useState({ w: 1280, h: 720 });
  const [uploadedImages, setUploadedImages] = useState<UploadedAsset[]>([]);
  const [running, setRunning] = useState(false);
  const [jobs, setJobs] = useState<{ jobId: string; format: CreateFormatId; title: string }[]>([]);
  const [jobStatuses, setJobStatuses] = useState<Record<string, CreateStatus>>({});
  const [error, setError] = useState("");
  const [versions, setVersions] = useState<CreatorVersion[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const completedRef = useRef<Set<string>>(new Set());
  const resultsRef = useRef<Record<string, CreateStatus>>({});

  const refreshVersions = useCallback(() => {
    getCreatorVersions()
      .then((v) => {
        if (mountedRef.current) setVersions(v);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refreshVersions();
    return () => {
      mountedRef.current = false;
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [refreshVersions]);

  const correctDurations = async (p: Project): Promise<Project | null> => {
    const durs = await Promise.all(
      p.scenes.map((scene) =>
        scene.audioSrc ? probeDurationFromUrl("audio", `http://localhost:3001/${scene.audioSrc}`) : undefined,
      ),
    );
    if (durs.every((d) => d === undefined)) return null;
    return {
      ...p,
      scenes: p.scenes.map((scene, i) =>
        durs[i] !== undefined ? { ...scene, durationInSeconds: Math.round((durs[i]! + 0.4) * 10) / 10 } : scene,
      ),
    };
  };

  const handleFinished = useCallback(
    async (jobId: string, s: CreateStatus) => {
      resultsRef.current[jobId] = s;
      completedRef.current.add(jobId);
      if (s.status === "done" && s.result) {
        onProject(s.result);
        const corrected = await correctDurations(s.result);
        if (mountedRef.current && corrected) onProject(corrected);
      }
      refreshVersions();
    },
    [onProject, refreshVersions],
  );

  const pollAll = useCallback(
    (jobList: { jobId: string; format: CreateFormatId; title: string }[]) => {
      if (!mountedRef.current) return;
      jobList.forEach((job) => {
        fetchCreateStatus(job.jobId)
          .then(async (s) => {
            if (!mountedRef.current) return;
            setJobStatuses((prev) => ({ ...prev, [job.jobId]: s }));
            if (s.status !== "running" && !completedRef.current.has(job.jobId)) {
              await handleFinished(job.jobId, s);
              if (!mountedRef.current) return;
              const last = jobList.map((j) => j.jobId);
              const allHaveResults = last.every((id) => resultsRef.current[id]);
              if (allHaveResults) {
                setRunning(false);
                const failed = last.filter((id) => resultsRef.current[id]?.status === "error").length;
                setStatus(
                  failed
                    ? `Generated with ${failed} error(s) — check .env keys`
                    : `Video ready`,
                );
              }
            }
          })
          .catch(() => {});
      });
      if (pollRef.current) clearTimeout(pollRef.current);
      pollRef.current = setTimeout(() => pollAll(jobList), 1200);
    },
    [handleFinished, setStatus],
  );

  useEffect(() => {
    if (!running || jobs.length === 0) return;
    if (pollRef.current) clearTimeout(pollRef.current);
    completedRef.current = new Set();
    pollAll(jobs);
  }, [running, jobs, pollAll]);

  const handleAddImages = async (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    if (imgs.length === 0) return;
    setStatus(`Uploading ${imgs.length} image(s)…`);
    try {
      const assets = await uploadFiles(imgs);
      setUploadedImages((cur) => [...cur, ...assets]);
      setStatus(`Added ${assets.length} image(s)`);
    } catch {
      setStatus("Upload failed — is the server running?");
    }
  };

  const removeUploadedImage = (src: string) => {
    setUploadedImages((cur) => cur.filter((a) => a.src !== src));
  };

  const simulatePicker = () => {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = "image/*";
    el.multiple = true;
    el.onchange = () => {
      if (el.files) void handleAddImages(Array.from(el.files));
    };
    el.click();
  };

  const generate = async () => {
    const t = topic.trim();
    if (!t || running) return;
    setError("");
    setJobs([]);
    setJobStatuses({});
    setRunning(true);
    setStatus("Writing the script…");
    try {
      // "off" -> animated text (no images); otherwise a generated-image video
      // with the chosen AI image source ("" = auto: fal.ai if a key is set,
      // else the free Pollinations.ai).
      const imagesOff = imageProvider === "off";
      const format: CreateFormatId = imagesOff ? "animated" : "images";
      const r = await startCreate({
        topic: t,
        title: title.trim() || t,
        style,
        formats: [format],
        imageProvider: imagesOff ? undefined : imageProvider === "" ? undefined : imageProvider,
        uploadedImages: uploadedImages.map((a) => a.src),
        numScenes,
        targetDuration,
        width: dimension.w,
        height: dimension.h,
      });
      if (r.error) {
        setError(r.error);
        setRunning(false);
        setStatus("Could not start");
        return;
      }
      const list = r.jobs ?? [];
      if (list.length === 0) {
        setError("Nothing to generate.");
        setRunning(false);
        setStatus("Could not start");
        return;
      }
      setJobs(list);
    } catch {
      setError("Could not reach the server. Is `npm run dev` running?");
      setRunning(false);
      setStatus("Could not start");
    }
  };

  const loadVersion = async (id: string) => {
    setStatus("Loading version…");
    try {
      const p = await setActiveVersion(id);
      const corrected = await correctDurations(p);
      onProject(corrected ?? p);
      setActiveId(id);
      setStatus("Version loaded");
    } catch {
      setStatus("Could not load that version");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minHeight: 0, overflowY: "auto" }}>
      <div style={{ ...box, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Text-to-video</div>

        <label style={{ ...label }}>Topic</label>
        <textarea
          rows={2}
          value={topic}
          disabled={running}
          placeholder="e.g. The life of honeybees"
          onChange={(e) => setTopic(e.target.value)}
          style={{ ...input, resize: "vertical", fontFamily: "inherit" }}
        />

        <label style={{ ...label }}>Title (optional)</label>
        <input
          value={title}
          disabled={running}
          placeholder="Leave blank to use the topic"
          onChange={(e) => setTitle(e.target.value)}
          style={{ ...input }}
        />

        {/* Image source: which AI creates the stills (or none -> animated text) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "10px 12px",
            borderRadius: 8,
            border: `1px solid ${c.border}`,
            background: c.panel2,
          }}
        >
          <span style={{ fontSize: 12, color: c.text }}>Who creates the images?</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(
              [
                ["", "Auto"],
                ["fal", "fal.ai"],
                ["pollinations", "Free AI"],
                ["typography", "Text posters"],
                ["off", "Off"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                disabled={running}
                onClick={() => setImageProvider(value)}
                style={{
                  ...btn,
                  flex: 1,
                  whiteSpace: "nowrap",
                  background: imageProvider === value ? c.accent : c.panel,
                  color: imageProvider === value ? c.text : c.dim,
                  border: `1px solid ${imageProvider === value ? c.accent : c.border}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 11, color: c.dim }}>
            {imageProvider === "off"
              ? "No images — animated typography video."
              : imageProvider === "pollinations"
                ? "Pollinations.ai — free, no API key required."
                : imageProvider === "fal"
                  ? "fal.ai — best quality, needs FAL_KEY in .env."
                  : imageProvider === "typography"
                    ? "Text posters — each scene is designed typography with a different font, no AI needed."
                    : "Auto — fal.ai if a key is set, otherwise the free Pollinations.ai."}
          </span>
        </div>

        <label style={{ ...label }}>Your images (optional)</label>
        <button style={btn} disabled={running} onClick={simulatePicker}>
          Upload image(s)
        </button>
        {uploadedImages.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {uploadedImages.map((a, i) => (
              <span
                key={a.src}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: c.panel2,
                  border: `1px solid ${c.border}`,
                }}
              >
                <span>{i + 1}. {a.name}</span>
                <button
                  onClick={() => removeUploadedImage(a.src)}
                  style={{ background: "none", border: "none", color: c.dim, cursor: "pointer", fontSize: 12 }}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={{ ...label }}>Dimensions</label>
            <select
              value={`${dimension.w}x${dimension.h}`}
              disabled={running}
              onChange={(e) => {
                const d = DIMENSIONS.find((x) => `${x.w}x${x.h}` === e.target.value);
                if (d) setDimension({ w: d.w, h: d.h });
              }}
              style={{ ...input, width: "100%" }}
            >
              {DIMENSIONS.map((d) => (
                <option key={`${d.w}x${d.h}`} value={`${d.w}x${d.h}`}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ ...label }}>Look &amp; feel</label>
            <select
              value={style}
              disabled={running}
              onChange={(e) => setStyle(e.target.value)}
              style={{ ...input, width: "100%" }}
            >
              {STYLES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ width: 140 }}>
            <label style={{ ...label }}>Scenes</label>
            <select
              value={numScenes ?? ""}
              disabled={running}
              onChange={(e) => {
                const v = e.target.value;
                setNumScenes(v === "" ? undefined : Number(v));
              }}
              style={{ ...input, width: "100%" }}
            >
              <option value="">Auto — AI decides</option>
              {[2, 3, 4, 5, 6, 7, 8].map((nv) => (
                <option key={nv} value={nv}>
                  {nv} scenes
                </option>
              ))}
            </select>
          </div>
          <div style={{ width: 110 }}>
            <label style={{ ...label }}>Length</label>
            <select
              value={targetDuration ?? ""}
              disabled={running}
              onChange={(e) => {
                const v = Number(e.target.value);
                setTargetDuration(Number.isFinite(v) ? v : undefined);
              }}
              style={{ ...input, width: "100%" }}
            >
              <option value="">Auto</option>
              <option value={10}>~10 s</option>
              <option value={15}>~15 s</option>
              <option value={30}>~30 s</option>
              <option value={60}>~60 s</option>
            </select>
          </div>
        </div>

        <button
          style={{ ...primaryBtn, fontWeight: 700, opacity: running ? 0.6 : 1 }}
          disabled={running || !topic.trim()}
          onClick={() => void generate()}
        >
          {running ? "Creating…" : "Generate video"}
        </button>
      </div>

      {jobs.length > 0 && (
        <div style={{ ...box, padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: c.dim }}>Progress</div>
          {jobs.map((job) => {
            const s = jobStatuses[job.jobId];
            const state = s?.status ?? "running";
            const current =
              s && s.steps.length > 0
                ? (s.steps.find((st) => !st.done)?.label ?? s.steps[s.steps.length - 1].label!)
                : "Queued…";
            return (
              <div key={job.jobId} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                <span>{state === "done" ? "Done" : state === "error" ? "Error" : "..."}</span>
                <span style={{ color: state === "error" ? c.danger : c.text }}>
                  {s?.status === "done" ? "ready" : s?.error ?? current}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <div
          style={{
            ...box,
            padding: 12,
            fontSize: 12.5,
            color: c.danger,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {error}
        </div>
      )}

      {versions.length > 0 && (
        <div style={{ ...box, padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: c.dim }}>Generated versions</div>
          {versions
            .slice()
            .reverse()
            .map((v) => (
              <button
                key={v.id}
                onClick={() => void loadVersion(v.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 10px",
                  borderRadius: 8,
                  border: `1px solid ${activeId === v.id ? c.accent : c.border}`,
                  background: activeId === v.id ? c.accent : c.panel2,
                  color: activeId === v.id ? "#fff" : c.text,
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 12,
                }}
              >
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {v.title}
                </span>
                <span style={{ fontSize: 10.5, opacity: 0.75 }}>{FORMAT_LABEL[v.format]}</span>
              </button>
            ))}
        </div>
      )}

      <p style={{ fontSize: 12, color: c.dim, lineHeight: 1.6 }}>
        Type a topic and hit Generate. Pick who creates the images: <b>fal.ai</b> (best quality,
        needs FAL_KEY in .env), <b>Free AI</b> (Pollinations.ai — no key needed), or <b>Text posters</b>
        (typographic designs that rotate fonts — works offline). <b>Off</b> makes an animated-text video.
        Upload your own images to use them instead. Set <b>Length</b> to ~10 s for a short clip.
      </p>
    </div>
  );
};
