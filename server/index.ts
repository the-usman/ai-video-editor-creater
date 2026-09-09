// Helper server for the AI Video Editor app.
//
//   POST   /api/upload    multipart file(s)   -> saves to public/uploads, returns assets
//   GET    /api/project                       -> current public/project.json
//   POST   /api/project   { project }          -> writes public/project.json
//   DELETE /api/asset     { src }              -> removes an asset + scenes that use it
//   POST   /api/render                         -> renders GeneratedVideo to out/video.mp4
//   GET    /api/download                       -> downloads the last rendered mp4
//   POST   /api/image/create  { prompt, provider, width, height } -> makes a downloadable image
//   POST   /api/chat      { messages, project } -> Claude turns the chat into timeline edits
//
// Run from the project root:  npm run server   (uses tsx so it can share src/project/*)

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import cors from "cors";
import express from "express";
import multer from "multer";
import { defaultProject } from "../src/project/defaultProject";
import { applyAction, describeProject, OperationError } from "../src/project/operations";
import { SYSTEM_PROMPT, toolDefinitions } from "../src/project/tools";
import {
  createJobs,
  generateImage,
  newJobId,
  renderTypographySvg,
  runCreateJob,
  type CreateJob,
  type ImageProvider,
} from "./creator";
import type { AssetKind, Project } from "../src/project/types";

// --- tiny .env loader (KEY=VALUE lines, no deps) ---------------------------
// The local .env always wins, so a stale ANTHROPIC_API_KEY in the shell / system
// environment can't shadow it and cause confusing 401s.
const envPath = join(process.cwd(), ".env");
if (existsSync(envPath)) {
  for (const raw of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[m[1]] = value.trim();
  }
}

const PORT = 3001;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

const publicDir = join(process.cwd(), "public");
const uploadsDir = join(publicDir, "uploads");
const projectFile = join(publicDir, "project.json");
const outDir = join(process.cwd(), "out");
const outFile = join(outDir, "video.mp4");

mkdirSync(uploadsDir, { recursive: true });
if (!existsSync(projectFile)) {
  writeFileSync(projectFile, JSON.stringify(defaultProject, null, 2));
}

const readProject = (): Project => {
  try {
    return JSON.parse(readFileSync(projectFile, "utf8")) as Project;
  } catch {
    return defaultProject;
  }
};
const writeProject = (project: Project) =>
  writeFileSync(projectFile, JSON.stringify(project, null, 2));

