import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { KineticEffect, KineticWord, TextEffectKey, TextScene as TextSceneType } from "../../project/types";
import { TEXT_EFFECT_KEYS, WordFX } from "../effects/TextEffects";

/**
 * Deterministic pseudo-random from a string so layout is stable frame-to-frame
 * (no flickering) but differs per word and per scene.
 */
const seedFrom = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Fallback layout used when a kinetic scene has no per-word spec from the LLM.
 * Places each word inside its own non-overlapping horizontal band, sized to fit
 * the frame (never clipped on portrait), entering from varied creative effects.
 * Deterministic via the text seed.
 */
const heuristicWords = (
  text: string,
  color: string,
  accent: string,
  durationInFrames: number,
  fps: number,
  width: number,
  height: number,
): KineticWord[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const EFFECTS: KineticEffect[] = ["wordpop", "zoom", "zoomcut", "colorcycle", "spin", "char", "multi", "shake", "rotate3d", "slide", "wavy", "neon", "glitch", "melt", "spin3d", "heartbeat", "hologram", "spotlight", "typewriter", "paintReveal", "aurora", "schitts", "marquee3d", "glow3d", "vibrate", "rattle", "error", "blurpop", "fillSweep", "wipeFill", "drawOn", "stackDrop"];
  if (words.length === 0)
    return [
      {
        text,
        x: 0.5,
        y: 0.5,
        size: 0.2,
        rotation: 0,
        color,
        dir: "zoom",
        start: 0,
        dur: 0.6,
        order: 1,
        effect: "zoomcut",
      },
    ];

  const base = seedFrom(text + String(durationInFrames));
  const directions: KineticWord["dir"][] = ["left", "right", "up", "down", "zoom", "pop", "left", "down"];

  const totalWords = words.length;
  // Non-overlapping "bands": each word lives in its own horizontal band so
  // distinct words can never collide on screen (overlap only happens if the
  // user's prompt explicitly asks for stacked text).
  const rowH = 0.76 / totalWords;
  return words.map((w, i) => {
    const r = (base + i * 0.137) % 1;
    const y = 0.12 + rowH * (i + 0.5);
    const x = 0.5 + (r - 0.5) * 0.06;
    const fontPx = Math.min(
      0.2 * height,
      rowH * height * 0.72,
      (width * 0.8) / Math.max(1, w.length * 0.6),
    );
    const size = fontPx / height;
    const rotation = (r - 0.5) * 12;
    const dir = directions[i % directions.length];
    const start = Math.round(((i / totalWords) * durationInFrames * 0.6) / fps) / fps;
    const dur = lerp(0.4, 0.7, r);
    const wordColor = i % 2 === 0 ? color : accent;
    // Alternate creative effects so a scene is never monotonous.
    const effect = EFFECTS[Math.floor((base * 10 + i) % EFFECTS.length)];
    return { text: w, x, y, size, rotation, color: wordColor, dir, start, dur, order: i + 1, effect };
  });
};

