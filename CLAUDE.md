# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this project is

An AI video editor built on Remotion + React + Express. Users chat with Claude to
edit a timeline (**Editor** mode), generate whole narrated videos from a topic
(**Creator** mode), or generate single images (**Image** mode). See `README.md`
for the user-facing description.

## Commands

```console
npm install
cp .env.example .env     # add ANTHROPIC_API_KEY (FAL_KEY / ELEVENLABS_API_KEY optional)
npm run dev              # Express server (:3001) + Vite app (:5173/app/)
npm run lint             # eslint src server app && tsc  — run before finishing
npm run render           # render GeneratedVideo -> out/video.mp4
npm run studio           # Remotion Studio
```

There is no test suite; `npm run lint` (ESLint + `tsc`) is the check to run.

## Architecture

- `app/` – Vite/React editor UI (`App.tsx` switches editor / creator / image modes; `api.ts` wraps server calls).
- `server/index.ts` – Express API on :3001: uploads, project state, `/api/chat` (Claude tool loop), `/api/render`, `/api/download`, `/api/create*`, `/api/image/create`.
- `server/creator.ts` – Creator pipeline run as a background job: storyboard (Claude) → voice-over (ElevenLabs) → images (fal.ai / Pollinations / typography) → `Project`.
- `src/project/types.ts` – the shared data model (`Project`, `Scene`, overlays, `TextEffectKey`, `TransitionKind`).
- `src/project/operations.ts` – pure functions that edit a `Project`; one per AI tool. Scene numbers in the public API are **1-based**.
- `src/project/tools.ts` – Claude tool schemas + system prompt. Each tool maps to an operation.
- `src/GeneratedVideo/` – the Remotion composition rendered from project data.
- `src/generated/CustomScenes.tsx` – LLM-written animation code produced by Creator; treat as generated output.
- `public/project.json`, `public/uploads/`, `public/creator-versions.json` – runtime state/media (uploads are gitignored).
- `build/` – committed Remotion bundle output; do not hand-edit.

The `@shared/*` alias points to `src/*` (used from `app/`).

## Conventions

- TypeScript, 2-space indent (see `.prettierrc`). Match the surrounding style and comment density.
- Operations are immutable: take a `Project`, return a new one plus a short message (use the `clone` helper).
- To add a new AI editing capability: add the operation in `operations.ts`, its schema in `tools.ts`, and handle it in the `/api/chat` tool loop in `server/index.ts`; extend `types.ts` if the data model changes.
- Scenes are generated from project data — change them via the app/operations, not the Remotion Studio timeline.
- Never commit `.env` or API keys. Keys are read from env vars only (`ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `FAL_KEY`, `FAL_IMAGE_MODEL`, `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`).
- Rendering shells out to `npx remotion render` and Creator shells out to `npx tsc`, so devDependencies must remain installed in production (see `Dockerfile`).

## Remotion skills

Remotion best-practice skills live in `.agents/skills/remotion-best-practices/` and `.claude/skills/`; consult them when writing compositions, animations, captions or audio code.