// --- uploads --------------------------------------------------------------
const videoExt = new Set([".mp4", ".webm", ".mov", ".mkv", ".m4v"]);
const audioExt = new Set([".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac"]);
const kindFor = (ext: string): AssetKind =>
  videoExt.has(ext) ? "video" : audioExt.has(ext) ? "audio" : "image";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    const base = file.originalname
      .slice(0, -ext.length || undefined)
      .replace(/[^a-z0-9_-]+/gi, "-")
      .slice(0, 40)
      .replace(/^-+|-+$/g, "");
    cb(null, `${Date.now()}-${base || "file"}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

// --- app -----------------------------------------------------------------
const app = express();
app.use(cors());
app.use(express.json({ limit: "12mb" }));
app.use("/uploads", express.static(uploadsDir));

app.get("/api/project", (_req, res) => {
  res.type("json").send(readFileSync(projectFile, "utf8"));
});

app.post("/api/project", (req, res) => {
  const project = (req.body?.project ?? req.body) as Project;
  if (!project || !Array.isArray(project.scenes)) {
    return res.status(400).json({ error: "Body must be a project with a scenes array" });
  }
  writeProject(project);
  res.json({ ok: true });
});

app.post("/api/upload", upload.array("files", 20), (req, res) => {
  const files = (req.files as Express.Multer.File[]) ?? [];
  const assets = files.map((file) => ({
    name: file.originalname,
    src: `uploads/${file.filename}`,
    kind: kindFor(extname(file.filename).toLowerCase()),
  }));
  res.json({ assets });
});

// Delete an uploaded asset: drop it from the project, remove scenes that use it,
// and delete the file from disk if nothing else references it.
app.delete("/api/asset", (req, res) => {
  const src = String(req.body?.src ?? "");
  if (!src) return res.status(400).json({ error: "src is required" });
  try {
    const before = readProject();
    const { project } = applyAction(before, "remove_asset", { asset: src });
    writeProject(project);

    const stillUsed =
      project.assets.some((a) => a.src === src) ||
      project.scenes.some((s) => "src" in s && s.src === src) ||
      project.audio?.src === src;
    if (!stillUsed && src.startsWith("uploads/")) {
      // Best effort — the file may be locked (open in a preview). The asset is
      // gone from the project either way; a stray file in public/uploads is harmless.
      try {
        rmSync(join(uploadsDir, basename(src)), { force: true });
      } catch {
        /* leave the file on disk */
      }
    }
    res.json({ project });
  } catch (err) {
    const msg = err instanceof OperationError ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

// --- code editor ---------------------------------------------------------
// The generated animation code lives in src/generated/CustomScenes.tsx. The
// "Open in editor" button opens this file in the user's installed editor
// (VS Code's `code` CLI preferred, else the OS-default app) so they can edit
// the LLM-written animation code however they like.

const codeFile = join(process.cwd(), "src", "generated", "CustomScenes.tsx");

const launchEditor = (path: string): void => {
  const fallback = () => {
    if (process.platform === "darwin") spawn("open", [path]).unref();
    else if (process.platform === "win32") spawn("cmd", ["/c", "start", "", path], { shell: true }).unref();
    else spawn("xdg-open", [path]).unref();
  };
  const code = spawn("code", [path], { cwd: process.cwd(), shell: process.platform === "win32" });
  code.on("error", fallback);
  code.on("close", (exitCode) => {
    if (exitCode !== 0) fallback();
  });
};

app.post("/api/code/open", (_req, res) => {
  if (!existsSync(codeFile)) {
    return res
      .status(404)
      .json({ error: "No animation code yet — generate a Text / Animated text video in Creator mode first." });
  }
  try {
    launchEditor(codeFile);
    res.json({ ok: true, message: `Opened in your editor — save the file there and the preview updates automatically.` });
  } catch (err) {
    res.status(500).json({ error: `Could not open the editor: ${String(err)}` });
  }
});

// --- render + download --------------------------------------------------
let rendering = false;

const safeName = (title: string) =>
  (title || "video")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "video";

app.post("/api/render", (_req, res) => {
  if (rendering) {
    return res.status(409).json({ error: "A render is already running — wait for it to finish." });
  }
  const project = readProject();
  if (!Array.isArray(project.scenes) || project.scenes.length === 0) {
    return res.status(400).json({ error: "Add at least one scene before rendering." });
  }

  rendering = true;
  mkdirSync(outDir, { recursive: true });

  const child = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["remotion", "render", "GeneratedVideo", "out/video.mp4", "--log=error"],
    { cwd: process.cwd(), shell: process.platform === "win32" },
  );

  let stderr = "";
  child.stderr.on("data", (d: Buffer) => {
    stderr += d.toString();
  });
  child.stdout.on("data", () => {});

  child.on("error", (err) => {
    rendering = false;
    res.status(500).json({ error: `Could not start the renderer: ${String(err)}` });
  });
  child.on("close", (code) => {
    rendering = false;
    if (code === 0 && existsSync(outFile)) {
      res.json({ ok: true, name: `${safeName(project.title)}.mp4` });
    } else {
      res.status(500).json({
        error: `Render failed (exit ${code}).\n${stderr.slice(-800) || "no output"}`,
      });
    }
  });
});

app.get("/api/download", (req, res) => {
  if (!existsSync(outFile)) {
    return res.status(404).json({ error: "Nothing has been rendered yet." });
  }
  const name = typeof req.query.name === "string" ? req.query.name : "video.mp4";
  res.download(outFile, name.endsWith(".mp4") ? name : `${name}.mp4`);
});

// --- standalone image maker ------------------------------------------------
// POST /api/image/create  { prompt, provider, width, height, imageModel }
// Creates ONE downloadable image (AI or typographic SVG poster) from text.
const clampInt = (v: unknown, lo: number, hi: number, fallback: number): number => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(Math.min(hi, Math.max(lo, n))) : fallback;
};

app.post("/api/image/create", async (req, res) => {
  const falKey = process.env.FAL_KEY?.trim() ?? "";
  const prompt = String(req.body?.prompt ?? "").trim();
  const rawProvider = String(req.body?.provider ?? "auto").toLowerCase();
  const provider: ImageProvider =
    rawProvider === "fal" || rawProvider === "pollinations" || rawProvider === "typography"
      ? rawProvider
      : falKey
        ? "fal"
        : "pollinations";
  const width = clampInt(req.body?.width, 320, 2048, 1280);
  const height = clampInt(req.body?.height, 320, 2048, 720);
  if (!prompt) return res.status(400).json({ error: "Type a description first." });
  if (provider === "fal" && !falKey) {
    return res.status(400).json({
      error: "fal.ai needs a FAL_KEY in .env — pick the Free AI or Text poster option instead.",
    });
  }

  const fileBase = `img-standalone-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const ext = provider === "typography" ? ".svg" : ".jpg";
  const outFile = join(uploadsDir, "generated", `${fileBase}${ext}`);
  try {
    if (provider === "typography") {
      // The image IS the text: a typographic poster set in a rotated font.
      const { svg } = renderTypographySvg(prompt, width, height);
      mkdirSync(join(outFile, ".."), { recursive: true });
      writeFileSync(outFile, svg, "utf8");
    } else {
      await generateImage(
        provider,
        falKey,
        String(req.body?.imageModel ?? ""),
        `${prompt}. highly detailed, cinematic`,
        outFile,
        width,
        height,
      );
    }
    const name = basename(outFile);
    return res.json({ src: `/uploads/generated/${name}`, name });
  } catch (err) {
    return res.status(500).json({ error: `Image failed: ${String(err)}` });
  }
});

