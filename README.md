# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## AI Video Editor

A standalone editor app: a **chat sidebar** on the left (talk to Claude, drop
media), a **live preview** and a **scene inspector** on the right. Claude edits
the timeline; the preview updates instantly.

### One-time setup

```console
cp .env.example .env          # then edit .env and paste your ANTHROPIC_API_KEY
```

### Run

```console
npm run dev                   # helper server (:3001) + editor app (:5173)
```

Your browser opens **http://localhost:5173/app/** automatically. (`npm run server`
/ `npm run app` run them separately. If port 3001 is stuck: `npx kill-port 3001`.)

### Use it

1. **Add media** – click *＋ Add files* or drag a video / images / music
   anywhere onto the sidebar. Each clip's length is read on upload; a video
   scene keeps the **whole clip** by default. Hover a thumbnail for **✕** to
   delete a file (and any scenes using it).
2. **Attach + chat** – click media thumbnails to select them (they get a blue
   ring), then type what you want. Or just describe it:
   - “Make a 15s slideshow from my photos with a fade between each”
   - “Add ‘SUMMER 2026’ over the video, big, top centre”
   - “Trim scene 2 to 4s and slow it to 0.5x”
   - “Split scene 1 in half, then put my music under everything at 40%”
3. **Quick-add** – the *＋* on a thumbnail drops that asset straight into the
   video.
4. **Fine-tune** – the inspector under the preview edits every scene, overlay,
   speed and the audio track by hand.

Everything saves to `public/project.json`. Click **⬇ Download MP4** (top right) to
render and download the finished video — a one-minute video takes a couple of
minutes, so leave the tab open. (`npm run render` does the same from a terminal;
`npm run studio` opens Remotion Studio.)

### How it fits together

| Piece | File |
| --- | --- |
| Editor app (sidebar chat + preview + inspector) | `app/` |
| Live preview (`@remotion/player`) | `app/components/Preview.tsx` |
| Timeline edit operations (one per AI tool) | `src/project/operations.ts` |
| Tool schema + system prompt for Claude | `src/project/tools.ts` |
| Video assembled from the project data | `src/GeneratedVideo/` |
| Text overlays (text on top of a scene) | `src/GeneratedVideo/scenes/Overlays.tsx` |
| Shared data model | `src/project/types.ts` |
| Server: uploads, project state, `/api/render` + `/api/download`, `/api/chat` (Claude tool loop) | `server/index.ts` (port 3001) |
| Saved project state / uploaded media | `public/project.json`, `public/uploads/` |

Scenes in `GeneratedVideo` are generated from the project data, so edit them in
the app rather than the Studio timeline.

## Commands

**Install Dependencies**

```console
npm i
```

**Start builder + preview**

```console
npm run dev
```

**Render the generated video**

```console
npm run render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
