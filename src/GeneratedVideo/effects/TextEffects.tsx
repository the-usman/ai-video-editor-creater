import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { CSSProperties, FC } from "react";
import type { TextEffectKey } from "../../project/types";

/**
 * Remotion port of `text-animation-library.css` — 40 CSS text-animation patterns
 * plus vibration/fill-effect extras (48 total), clean-room, frame-driven so they
 * are deterministic in the renderer.
 * The CSS keyframe loops become functions of useCurrentFrame().
 */

/** Loop phase 0..1 over `seconds` (to-and-fro triangle so loops alternate). */
const cycle = (frame: number, seconds: number, fps: number, alternate = false): number => {
  const total = Math.max(1, Math.round(seconds * fps));
  const t = (frame % total) / total;
  return alternate ? Math.abs(t * 2 - 1) : t;
};

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

const easeOut = Easing.out(Easing.cubic);

/** Gradient text helper: color transparent + background clipped to glyphs. */
const clipText = (background: string, backgroundSize: string, backgroundPosition?: string): CSSProperties => {
  return {
    color: "transparent",
    background,
    backgroundSize,
    backgroundPosition: backgroundPosition ?? "0 0",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  } as CSSProperties;
};

/** A positioned clone layer (represents ::before / ::after). */
const Clone: FC<{
  text: string;
  fontSize: number;
  color: string;
  style?: CSSProperties;
  className?: string;
}> = ({ text, fontSize, color, style }) => (
  <span aria-hidden style={{ position: "absolute", inset: 0, fontSize, color, ...style }}>
    {text}
  </span>
);

export const TEXT_EFFECT_LIBRARY: { key: TextEffectKey; group: string; label: string }[] = [
  { key: "explosive", group: "burst", label: "Explosive letter burst" },
  { key: "dancingShadow", group: "shadow", label: "Dancing shadow" },
  { key: "melt", group: "liquid", label: "Melting text" },
  { key: "matrix", group: "digital", label: "Matrix" },
  { key: "textMask", group: "gradient", label: "Text masking" },
  { key: "spin3d", group: "3d", label: "3D spin" },
  { key: "glitch", group: "digital", label: "Glitch effect" },
  { key: "neon", group: "glow", label: "Neon glow" },
  { key: "wavy", group: "letters", label: "Wavy text" },
  { key: "split", group: "entrance", label: "Split text" },
  { key: "glow3d", group: "3d", label: "Glowing 3D text" },
  { key: "heartbeat", group: "pulse", label: "HEY 3D heartbeat" },
  { key: "marquee3d", group: "3d", label: "3D text marquee" },
  { key: "nabla", group: "font", label: "Nabla color font depth" },
  { key: "cylinder", group: "3d", label: "3D rotate (cylinder)" },
  { key: "rollBg", group: "entrance", label: "Roll-in with gradient" },
  { key: "gooey", group: "marquee", label: "Gooey marquee" },
  { key: "ghost", group: "blend", label: "Ghosts and ghouls" },
  { key: "schitts", group: "entrance", label: "Schitt's Creek title" },
  { key: "frame", group: "frame", label: "Text frame border rotation" },
  { key: "typewriter", group: "typing", label: "Typewriter effect" },
  { key: "typing", group: "typing", label: "Typewriter loop" },
  { key: "gradientTyping", group: "typing", label: "Gradient typing" },
  { key: "editor", group: "typing", label: "Editor / code lines" },
  { key: "typingBg", group: "typing", label: "Typing with moving bg" },
  { key: "hoverUnderline", group: "hover", label: "Animated underline" },
  { key: "linkSplit", group: "hover", label: "Split highlight" },
  { key: "barReveal", group: "hover", label: "Two-layer reveal" },
  { key: "halvesSplit", group: "hover", label: "Split halves" },
  { key: "fontPulse", group: "font", label: "Weight pulse" },
  { key: "aurora", group: "gradient", label: "The aurora" },
  { key: "cityLights", group: "glow", label: "City nights glow" },
  { key: "paintReveal", group: "gradient", label: "Paint reveal" },
  { key: "hologram", group: "gradient", label: "Holographic type" },
  { key: "spotlight", group: "gradient", label: "Rainbow spotlight" },
  { key: "breathe", group: "font", label: "Breathe variable font" },
  { key: "fontTransition", group: "font", label: "Thin-to-heavy transition" },
  { key: "curved", group: "letters", label: "Curved Dusseldot" },
  { key: "worklife", group: "font", label: "Work/Life swap" },
  { key: "drawIn", group: "entrance", label: "Draw-in text" },
  { key: "vibrate", group: "kinetic", label: "Electric jitter" },
  { key: "rattle", group: "kinetic", label: "Nervous rattle" },
  { key: "error", group: "kinetic", label: "Corrupted glitch" },
  { key: "blurpop", group: "entrance", label: "Blur-in snap" },
  { key: "fillSweep", group: "fill", label: "Flowing color band" },
  { key: "wipeFill", group: "fill", label: "Marker fill sweep" },
  { key: "drawOn", group: "fill", label: "Outline draws then fills" },
  { key: "stackDrop", group: "entrance", label: "Letters stack in" },
];