// --- chat --------------------------------------------------------------
type ChatTurn = { role: "user" | "assistant"; content: string };

app.post("/api/chat", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    return res.status(400).json({
      error:
        "No ANTHROPIC_API_KEY. Copy .env.example to .env and add your key, then restart the server.",
    });
  }
  if (!apiKey.startsWith("sk-ant-")) {
    return res.status(400).json({
      error: `The ANTHROPIC_API_KEY in .env doesn't look right (starts with "${apiKey.slice(0, 6)}…", length ${apiKey.length}). It should start with "sk-ant-". Check for quotes, spaces or line breaks in .env.`,
    });
  }

  const history = (req.body?.messages ?? []) as ChatTurn[];
  const incoming = (req.body?.project ?? readProject()) as Project;
  if (!Array.isArray(incoming.scenes)) {
    return res.status(400).json({ error: "Invalid project" });
  }

  const client = new Anthropic({ apiKey });
  let working: Project = incoming;
  const applied: string[] = [];

  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    for (let step = 0; step < 8; step++) {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        system: `${SYSTEM_PROMPT}\n\nCURRENT PROJECT STATE:\n${describeProject(working)}`,
        tools: toolDefinitions,
        messages,
      });

      messages.push({ role: "assistant", content: response.content });

      const toolUses = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
      );

      if (toolUses.length === 0) {
        const text = response.content
          .filter((b): b is Anthropic.TextBlock => b.type === "text")
          .map((b) => b.text)
          .join("\n")
          .trim();
        writeProject(working);
        return res.json({
          reply: text || "Done.",
          project: working,
          actions: applied,
        });
      }

      const results: Anthropic.ToolResultBlockParam[] = [];
      for (const use of toolUses) {
        try {
          const out = applyAction(working, use.name, (use.input ?? {}) as Record<string, unknown>);
          working = out.project;
          applied.push(use.name);
          results.push({ type: "tool_result", tool_use_id: use.id, content: out.message });
        } catch (err) {
          const msg = err instanceof OperationError ? err.message : String(err);
          results.push({
            type: "tool_result",
            tool_use_id: use.id,
            content: `Error: ${msg}`,
            is_error: true,
          });
        }
      }
      messages.push({ role: "user", content: results });
    }

    writeProject(working);
    res.json({
      reply: "Made the changes (stopped after several steps).",
      project: working,
      actions: applied,
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return res.status(401).json({
        error:
          `Claude rejected the API key (401). The key ends with "…${apiKey.slice(-4)}". ` +
          `Make sure .env has the full key with no quotes/spaces, that this key belongs to a ` +
          `workspace with credit, and restart: npm run server`,
      });
    }
    const status = err instanceof Anthropic.APIError ? err.status ?? 500 : 500;
    res.status(status).json({ error: `Claude error: ${String(err)}` });
  }
});

