// Helper server for the AI Video Editor app.
//
//   POST   /api/upload    multipart file(s)   -> saves to public/uploads, returns assets
//   GET    /api/project                       -> current public/project.json
//   POST   /api/project   { project }          -> writes public/project.json
//   DELETE /api/asset     { src }              -> removes an asset + scenes that use it
//   POST   /api/render                         -> renders GeneratedVideo to out/video.mp4
//   GET    /api/download                       -> downloads the last rendered mp4
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

app
  .listen(PORT, () => {
    console.log(`\n  Video Builder server on http://localhost:${PORT}`);
    const k = process.env.ANTHROPIC_API_KEY?.trim();
    console.log(
      `  Model: ${MODEL}   API key: ${
        k ? `${k.slice(0, 11)}…${k.slice(-4)} (len ${k.length})` : "MISSING — add it to .env"
      }`,
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