export const TEXT_EFFECT_KEYS = TEXT_EFFECT_LIBRARY.map((e) => e.key);

export const WordFX: FC<{
  text: string;
  fontSize: number;
  color: string;
  accent: string;
  effect: TextEffectKey;
  /** Font family for the text (typographic poster stacks). Defaults to Arial. */
  fontFamily?: string;
}> = ({ text, fontSize, color, accent, effect, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = Array.from(text);
  const word: React.CSSProperties = {
    display: "inline-block",
    position: "relative",
    isolation: "isolate",
    whiteSpace: "nowrap",
    fontSize,
    fontWeight: 800,
    lineHeight: 0.95,
    fontFamily: fontFamily ?? "Arial, Helvetica, sans-serif",
  };

  switch (effect) {
    // 01 Explosive letter burst — periodic radial bursts around a pop
    case "explosive": {
      const t = cycle(frame, 1.4, fps);
      const pop = interpolate(t, [0, 0.15, 0.35, 1], [1, 1.09, 1, 1], { easing: easeOut });
      const burst = interpolate(t, [0, 0.7], [0, 1], { easing: easeOut });
      const ringScale = 1 + burst * 14;
      const ringOp = (1 - burst) * 0.9;
      return (
        <span style={{ ...word, transform: `scale(${pop})` }}>
          {text}
          <span
            style={{
              position: "absolute",
              inset: "45%",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}, transparent 65%)`,
              opacity: ringOp,
              transform: `translate(-140px, -80px) scale(${ringScale})`,
              zIndex: -1,
            }}
          />
          <span
            style={{
              position: "absolute",
              inset: "45%",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${color}, transparent 65%)`,
              opacity: ringOp,
              transform: `translate(140px, 80px) scale(${ringScale})`,
              zIndex: -1,
            }}
          />
        </span>
      );
    }

    // 02 Dancing shadow
    case "dancingShadow": {
      const t = cycle(frame, 1.3, fps, true);
      const s = 4 + t * 2;
      const swap = cycle(frame, 1.3, fps, true);
      const a = t < 0.5 ? accent : color;
      const b = t < 0.5 ? color : accent;
      return (
        <span
          style={{
            ...word,
            textShadow:
              t < 0.5
                ? `${s}px ${s * -0.8}px 0 ${a}, ${-s}px ${s * 0.8}px 0 ${b}`
                : `${-s}px ${s}px 0 ${a}, ${s}px ${-s}px 0 ${b}`,
            transform: `translateY(${swap * 2 - 1}px)`,
          }}
        >
          {text}
        </span>
      );
    }

    // 03 Melting text — bobbing + dripping blurred copies
    case "melt": {
      const t = cycle(frame, 2.4, fps, true);
      const drip = cycle(frame, 2.4, fps, true);
      const meltY = t * 5;
      const dripY = 12 + drip * 26;
      const dripOp = 0.2 + drip * 0.35;
      return (
        <span style={{ ...word, display: "inline-block", transform: `translateY(${meltY}px) skewX(${t * 0.5}deg)` }}>
          {text}
          <Clone text={text} fontSize={fontSize} color={color} style={{ opacity: dripOp, transformOrigin: "top", transform: `scaleY(${1 + drip * 0.2}) translateY(${dripY}px)` }} />
          <Clone text={text} fontSize={fontSize} color={color} style={{ opacity: dripOp * 0.5, filter: "blur(10px)", transformOrigin: "top", transform: `scaleY(${1 + drip * 0.22}) translateY(${dripY + 10}px)` }} />
        </span>
      );
    }

    // 04 Matrix — green glow + glitch + rain overlay masked to the text
    case "matrix": {
      const glitchFrame = Math.floor(frame / 14) % 10;
      const gx = glitchFrame === 1 ? -3 : glitchFrame === 2 ? 3 : 0;
      const rain = cycle(frame, 1.1, fps);
      const glyph: React.CSSProperties = {
        ...word,
        color: "#55ff55",
        textShadow: "0 0 8px #00ff44",
        transform: `translate(${gx}px, ${gx ? 1 : 0}px)`,
        clipPath: glitchFrame === 1 ? "inset(20% 0 45% 0)" : glitchFrame === 2 ? "inset(55% 0 10% 0)" : "inset(0)",
      };
      return (
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={glyph}>
            {text}
            <span style={{ position: "absolute", inset: 0, ...clipText(`repeating-linear-gradient(180deg, transparent 0 4px, rgba(0,255,80,.7) 5px 6px)`, `100% ${220 + rain * 120}%`, `0 ${rain * 100}%`), opacity: 0.25 }}>
              {text}
            </span>
          </span>
        </span>
      );
    }

    // 05 Text masking — moving gradient clipped to glyphs
    case "textMask": {
      const t = cycle(frame, 3, fps);
      return (
        <span
          style={{
            ...word,
            ...clipText(
              `linear-gradient(90deg, ${color} 0%, ${accent} 33%, ${color} 66%, ${accent} 100%)`,
              "300% 100%",
              `${t * 300}% 0`,
            ),
          }}
        >
          {text}
        </span>
      );
    }

    // 06 3D spin — continuous rotateY with depth shadows
    case "spin3d": {
      const ry = (frame * 360) / (2.8 * fps);
      return (
        <span
          style={{
            ...word,
            textShadow: `1px 1px 0 ${accent}, 2px 2px 0 ${color}, 3px 3px 0 ${accent}`,
            transform: `perspective(500px) rotateY(${ry}deg)`,
          }}
        >
          {text}
        </span>
      );
    }

    // 07 Glitch effect — colored clones with clipped slices jittering
    case "glitch": {
      const p1 = Math.floor(frame / 5) % 8;
      const p2 = Math.floor(frame / 9) % 7;
      const slice1 = p1 === 0 ? "inset(15% 0 55% 0)" : p1 === 1 ? "inset(40% 0 20% 0)" : "inset(0)";
      const slice2 = p2 === 0 ? "inset(55% 0 15% 0)" : p2 === 1 ? "inset(5% 0 75% 0)" : "inset(0)";
      const dx1 = p1 === 0 ? -4 : p1 === 1 ? 4 : 0;
      const dx2 = p2 === 0 ? 4 : p2 === 1 ? -4 : 0;
      return (
        <span style={{ position: "relative", display: "inline-block" }}>
          <Clone text={text} fontSize={fontSize} color={accent} style={{ clipPath: slice1, transform: `translate(${dx1}px, 2px)` }} />
          <Clone text={text} fontSize={fontSize} color={accent} style={{ clipPath: slice2, transform: `translate(${dx2}px, -2px)` }} />
          <span style={{ ...word, position: "relative" }}>{text}</span>
        </span>
      );
    }

    // 08 Neon glow — two-color alternating glow
    case "neon": {
      const t = cycle(frame, 1.8, fps, true);
      const base = t < 0.5 ? accent : color;
      return (
        <span
          style={{
            ...word,
            color: "#fff",
            textShadow: `0 0 ${4 + t * 1}px #fff, 0 0 ${10 + t * 4}px ${base}, 0 0 ${22 + t * 12}px ${base}`,
            opacity: 0.93 + Math.sin(frame * 0.12) * 0.05,
          }}
        >
          {text}
        </span>
      );
    }

    // 09 Wavy text — per-letter staggered wave
    case "wavy": {
      return (
        <span style={{ position: "relative", display: "inline-block", ...word }}>
          {letters.map((ch, i) => {
            const w = Math.sin((frame / fps) * 4.5 - i * 0.7) * 12;
            const r = Math.sin((frame / fps) * 4.5 - i * 0.7) * 5;
            return (
              <span key={i} style={{ display: "inline-block", transform: `translateY(${w}px) rotate(${r}deg)` }}>
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}
        </span>
      );
    }

    // 10 Split text — two halves slide in/out from the sides
    case "split": {
      const mid = Math.ceil(letters.length / 2);
      const left = letters.slice(0, mid).join("");
      const right = letters.slice(mid).join("");
      const t = cycle(frame, 2.4, fps, true);
      const enterL = interpolate(t, [0, 0.15, 0.55, 0.75], [-1.1, 0, 0, 1.2], { easing: easeOut });
      const enterR = interpolate(t, [0, 0.15, 0.55, 0.75], [1.1, 0, 0, -1.2], { easing: easeOut });
      const op = clamp01(t < 0.75 ? 1 : (1 - t) * 3);
      return (
        <span style={{ ...word, display: "inline-flex", overflow: "hidden" }}>
          <span style={{ display: "inline-block", transform: `translateX(${enterL * 100}%)`, opacity: op }}>{left}</span>
          <span style={{ display: "inline-block", transform: `translateX(${enterR * 100}%)`, opacity: op }}>{right}</span>
        </span>
      );
    }

    // 11 Glowing 3D text — wobble + glow color shift
    case "glow3d": {
      const wob = Math.sin((frame / fps) * 2.2) * 8;
      const t = cycle(frame, 1.7, fps, true);
      const main = t < 0.5 ? color : accent;
      return (
        <span
          style={{
            ...word,
            color: "#fff",
            textShadow: `0 0 ${5 + t * 3}px #fff, 0 0 ${12 + t * 16}px ${main}`,
            transform: `perspective(600px) rotate3d(1,1,0,${wob}deg)`,
          }}
        >
          {text}
        </span>
      );
    }

    // 12 HEY 3D — heartbeat scale + rotateX + colored depth offsets
    case "heartbeat": {
      const t = cycle(frame, 1.25, fps);
      const s = t < 0.15 ? 1.06 : t < 0.3 ? 0.98 : t < 0.45 ? 1.04 : 1;
      const rx = t < 0.15 ? 8 : t < 0.3 ? -5 : t < 0.45 ? 5 : 0;
      return (
        <span
          style={{
            ...word,
            fontWeight: 900,
            textShadow: `4px 4px 0 ${accent}, 8px 8px 0 ${color}`,
            transform: `scale(${s}) rotateX(${rx}deg)`,
          }}
        >
          {text}
        </span>
      );
    }

    // 13 3D text marquee — perspective rotateY sweep
    case "marquee3d": {
      const t = cycle(frame, 4, fps);
      const x = interpolate(t, [0, 1], [100, -100]);
      const ry = interpolate(t, [0, 1], [18, -18]);
      return (
        <span
          style={{
            ...word,
            transform: `perspective(600px) rotateY(${ry}deg) translateX(${x}%)`,
            textShadow: `0 6px 24px rgba(0,0,0,0.4)`,
          }}
        >
          {text}
        </span>
      );
    }

    // 14 Nabla color font — extrusion depth pulse (font-variation if font loaded)
    case "nabla": {
      const edpt = cycle(frame, 2.2, fps, true) * 100;
      return (
        <span
          style={{
            ...word,
            fontFamily: '"Nabla", Arial, sans-serif',
            fontVariationSettings: `"EDPT" ${edpt}, "EHLT" ${Math.round(edpt * 0.24)}`,
            textShadow: `${2 + edpt * 0.06}px ${1 + edpt * 0.05}px 0 ${accent}`,
          }}
        >
          {text}
        </span>
      );
    }

    // 15 3D rotate (cylinder) — continuous rotateX
    case "cylinder": {
      const rx = (frame * 360) / (4 * fps);
      return (
        <span style={{ ...word, transform: `perspective(700px) rotateX(${rx}deg)`, textShadow: `0 10px 30px rgba(0,0,0,0.5)` }}>
          {text}
        </span>
      );
    }

    // 16 Text animation with background — rolls in/out on gradient text
    case "rollBg": {
      const t = cycle(frame, 2.8, fps);
      const rolls = interpolate(t, [0, 0.15, 0.75, 1], [28, 0, 0, 28]);
      const op = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1;
      return (
        <span
          style={{
            ...word,
            ...clipText(`linear-gradient(90deg, ${color}, ${accent}, ${color})`, "300% 100%", `${t * 300}% 0`),
            transform: `translateY(${rolls}px)`,
            opacity: clamp01(op),
          }}
        >
          {text}
        </span>
      );
    }

    // 17 Gooey marquee — horizontal blur-slick sweep
    case "gooey": {
      const t = cycle(frame, 4, fps);
      const x = interpolate(t, [0, 1], [100, -100]);
      const blur = interpolate(t, [0, 0.12, 0.85, 1], [6, 0, 0, 6]);
      return (
        <span style={{ ...word, filter: `blur(${blur}px)`, transform: `translateX(${x}%)` }}>{text}</span>
      );
    }

    // 18 Ghosts and ghouls — blending blob gliding across the text
    case "ghost": {
      const t = cycle(frame, 3, fps);
      const x = t * 120;
      return (
        <span style={{ position: "relative", display: "inline-block", overflow: "hidden", ...word }}>
          <span style={{ position: "absolute", bottom: -6, left: -40, width: 24, height: 24, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#fff", mixBlendMode: "exclusion", transform: `translateX(${x}%)` }} />
          <span style={{ position: "relative" }}>{text}</span>
        </span>
      );
    }

    // 19 Schitt's Creek — pop entrance + sparkle
    case "schitts": {
      const t = cycle(frame, 2.2, fps);
      const pop = interpolate(t, [0, 0.2, 0.45], [0, 1, 1], { easing: easeOut });
      const spark = cycle(frame, 1.2, fps, true);
      return (
        <span style={{ position: "relative", display: "inline-block", ...word }}>
          <span style={{ display: "inline-block", transform: `translateY(${(1 - pop) * 20}px) rotate(${(1 - pop) * 4}deg)`, opacity: pop }}>
            {text}
          </span>
          <span
            style={{
              display: "inline-block",
              marginLeft: "0.2em",
              transform: `scale(${0.7 + spark * 0.5}) rotate(${spark * 20}deg)`,
              opacity: 0.4 + spark * 0.6,
              color: accent,
            }}
          >
            ✦
          </span>
        </span>
      );
    }

    // 20 Text frame border rotation — bordered box with micro wiggle
    case "frame": {
      const rot = Math.sin((frame / fps) * 1.4) * 1;
      return (
        <span
          style={{
            ...word,
            display: "inline-block",
            padding: "0.35em 0.7em",
            border: `2px solid ${accent}`,
            transform: `rotate(${rot}deg)`,
          }}
        >
          {text}
        </span>
      );
    }

    // 21 Typewriter effect — stepped reveal + blinking cursor
    case "typewriter":
    case "gradientTyping":
    case "typing":
    case "typingBg": {
      const total = Math.max(1, letters.length);
      const step = effect === "typing" ? 1.6 : effect === "gradientTyping" ? 0.75 : effect === "typingBg" ? 1.7 : 1;
      const reveal = clamp01((frame / fps) / (0.5 * total * (2 - step)));
      const cursor = cycle(frame, 0.7, fps, true);
      const cursorW = effect === "gradientTyping" || effect === "typing" || effect === "typingBg" ? "0.16em" : "0.12em";
      const flowT = cycle(frame, 2, fps);
      const isGrad = effect === "gradientTyping" || effect === "typingBg";
      const gText = isGrad
        ? clipText(`linear-gradient(90deg, ${accent}, ${color}, ${accent})`, "200% 100%", `${flowT * 200}% 0`)
        : {};
      return (
        <span
          style={{
            ...word,
            ...gText,
            display: "inline-block",
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: `${reveal * 100}%`,
            borderRight: `${cursorW} solid ${cursor > 0 ? "currentColor" : "transparent"}`,
          }}
        >
          {text}
        </span>
      );
    }

    // 24 Editor illustration — terminal-panel typing with prompt + caret
    case "editor": {
      const total = Math.max(1, letters.length);
      const reveal = clamp01((frame / fps) / (0.32 * total));
      const cursor = cycle(frame, 0.7, fps, true);
      return (
        <span
          style={{
            ...word,
            fontFamily: '"Consolas", "Courier New", monospace',
            fontSize: fontSize * 0.72,
            fontWeight: 500,
            display: "inline-block",
            textAlign: "left",
            color: "#d6ffe0",
            background: "rgba(0,30,10,0.55)",
            border: "1px solid rgba(0,255,120,0.4)",
            borderRadius: 8,
            padding: "0.5em 0.8em",
          }}
        >
          <span style={{ display: "block", color: accent, fontSize: "0.8em", opacity: 0.7 }}>
            {"// " + text.slice(0, Math.max(6, Math.floor(reveal * total)))}
          </span>
          <span style={{ display: "block", color: "#fff" }}>
            <span style={{ color: "#7dd3fc" }}>{"$ "}</span>
            {text.slice(0, Math.floor(reveal * total))}
            {cursor > 0 ? <span style={{ display: "inline-block", width: 8, height: "1em", background: "#7dd3fc", verticalAlign: "-0.15em" }} /> : null}
          </span>
        </span>
      );
    }

    // 26 Animated underline + letter spacing pulse
    case "hoverUnderline": {
      const t = cycle(frame, 2.6, fps, true);
      return (
        <span style={{ ...word, letterSpacing: `${t * 0.08}em`, position: "relative", display: "inline-block" }}>
          {text}
          <span
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "-0.12em",
              height: 2,
              background: accent,
              transform: `scaleX(${t})`,
              transformOrigin: "left",
            }}
          />
        </span>
      );
    }

    // 27 Split highlight — halves offset with rotate/scale pop
    case "linkSplit": {
      const t = cycle(frame, 2.2, fps, true);
      const spread = interpolate(t, [0, 0.35, 0.75, 1], [0, 100, 100, 0]);
      const edge = interpolate(t, [0, 0.35, 0.75, 1], [0, -100, -100, 0]);
      return (
        <span style={{ ...word, position: "relative", display: "inline-block", overflow: "hidden" }}>
          <span
            style={{
              display: "block",
              transform: `translateY(${spread * 0.5}%) rotateZ(${interpolate(t, [0, 0.35, 1], [0, -2, 0])}deg)`,
            }}
          >
            {text}
          </span>
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "block",
              clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
              transform: `translateY(${edge * 0.5}%) scaleX(${1 - interpolate(t, [0, 0.35, 1], [0, 0.1, 0])})`,
              color: accent,
            }}
          >
            {text}
          </span>
        </span>
      );
    }

    // 28 Two-layer bar reveal
    case "barReveal": {
      const t = cycle(frame, 2.4, fps, true);
      return (
        <span style={{ ...word, position: "relative", display: "inline-block", color: "#111" }}>
          <span style={{ position: "absolute", left: 0, right: 0, top: 0, height: "50%", background: accent, transform: `scaleY(${t})`, transformOrigin: "top", zIndex: -1, opacity: 0.9 }} />
          <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "50%", background: color, transform: `scaleY(${t})`, transformOrigin: "bottom", zIndex: -1 }} />
          <span style={{ position: "relative" }}>{text}</span>
        </span>
      );
    }

    // 29 Split halves into the air
    case "halvesSplit": {
      const t = cycle(frame, 2.2, fps, true);
      return (
        <span style={{ ...word, position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "50%", overflow: "hidden", clipPath: "inset(0 0 0 0)", transform: `translateY(${-t * 45}%) scaleY(${1 - t * 0.1})` }}>
            {text}
          </span>
          <span style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "50%", overflow: "hidden", clipPath: "inset(0 0 0 0)", transform: `translateY(${t * 45}%) scaleY(${1 - t * 0.1})` }}>
            {text}
          </span>
          <span style={{ opacity: 0.001 }}>{"\u00A0"}</span>
        </span>
      );
    }

    // 30 Weight pulse — heavy shadow/condensed to light (variable-font style)
    case "fontPulse": {
      const t = cycle(frame, 2.4, fps, true);
      const heavy = t < 0.5;
      return (
        <span
          style={{
            ...word,
            fontWeight: heavy ? 900 : 100,
            fontStyle: heavy ? "italic" : "normal",
            textShadow: heavy ? `3px 3px 0 ${accent}, 6px 6px 0 ${color}` : "none",
            transform: `scaleY(${1 - t * 0.06})`,
            WebkitTextStroke: heavy ? `1px ${color}` : "0",
          }}
        >
          {text}
        </span>
      );
    }

    // 31 The aurora — aurora gradient clipped to text
    case "aurora": {
      const t = cycle(frame, 4, fps, true);
      return (
        <span
          style={{
            ...word,
            ...clipText(
              `radial-gradient(circle at ${15 + t * 60}% 50%, ${color} 0 18%, transparent 45%), radial-gradient(circle at ${85 - t * 40}% 50%, ${accent} 0 18%, transparent 45%), radial-gradient(circle at 50% 25%, #7c3aed 0 15%, transparent 45%)`,
              "200% 200%",
              `${t * 100}% 50%`,
            ),
            filter: `saturate(${1.2 + t})`,
          }}
        >
          {text}
        </span>
      );
    }

    // 32 City nights — blue neon pulse
    case "cityLights": {
      const t = cycle(frame, 2.2, fps, true);
      return (
        <span
          style={{
            ...word,
            color: t < 0.5 ? "#bfdbfe" : "#e0f2fe",
            textShadow:
              t < 0.5
                ? `0 0 5px #60a5fa, 0 0 12px #2563eb`
                : `0 0 8px ${color}, 0 0 24px #3b82f6, 0 0 45px #7c3aed`,
          }}
        >
          {text}
        </span>
      );
    }

    // 33 Shadow paint reveal — two accent fills sweep in
    case "paintReveal": {
      const t = cycle(frame, 2.4, fps, true);
      const fillL = interpolate(t, [0, 0.55, 1], [0, 55, 100]);
      const fillR = interpolate(t, [0, 0.55, 1], [0, 0, 100]);
      return (
        <span
          style={{
            ...word,
            ...clipText(
              `linear-gradient(90deg, ${accent}, ${accent}) left / ${fillL}% 100% no-repeat, linear-gradient(90deg, ${color}, ${color}) right / ${fillR}% 100% no-repeat`,
              "100% 100%",
            ),
          }}
        >
          {text}
        </span>
      );
    }

    // 34 Holographic type — rainbow gradient + 3D wobble + shimmer
    case "hologram": {
      const wob = Math.sin((frame / fps) * 2) * 5;
      const t = cycle(frame, 2, fps);
      return (
        <span
          style={{
            ...word,
            ...clipText(`linear-gradient(110deg, ${color}, ${accent}, #facc15, #7c3aed, ${color})`, "300% 100%", `${t * 300}% 0`),
            transform: `perspective(700px) rotate3d(1,0,0,${wob}deg)`,
            filter: `brightness(${1.1 + 0.2 * Math.sin(frame / fps * 3)})`,
          }}
        >
          {text}
        </span>
      );
    }

    // 35 Rainbow spotlight — sliding ellipse reveal over rainbow
    case "spotlight": {
      const t = cycle(frame, 2.6, fps, true);
      const flow = cycle(frame, 2, fps);
      return (
        <span style={{ ...word, color: "#fff", position: "relative", display: "inline-block" }}>
          <span
            style={{
              position: "absolute",
              inset: 0,
              ...clipText(
                `linear-gradient(90deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)`,
                "200% 100%",
                `${flow * 200}% 0`,
              ),
              clipPath: `ellipse(22% 80% at ${t * 100}% 50%)`,
            }}
          >
            {text}
          </span>
          {text}
        </span>
      );
    }

    // 36 Breathe — weight + width breathing
    case "breathe": {
      const t = cycle(frame, 2.2, fps, true);
      return (
        <span
          style={{
            ...word,
            fontWeight: 100 + t * 800,
            fontVariationSettings: `"wght" ${100 + t * 800}`,
            transform: `scaleX(${0.96 + t * 0.07})`,
            letterSpacing: `${(0.9 - t * 0.7) * 0.02}em`,
          }}
        >
          {text}
        </span>
      );
    }

    // 37 Thin-to-heavy transition (loop)
    case "fontTransition": {
      const t = cycle(frame, 1.8, fps, true);
      return (
        <span style={{ ...word, fontWeight: 100 + t * 900, transform: `scaleX(${0.95 + t * 0.08})` }}>{text}</span>
      );
    }

    // 38 Curved Dusseldot — letters rotating on an arc
    case "curved": {
      return (
        <span style={{ ...word, display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
          {letters.map((ch, i) => {
            const r = Math.sin((frame / fps) * 2.2 + i * 0.4) * 16;
            const y = -Math.sin((frame / fps) * 2.2 + i * 0.4) * 6;
            return (
              <span key={i} style={{ display: "inline-block", transformOrigin: "0 3em", transform: `rotate(${r}deg) translateY(${y}px)` }}>
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}
        </span>
      );
    }

    // 39 Work/Life — opposing weight + width swap
    case "worklife": {
      const t = cycle(frame, 2.4, fps, true);
      const heavy = t < 0.5;
      return (
        <span
          style={{
            ...word,
            fontWeight: heavy ? 900 : 200,
            fontVariationSettings: `"wght" ${heavy ? 900 : 200}, "wdth" ${heavy ? 125 : 75}`,
            transform: `scaleX(${heavy ? 1.06 : 0.95})`,
            letterSpacing: `${heavy ? 0.01 : 0.06}em`,
            display: "inline-flex",
            gap: "0.35em",
          }}
        >
          {letters.map((ch, i) => (
            <span key={i} style={{ display: "inline-block" }}>
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      );
    }

    // 40 Draw-in — layered glow clones + brightness/draw reveal
    case "drawIn": {
      const t = cycle(frame, 2.6, fps, true);
      return (
        <span style={{ ...word, color: "#fff", position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", inset: 0, color: accent, opacity: 0.35, transform: "translate(-3px, 2px)", zIndex: -1 }}>
            {text}
          </span>
          <span style={{ position: "absolute", inset: 0, color: accent, opacity: 0.35, transform: "translate(3px, -2px)", zIndex: -1 }}>
            {text}
          </span>
          <span
            style={{
              position: "relative",
              textShadow: `2px 2px 0 ${accent}`,
              filter: `brightness(${0.9 + t * 0.3})`,
              clipPath: `inset(0 0 ${100 - t * 100}% 0)`,
            }}
          >
            {text}
          </span>
        </span>
      );
    }

    // 41 Vibrate — violent electric jitter + chroma halo + brightness surge (pure fn of frame).
    case "vibrate": {
      const tt = frame / 7;
      const j = Math.sin(tt * 12.9898) * 43758.5453;
      const rnd = j - Math.floor(j);
      return (
        <span
          style={{
            ...word,
            transform: `translate(${(rnd - 0.5) * 14}px, ${(Math.sin(tt * 7.3) - 0.5) * 9}px) rotate(${Math.sin(tt * 13.7) * 4}deg)`,
            filter: `brightness(${0.85 + 0.35 * Math.abs(Math.sin(tt * 8.1))})`,
            textShadow: `0 0 12px ${accent}, 0 0 28px ${accent}`,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: -2,
              top: -2,
              color: accent,
              opacity: 0.7,
              transform: `translate(${(rnd - 0.5) * -10}px, ${(rnd - 0.5) * -8}px)`,
            }}
          >
            {text}
          </span>
          {text}
        </span>
      );
    }

    // 42 Rattle — fast nervous shaking of the whole word.
    case "rattle": {
      const t = frame / 4;
      return (
        <span
          style={{
            ...word,
            transform: `translateX(${Math.sin(t * 3) * 6}px) rotate(${Math.sin(t * 5) * 5}deg) scaleX(${1 + 0.02 * Math.sin(t * 2.5)})`,
          }}
        >
          {text}
        </span>
      );
    }

    // 43 Error — corrupted-text: animated clipping slices + RGB split + blinking brightness.
    case "error": {
      const tt = frame / 6;
      const r1 = Math.sin(tt * 11.11) * 43758.5453;
      const n1 = r1 - Math.floor(r1);
      const r2 = Math.sin(tt * 7.3) * 43758.5453;
      const n2 = r2 - Math.floor(r2);
      return (
        <span
          style={{
            ...word,
            clipPath: `inset(${n1 * 30}% 0 ${n2 * 30}% 0)`,
            transform: `translateX(${(n2 - 0.5) * 18}px)`,
            filter: `brightness(${0.6 + 0.8 * Math.abs(Math.sin(tt * 5))})`,
            textShadow: `${(n1 - 0.5) * 14}px 0 ${accent}, ${(n1 - 0.5) * -14}px 0 #00e5ff`,
            WebkitTextStroke: `${Math.max(1, 0.01 * fontSize)}px ${accent}`,
          }}
        >
          {text}
        </span>
      );
    }

    // 44 Blur pop — unfocused blur snaps into razor sharpness with a scale overshoot.
    case "blurpop": {
      const p = clamp01(frame / 26);
      const b = easeOut(p);
      const scale = interpolate(frame, [0, 26, 32], [1.25, 0.92, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const blur = interpolate(frame, [0, 26], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <Clone text={text} fontSize={fontSize} color={color} style={{ transform: `scale(${scale})`, filter: `blur(${blur}px) saturate(${1 + 0.3 * b})`, opacity: b }} />
      );
    }

    // 45 Fill sweep — a bright band of the accent color endlessly sweeps in one direction, re-filling the text.
    case "fillSweep": {
      const pos = (1 - clamp01((frame % 90) / 90)) * 180;
      return (
        <Clone
          text={text}
          fontSize={fontSize}
          color={color}
          style={{
            ...clipText(accent, `linear-gradient(100deg, ${color} 20%, ${accent} 50%, ${color} 80%) ${pos}% 0 / 220% 100% no-repeat`),
            filter: `drop-shadow(0 0 ${8 + 4 * Math.sin(frame * 0.1)}px ${accent})`,
          }}
        />
      );
    }

    // 46 Wipe fill — the outline version of the word stands by while a marker-style color fill sweeps left→right.
    case "wipeFill": {
      const p = clamp01(frame / 40);
      const s = Math.min(1, p * 1.3);
      return (
        <span style={{ ...word, opacity: p }}>
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              color: "transparent",
              opacity: 0.5,
              WebkitTextStroke: `${Math.max(1, 0.025 * fontSize)}px ${color}`,
            }}
          >
            {text}
          </span>
          <span style={{ color, clipPath: `inset(0 ${(1 - s) * 100}% 0 0)` }}>{text}</span>
        </span>
      );
    }

    // 47 Draw on — the word's outline is drawn first, then its color fill floods in.
    case "drawOn": {
      const p = clamp01(frame / 44);
      const o = easeOut(p);
      const fillIn = p > 0.55 ? (p - 0.55) / 0.45 : 0;
      return (
        <span style={{ ...word, opacity: o, transform: `rotate(${(1 - o) * 6}deg)` }}>
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              color: "transparent",
              WebkitTextStroke: `${Math.max(1, 0.02 * fontSize)}px ${color}`,
            }}
          >
            {text}
          </span>
          <span style={{ color, opacity: fillIn }}>{text}</span>
        </span>
      );
    }

    // 48 Stack drop — each letter drops from above, rotating into place until the whole word is filled.
    case "stackDrop": {
      const out = letters.map((ch, i) => {
        const lo = clamp01((frame - i * 4) / 18);
        const y = (1 - easeOut(lo)) * 70;
        const r = interpolate(frame, [i * 4, i * 4 + 18], [40, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${y}px) rotate(${r}deg)`,
              opacity: Math.min(1, lo * 2.5),
              letterSpacing: 0.02 * fontSize,
            }}
          >
            {ch}
          </span>
        );
      });
      return <span style={{ ...word, letterSpacing: 0.04 * fontSize }}>{out}</span>;
    }

    default:
      return <span style={word}>{text}</span>;
  }
};