// --- creator mode (fal.ai images + ElevenLabs voiceover) -----------------
// POST /api/create            { topic, title?, style?, numScenes?, formats[]? }
//                            -> { jobs: [{ jobId, format, title }] }
// GET  /api/create/status/:id -> { status, steps, log, result?, error? }
// GET  /api/creator-versions  -> list of generated videos (one per format)
// POST /api/creator-versions/set  { id } -> make a version the active project

const FORMATS = ["images", "text", "animated", "mix"] as const;
type CreateFormatId = (typeof FORMATS)[number];

const FORMAT_LABELS: Record<CreateFormatId, string> = {
  images: "Images",
  text: "Text",
  animated: "Animated text",
  mix: "Image + text",
};

const versionsFile = join(publicDir, "creator-versions.json");
type CreatorVersion = {
  id: string;
  format: CreateFormatId;
  title: string;
  createdAt: number;
  project: Project;
};
const readVersions = (): CreatorVersion[] => {
  try {
    const arr = JSON.parse(readFileSync(versionsFile, "utf8")) as CreatorVersion[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};
const writeVersions = (versions: CreatorVersion[]) =>
  writeFileSync(versionsFile, JSON.stringify(versions, null, 2));

const prunedJobs = () => {
  if (createJobs.size <= 50) return;
  const oldest = [...createJobs.values()].sort((a, b) => a.createdAt - b.createdAt);
  for (const job of oldest.slice(0, createJobs.size - 50)) {
    createJobs.delete(job.id);
  }
};

app.post("/api/create", (req, res) => {
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim() ?? "";
  const falKey = process.env.FAL_KEY?.trim() ?? "";
  const elevenKey = process.env.ELEVENLABS_API_KEY?.trim() ?? "";
  const topic = String(req.body?.topic ?? "").trim();
  const baseTitle = String(req.body?.title ?? "").trim() || topic;
  const style = String(req.body?.style ?? "").trim();
  const rawNumScenes = Number(req.body?.numScenes);
  const numScenes = Number.isFinite(rawNumScenes) && rawNumScenes >= 2 ? Math.round(rawNumScenes) : undefined;
  const targetDuration = Number(req.body?.targetDuration);
  const targetSeconds = Number.isFinite(targetDuration) && targetDuration >= 5 ? Math.round(targetDuration) : undefined;
  const reqWidth = Number(req.body?.width);
  const reqHeight = Number(req.body?.height);
  const width = Number.isFinite(reqWidth) && reqWidth > 0 ? Math.round(reqWidth) : undefined;
  const height = Number.isFinite(reqHeight) && reqHeight > 0 ? Math.round(reqHeight) : undefined;

  // One video per selected format.
  const rawFormats = Array.isArray(req.body?.formats)
    ? req.body.formats
    : req.body?.format
      ? [req.body.format]
      : ["images"];
  const formats = [...new Set(rawFormats as unknown[])]
    .filter((f): f is CreateFormatId => typeof f === "string" && (FORMATS as readonly string[]).includes(f))
    .slice(0, 4) as CreateFormatId[];
  if (formats.length === 0) formats.push("images");

  const needsImages = formats.some((f) => f === "images" || f === "mix");
  // Which AI image service to use. "auto" (default) prefers fal.ai when a key
  // is present, otherwise falls back to the free Pollinations.ai. "typography"
  // needs nothing: scenes become text/font posters (no AI images).
  const rawProvider = String(req.body?.imageProvider ?? "auto").toLowerCase();
  const requestedProvider: "fal" | "pollinations" | "typography" | "auto" =
    rawProvider === "fal" || rawProvider === "pollinations" || rawProvider === "typography"
      ? rawProvider
      : "auto";
  const imageProvider: "fal" | "pollinations" | "typography" =
    requestedProvider === "auto" ? (falKey ? "fal" : "pollinations") : requestedProvider;
  const missing: string[] = [];
  if (!anthropicKey) missing.push("ANTHROPIC_API_KEY");
  if (needsImages && imageProvider === "fal" && !falKey) missing.push("FAL_KEY");
  if (!topic) missing.push("a topic");
  if (missing.length) {
    return res.status(400).json({
      error: `Creator mode needs ${missing.join(", ")}. Set the keys in .env and restart the server. In the Creator panel you can also pick the "Free AI" or "Text posters" image source, which need no keys.`,
    });
  }

  // Optional per-request image model override (otherwise .env FAL_IMAGE_MODEL or default).
  const imageModel =
    String(req.body?.imageModel ?? "").trim() || process.env.FAL_IMAGE_MODEL?.trim() || "";
  // Uploaded images to mix into the video: array of public-relative srcs.
  const uploadedImages = Array.isArray(req.body?.uploadedImages)
    ? req.body.uploadedImages.filter((x: unknown): x is string => typeof x === "string" && !!x)
    : [];

  const jobs = formats.map((format) => {
    const job: CreateJob = {
      id: newJobId(),
      topic,
      status: "running" as CreateJob["status"],
      steps: [] as { label: string; done: boolean }[],
      log: [] as string[],
      createdAt: Date.now(),
    };
    createJobs.set(job.id, job);
    return {
      job,
      format,
      title: formats.length > 1 ? `${baseTitle} — ${FORMAT_LABELS[format]}` : baseTitle,
    };
  });
  prunedJobs();

  res.json({
    jobs: jobs.map(({ job, format, title }) => ({ jobId: job.id, format, title })),
  });

  // Run formats one after another so they don't step on project.json.
  void (async () => {
    for (const { job, format, title } of jobs) {
      try {
        const project = await runCreateJob(job, {
          topic,
          title,
          style,
          numScenes,
          targetDuration: targetSeconds,
          width,
          height,
          format,
          imageModel,
          imageProvider,
          uploadedImages,
          anthropicKey,
          anthropicModel: process.env.ANTHROPIC_MODEL,
          falKey,
          elevenKey,
          voiceId: process.env.ELEVENLABS_VOICE_ID?.trim(),
          readProject,
          writeProject,
        });
        if (job.status === "done") {
          const versions = readVersions();
          versions.push({ id: job.id, format, title: project.title, createdAt: Date.now(), project });
          writeVersions(versions.slice(-24));
        }
      } catch {
        /* status/error already set inside runCreateJob */
      }
    }
  })();
});

app.get("/api/create/status/:id", (req, res) => {
  const job = createJobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: "Unknown job. Start a new one." });
  res.json({
    status: job.status,
    steps: job.steps,
    log: job.log,
    result: job.status === "done" ? job.result : undefined,
    error: job.error,
    topic: job.topic,
  });
});