/** Render a single kinetic word honoring its chosen creative effect. */
const KineticWordView: React.FC<{
  w: KineticWord;
  width: number;
  height: number;
  fps: number;
  sceneDur: number;
  accent: string;
  fontFamily: string;
}> = ({ w, width, height, fps, sceneDur, accent, fontFamily }) => {
  const frame = useCurrentFrame();
  const offsetPx = Math.max(width, height) * 0.45;
  const startFrame = w.start * fps;
  const durFrames = Math.max(2, Math.round(w.dur * fps));
  const effect = w.effect ?? "slide";

  const fadeIn = interpolate(frame, [startFrame, startFrame + Math.max(2, Math.round(0.15 * fps))], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fontSize = `${w.size * height}px`;
  const basePlacement: React.CSSProperties = {
    position: "absolute",
    left: `${w.x * 100}%`,
    top: `${w.y * 100}%`,
    fontSize,
    fontFamily,
    fontWeight: 800,
    lineHeight: 0.95,
    whiteSpace: "nowrap",
    textShadow: "0 6px 34px rgba(0,0,0,0.45)",
    zIndex: w.order,
  };

  // 40-pattern CSS library (text-animation-library.css port) — any library name
  // the LLM picks renders here. The wrapper only positions the word; the library
  // component owns the transforms/effects (see effects/TextEffects.tsx).
  if (TEXT_EFFECT_KEYS.includes(effect as TextEffectKey)) {
    return (
      <Interactive.Div
        name={`fx-${effect}-${w.text}`}
        style={{
          ...basePlacement,
          display: "inline-block",
          width: "max-content",
          textAlign: "center",
          textShadow: "none",
          transform: "translate(-50%, -50%)",
        }}
      >
        <WordFX text={w.text} fontSize={w.size * height} color={w.color} accent={accent} effect={effect as TextEffectKey} fontFamily={fontFamily} />
      </Interactive.Div>
    );
  }

  // wordpop – words spring up from below one after another (staggered by start),
  // rotating as they land (no more boring straight rise).
  if (effect === "wordpop") {
    const p = interpolate(frame, [startFrame, startFrame + durFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const sign = w.text.length % 2 === 0 ? -1 : 1;
    const sc = interpolate(p, [0, 0.62, 1], [0.18, 1.14, 1]);
    const rot = w.rotation + interpolate(p, [0, 0.7, 1], [sign * 26, sign * -4, 0]);
    return (
      <Interactive.Div
        name={`wordpop-${w.text}`}
        style={{
          ...basePlacement,
          color: w.color,
          opacity: fadeIn,
          transform: `translate(-50%, -50%) translateY(${(1 - p) * 90}px) rotate(${rot}deg) scale(${sc})`,
        }}
      >
        {w.text}
      </Interactive.Div>
    );
  }

  // rotate3d – one dramatic 3D flip-IN that lands and holds (no cheap endless spin).
  if (effect === "rotate3d") {
    const rp = interpolate(frame, [startFrame, startFrame + durFrames + Math.round(0.15 * fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.4)),
    });
    const ry = interpolate(rp, [0, 1], [115, 0]);
    const sc = interpolate(rp, [0, 0.6, 1], [0.6, 1.08, 1]);
    const pulse = 1 + 0.012 * Math.sin(frame * 0.055);
    return (
      <Interactive.Div
        name={`rotate3d-${w.text}`}
        style={{
          ...basePlacement,
          color: w.color,
          opacity: fadeIn,
          transform: `translate(-50%, -50%) perspective(1000px) rotateY(${ry}deg) scale(${sc * pulse})`,
        }}
      >
        {w.text}
      </Interactive.Div>
    );
  }

  // spin – a powered 600° spin that LANDS with overshoot, then sways gently.
  if (effect === "spin") {
    const sp = interpolate(frame, [startFrame, startFrame + durFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.3)),
    });
    const rz = interpolate(sp, [0, 1], [600, 0]);
    const sc = interpolate(sp, [0, 0.55, 1], [0.25, 1.06, 1]);
    const sway =
      interpolate(
        frame,
        [startFrame + durFrames, startFrame + durFrames + Math.round(0.35 * fps)],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      ) *
      Math.sin(frame * 0.06) *
      3.2;
    return (
      <Interactive.Div
        name={`spin-${w.text}`}
        style={{
          ...basePlacement,
          color: w.color,
          opacity: fadeIn,
          transform: `translate(-50%, -50%) rotate(${w.rotation}deg) rotate(${rz}deg) rotate(${sway}deg) scale(${sc})`,
        }}
      >
        {w.text}
      </Interactive.Div>
    );
  }

  // char – reveals the word letter by letter.
  if (effect === "char") {
    return (
      <Interactive.Div
        name={`char-${w.text}`}
        style={{
          ...basePlacement,
          transform: `translate(-50%, -50%) rotate(${w.rotation}deg)`,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {w.text.split("").map((ch, i) => {
          const cs = startFrame + i * Math.max(2, Math.round(0.05 * fps));
          const cp = interpolate(frame, [cs, cs + Math.max(3, Math.round(0.22 * fps))], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.7)),
          });
          return (
            <span
              key={`${w.text}-${i}`}
              style={{
                display: "inline-block",
                color: w.color,
                opacity: cp,
                transform: `translateY(${interpolate(cp, [0, 1], [30, 0])}px) scale(${interpolate(cp, [0, 1], [1.6, 1])})`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </Interactive.Div>
    );
  }

  // zoomcut – the word grows from spec into a SCREEN-FILL zoom (up to 4x),
  // stays giant for a beat, then gets sliced away at the end.
  if (effect === "zoomcut") {
    const ep = interpolate(frame, [startFrame, startFrame + durFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const wordPx = w.size * height * 0.62 * w.text.length;
    const peak = Math.max(1.05, Math.min((0.96 * width) / Math.max(1, wordPx), 4.2));
    const sc = interpolate(ep, [0, 0.6, 1], [0.25, peak, 1]);
    const pulse = 1 + 0.014 * Math.sin(frame * 0.05);
    const cutStart = sceneDur - Math.max(8, Math.round(0.12 * fps));
    const wipe = interpolate(frame, [cutStart, sceneDur], [0, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    });
    return (
      <Interactive.Div
        name={`zoomcut-${w.text}`}
        style={{
          ...basePlacement,
          color: w.color,
          opacity: fadeIn,
          clipPath: `inset(0 ${wipe}% 0 0)`,
          transform: `translate(-50%, -50%) rotate(${w.rotation}deg) scale(${sc * pulse})`,
        }}
      >
        {w.text}
      </Interactive.Div>
    );
  }

  // colorcycle – ghost copies of the same word whose colors rotate one by one.
  if (effect === "colorcycle") {
    const palette = [w.color, accent, "#ffd166", "#4ea8de", "#06d6a0"];
    const step = Math.max(1, Math.round(0.12 * fps));
    const baseIdx = Math.floor(frame / step);
    const ghosts = [
      { ox: 9, oy: -6, s: 1.05, z: w.order },
      { ox: -13, oy: 4, s: 0.96, z: w.order },
      { ox: 20, oy: 9, s: 1.08, z: w.order - 1 },
      { ox: -24, oy: -10, s: 0.94, z: w.order - 2 },
    ];
    return (
      <>
        {ghosts.map((g, i) => (
          <Interactive.Div
            key={`ghost-${w.text}-${i}`}
            name={`colorcycle-${w.text}-${i}`}
            style={{
              ...basePlacement,
              zIndex: g.z,
              color: palette[(baseIdx + i + 1) % palette.length],
              opacity: 0.35,
              transform: `translate(-50%, -50%) translate(${g.ox}px, ${g.oy}px) rotate(${w.rotation}deg) scale(${g.s})`,
            }}
          >
            {w.text}
          </Interactive.Div>
        ))}
        <Interactive.Div
          name={`colorcycle-main-${w.text}`}
          style={{
            ...basePlacement,
            zIndex: w.order + 1,
            color: palette[baseIdx % palette.length],
            opacity: 1,
            transform: `translate(-50%, -50%) rotate(${w.rotation}deg) scale(${1 + 0.018 * Math.sin(frame * 0.08)})`,
          }}
        >
          {w.text}
        </Interactive.Div>
      </>
    );
  }

  // zoom – a camera-style punch: shrink -> zoom in past the frame -> settle,
  // then it keeps breathing slowly in and out (zoom in / zoom out).
  if (effect === "zoom") {
    const zp = interpolate(frame, [startFrame, startFrame + durFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const punch = interpolate(zp, [0, 0.6, 1], [0.3, 1.45, 1]);
    const breathe = 1 + Math.sin(frame * 0.1) * 0.035;
    return (
      <Interactive.Div
        name={`zoom-${w.text}`}
        style={{
          ...basePlacement,
          color: w.color,
          opacity: fadeIn,
          transform: `translate(-50%, -50%) rotate(${w.rotation}deg) scale(${punch * breathe})`,
        }}
      >
        {w.text}
      </Interactive.Div>
    );
  }

  // multi – the word MULTIPLIES: copies burst outward at entry, then fade as the
  // main word settles into place.
  if (effect === "multi") {
    const mf = Math.round(0.34 * fps);
    const copies = 6;
    return (
      <>
        {Array.from({ length: copies }).map((_, k) => {
          const gs = startFrame + k * Math.max(1, Math.round(0.045 * fps));
          const gp = interpolate(frame, [gs, gs + mf], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const ang = (k / copies) * Math.PI * 2;
          const dist = interpolate(gp, [0, 1], [0, 110 + (k % 2) * 50]);
          return (
            <Interactive.Div
              key={`multi-${w.text}-${k}`}
              name={`multi-${w.text}-${k}`}
              style={{
                ...basePlacement,
                zIndex: w.order - k,
                color: w.color,
                opacity: (1 - gp) * 0.65,
                transform: `translate(-50%, -50%) translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) rotate(${w.rotation + (k % 2) * 26}deg) scale(${interpolate(gp, [0, 1], [0.55, 1.25])})`,
              }}
            >
              {w.text}
            </Interactive.Div>
          );
        })}
        <Interactive.Div
          name={`multi-main-${w.text}`}
          style={{
            ...basePlacement,
            zIndex: w.order + 1,
            color: w.color,
            opacity: fadeIn,
            transform: `translate(-50%, -50%) rotate(${w.rotation}deg) scale(${1 + 0.02 * Math.sin(frame * 0.06)})`,
          }}
        >
          {w.text}
        </Interactive.Div>
      </>
    );
  }

  // shake – the word VIBRATES on the spot, shaking harder as it lands.
  if (effect === "shake") {
    const qp = interpolate(frame, [startFrame, startFrame + durFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const amp = interpolate(qp, [0, 1], [1.5, 9]);
    const jx = Math.sin(frame * 0.9) * amp;
    const jy = Math.cos(frame * 1.3) * amp * 0.85;
    const sc = interpolate(qp, [0, 1], [0.5, 1]);
    return (
      <Interactive.Div
        name={`shake-${w.text}`}
        style={{
          ...basePlacement,
          color: w.color,
          opacity: fadeIn,
          transform: `translate(-50%, -50%) translate(${jx}px, ${jy}px) rotate(${w.rotation}deg) scale(${sc})`,
        }}
      >
        {w.text}
      </Interactive.Div>
    );
  }

  // slide (default) – ROLLS as it travels in from its direction, lands with
  // an overshoot, then breathes (idle pulse) instead of freezing.
  const progress = interpolate(frame, [startFrame, startFrame + durFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.35)),
  });
  const sign = w.text.length % 2 === 0 ? -1 : 1;
  const roll = interpolate(progress, [0, 0.75, 1], [sign * 30, sign * -7, 0]);
  let tx = 0;
  let ty = 0;
  let sc = 1;
  if (w.dir === "left") tx = interpolate(progress, [0, 1], [offsetPx, 0]);
  else if (w.dir === "right") tx = interpolate(progress, [0, 1], [-offsetPx, 0]);
  else if (w.dir === "up") ty = interpolate(progress, [0, 1], [offsetPx, 0]);
  else if (w.dir === "down") ty = interpolate(progress, [0, 1], [-offsetPx, 0]);
  else if (w.dir === "zoom") sc = interpolate(progress, [0, 1], [2.8, 1]);
  const pulse = w.dir === "zoom" ? 1 : 1 + 0.012 * Math.sin(frame * 0.05);

  return (
    <Interactive.Div
      name={`slide-${w.text}`}
      style={{
        ...basePlacement,
        color: w.color,
        opacity: fadeIn,
        transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${w.rotation + roll}deg) scale(${sc * pulse})`,
      }}
    >
      {w.text}
    </Interactive.Div>
  );
};

export const TextScene: React.FC<{ scene: TextSceneType }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();
  const accent = scene.color === "#ffffff" ? "#FF0063" : scene.color;
  const fontFamily = scene.fontFamily ?? "Arial, Helvetica, sans-serif";

  // Sanitize words so nothing is shoved off-screen / clipped — and crucially
  // so text fits INSIDE the frame on narrow screens. Fonts are sized from the
  // frame height, but on portrait videos (9:16) the width is the tight edge:
  // each word's font size is additionally capped so it can never exceed ~80%
  // of the frame width (estimated from its letter count).
  const rawWords: KineticWord[] =
    scene.variant === "kinetic" && scene.kineticWords && scene.kineticWords.length > 0
      ? scene.kineticWords
      : heuristicWords(scene.prompt, scene.color, accent, durationInFrames, fps, width, height);
  const words: KineticWord[] = rawWords.map((w) => {
    const lenFactor = Math.max(0.45, Math.min(1, 1 - (w.text.length * 0.028)));
    const maxFrac = Math.min(0.2, 0.2 * lenFactor);
    const fontFromHeight = Math.min(w.size, maxFrac) * height;
    const fontFromWidth = (width * 0.8) / Math.max(1, w.text.length * 0.6);
    const fontPx = Math.max(0.05 * height, Math.min(fontFromHeight, fontFromWidth));
    // Clamp the word's CENTER so its full width/height (font px * chars, plus a
    // rotation margin) stays inside the frame. This is what keeps wide words from
    // clipping out of view on portrait/9:16 videos. Without it, a word left at
    // x=0.2 (~43% wide) would spill off the left edge.
    const wordW = Math.max(1, w.text.length * 0.62) * fontPx * 1.12;
    const halfW = Math.min(0.49, wordW / 2 / width + 0.01);
    const wordH = fontPx * 0.6;
    const halfH = Math.min(0.49, wordH / 2 / height + 0.01);
    return {
      ...w,
      x: Math.min(1 - halfW, Math.max(halfW, w.x)),
      y: Math.min(1 - halfH, Math.max(halfH, w.y)),
      size: fontPx / height,
      rotation: Math.max(-18, Math.min(18, w.rotation)),
      start: Math.max(0, w.start),
      dur: Math.max(0.2, Math.min(1.5, w.dur)),
    };
  });

  return (
    <AbsoluteFill
      name="Kinetic text scene"
      style={{ backgroundColor: scene.background, overflow: "hidden", fontFamily }}
    >
      {words.map((w, i) => (
        <KineticWordView
          key={`${w.text}-${i}`}
          w={w}
          width={width}
          height={height}
          fps={fps}
          sceneDur={durationInFrames}
          accent={accent}
          fontFamily={fontFamily}
        />
      ))}

      {scene.tagline && (
        <Interactive.Div
          name="Tagline"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "6%",
            textAlign: "center",
            fontSize: 26,
            fontWeight: 600,
            color: accent,
            opacity: interpolate(frame, [Math.round(durationInFrames * 0.72), Math.round(durationInFrames * 0.72) + 14], [0, 0.95], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {scene.tagline}
        </Interactive.Div>
      )}
    </AbsoluteFill>
  );
};