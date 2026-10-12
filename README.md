# AI Video Editor

An AI-powered video editor and generator built on [Remotion](https://www.remotion.dev),
React and Express. Chat with Claude to edit a timeline, or type a topic and let
**Creator mode** produce a complete narrated video for you.

The editor app has three modes (tabs at the top of the sidebar):

| Mode | What it does |
| --- | --- |
| **Editor** | Chat with Claude, drop in media, and edit scenes, overlays and audio. Live preview + manual inspector. |
| **Creator** | Enter a topic → Claude writes a storyboard, ElevenLabs narrates it, images are generated, and a finished video is assembled automatically. |
| **Image** | Generate a single AI image (or typographic poster) and add it to your media library. |

---

## Features

### Editor mode
- **Media library** – upload videos, images and music (click *＋ Add files* or drag & drop). Clip length is read on upload; a video scene keeps the whole clip by default. Delete files with the ✕ on a thumbnail (scenes using them are removed too).
- **Chat-driven editing** – select thumbnails (blue ring) and describe the edit, e.g.
  - “Make a 15s slideshow from my photos with a fade between each”
  - “Add ‘SUMMER 2026’ over the video, big, top centre”
  - “Trim scene 2 to 4s and slow it to 0.5x”
  - “Split scene 1 in half, then put my music under everything at 40%”
- **Quick-add** – the *＋* on a thumbnail drops the asset straight into the video.
- **Scene inspector** – hand-edit every scene, text overlay, speed, transition and the audio track.
- **Live preview** – powered by `@remotion/player`; updates instantly as Claude edits.
- **Download MP4** – renders the finished video server-side and downloads it.

Claude edits the timeline through tool calls (`server/index.ts` → `/api/chat`):
`add_text_scene`, `add_image_scene`, `add_video_scene`, `add_slideshow`,
`add_text_overlay`, `remove_overlays`, `split_scene`, `trim_scene`, `set_speed`,
`set_duration`, `reorder_scene`, `delete_scene`, `set_transition`
(`none` / `fade` / `slide` / `wipe`), `set_audio`, `remove_audio`,
`remove_asset`, `set_project`, `clear_scenes`.

### Creator mode
1. Claude writes a storyboard (narration + image prompt per scene).
2. ElevenLabs renders each narration line as a voice-over.
3. Images are generated per scene.
4. Everything is assembled into a project and loaded into the preview.

Options: topic, title, style (cinematic, travel vlog, nature, tech explainer, inspirational…), number of scenes, target duration, and output size (16:9 720p/1080p, 9:16 vertical, 1:1 square). You can generate several **formats** at once, one video each:
- **Images** – AI-generated stills with voice-over
- **Text** – typography scenes
- **Animated text** – text with animated effects (explosive, melt, matrix, glitch, neon, wavy, typewriter, 3D spin, and more)
- **Mix**

Generated versions are listed and switchable; the LLM-written animation code lives in `src/generated/CustomScenes.tsx` and can be opened in your editor from the app (hot-reloads on save).

### Image mode / image providers
| Provider | Key needed | Notes |
| --- | --- | --- |
| **fal.ai** | `FAL_KEY` | Best quality; default when a key is set |
| **Pollinations.ai** | none | Free AI images; default when no `FAL_KEY` |
| **Typography poster** | none | Text rendered as a poster with rotating fonts, no AI |

---

## Getting started

**Requirements:** Node.js 20+ and an [Anthropic API key](https://console.anthropic.com).

```console
npm install
cp .env.example .env     # then edit .env and add your keys
npm run dev              # helper server (:3001) + editor app (:5173)
```

Open **http://localhost:5173/app/** (it opens automatically). If port 3001 is stuck: `npx kill-port 3001`.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Yes | Chat editing and Creator storyboards |
| `ANTHROPIC_MODEL` | No | Override the Claude model (default `claude-sonnet-5`) |
| `FAL_KEY` | No | fal.ai image generation |
| `FAL_IMAGE_MODEL` | No | Override the fal.ai image model |
| `ELEVENLABS_API_KEY` | No | AI voice-over in Creator mode |
| `ELEVENLABS_VOICE_ID` | No | Voice to use (default Rachel `21m00Tcm4TlvDq8ikWAM`) |

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run server and editor app together |
| `npm run server` | Express API only (port 3001) |
| `npm run app` | Vite editor UI only (port 5173) |
| `npm run studio` | Open Remotion Studio |
| `npm run render` | Render `GeneratedVideo` to `out/video.mp4` |
| `npm run build` | Bundle the Remotion project |
| `npm run lint` | ESLint + TypeScript check |
| `npm run upgrade` | Upgrade Remotion |

---

## Project structure

| Path | Purpose |
| --- | --- |
| `app/` | Editor UI: `Chat`, `AssetTray`, `Preview`, `Inspector`, `Creator`, `ImageMaker` |
| `server/index.ts` | Express API (port 3001) |
| `server/creator.ts` | Creator pipeline: storyboard → voice-over → images → project |
| `src/project/types.ts` | Shared data model |
| `src/project/operations.ts` | Timeline edit operations (one per AI tool) |
| `src/project/tools.ts` | Tool schema + system prompt for Claude |
| `src/GeneratedVideo/` | Video composition: image/video/text scenes, overlays, text effects |
| `src/generated/CustomScenes.tsx` | LLM-generated animation code |
| `public/project.json` | Saved project state |
| `public/uploads/` | Uploaded and generated media |
| `public/creator-versions.json` | Creator-generated video versions |

Scenes in `GeneratedVideo` are generated from project data — edit them in the app, not the Studio timeline.

### API endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET / POST | `/api/project` | Load / save project |
| POST | `/api/upload` | Upload media (up to 20 files) |
| DELETE | `/api/asset` | Delete an uploaded asset |
| POST | `/api/chat` | Claude tool loop for editing |
| POST | `/api/image/create` | Generate a single image |
| POST | `/api/create` | Start a Creator job |
| GET | `/api/create/status/:id` | Poll Creator job progress |
| GET | `/api/creator-versions` | List generated versions |
| POST | `/api/creator-versions/set` | Activate a version |
| POST | `/api/code/open` | Open generated animation code in your editor |
| POST | `/api/render` | Render the video to MP4 |
| GET | `/api/download` | Download the rendered MP4 |

---

## Docker / Dokploy deployment

A single container runs the API, serves the built UI and renders videos (Chrome is installed at build time).

```console
docker compose up -d --build     # editor served on http://localhost:3001
```

Set `ANTHROPIC_API_KEY` (and optionally `FAL_KEY`, `ELEVENLABS_API_KEY`, `APP_PORT`) in your environment or Dokploy `.env`. Named volumes persist `public/` (uploads, project) and `out/` (renders) across redeploys.

---

## Notes
- Rendering a one-minute video takes a couple of minutes — keep the tab open.
- Docs: [Remotion fundamentals](https://www.remotion.dev/docs/the-fundamentals) · Help: [Remotion Discord](https://discord.gg/6VzzNDwUwV)
- Remotion may require a company license for some uses: [read the terms](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