app.get("/api/creator-versions", (_req, res) => {
  res.json({ versions: readVersions().map((v) => ({ id: v.id, format: v.format, title: v.title, createdAt: v.createdAt })) });
});

app.post("/api/creator-versions/set", (req, res) => {
  const id = String(req.body?.id ?? "");
  const version = readVersions().find((v) => v.id === id);
  if (!version) return res.status(404).json({ error: "Unknown version." });
  writeProject(version.project);
  res.json({ project: version.project });
});

// --- production static app -------------------------------------------------
// In production (`npx vite build`, outputs dist-app/) Express serves the editor
// UI. Kept after the API routes so /api and /uploads always win. Local dev uses
// the Vite dev server instead, so this is a no-op when dist-app is absent.
const distDir = join(process.cwd(), "dist-app");
if (existsSync(distDir)) {
  app.use(express.static(distDir, { maxAge: "1h" }));
  app.get(/^\/(app\/)?$/, (_req, res) => res.sendFile(join(distDir, "index.html")));
}

app
  .listen(PORT, () => {
    console.log(`\n  Video Builder server on http://localhost:${PORT}`);
    const k = process.env.ANTHROPIC_API_KEY?.trim();
    console.log(
      `  Model: ${MODEL}   API key: ${
        k ? `${k.slice(0, 11)}…${k.slice(-4)} (len ${k.length})` : "MISSING — add it to .env"
      }`,
    );
    const fal = process.env.FAL_KEY?.trim();
    const elv = process.env.ELEVENLABS_API_KEY?.trim();
    console.log(
      `  Creator: fal.ai ${fal ? "✓" : "NO KEY"} · images default: ${fal ? "fal.ai" : "free Pollinations.ai"} · typography posters: OK (no key) · ElevenLabs ${elv ? "✓" : "NO KEY"} · voice ${process.env.ELEVENLABS_VOICE_ID?.trim() || "default"} · image model ${process.env.FAL_IMAGE_MODEL?.trim() || "fal-ai/fast-sdxl"}`,
    );
    console.log(`  Project -> ${projectFile}\n`);
  })
  .on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `\n  Port ${PORT} is already in use. Stop the other server (close its terminal` +
          ` or run: npx kill-port ${PORT}) and start this one again.\n`,
      );
      process.exit(1);
    }
    throw err;
  });
