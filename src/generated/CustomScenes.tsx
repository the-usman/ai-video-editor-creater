import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import type { FC } from "react";

export type CustomSceneProps = {
  scene: {
    caption: string;
    narration: string;
    background: string;
    color: string;
    accent: string;
    tagline?: string;
    design: string;
    words: string[];
  };
};

export const Scene0: FC<CustomSceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const minDim = Math.min(width, height);
  const sizeFor = (w: string) =>
    Math.min(minDim * 0.22, (width * 0.85) / Math.max(1, w.length * 0.6));
  const word = scene.words[0] ?? "BOLD.";

  const zoom = interpolate(frame, [0, 16], [3.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const slice = interpolate(frame, [68, 86], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.background,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          fontSize: sizeFor(word),
          fontWeight: 900,
          color: scene.color,
          opacity: opacity * (1 - slice),
          whiteSpace: "nowrap",
          transform: `translate(-50%, -50%) translateX(${
            slice * width * 1.3
          }px) scale(${zoom}) rotate(-6deg)`,
        }}
      >
        {word}
      </div>
    </AbsoluteFill>
  );
};

export const Scene1: FC<CustomSceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const minDim = Math.min(width, height);
  const word = scene.words[0] ?? "DIFFERENT.";
  const letters = word.split("");
  const sizeFor = () =>
    Math.min(minDim * 0.12, (width * 0.92) / Math.max(1, letters.length * 0.75));
  const size = sizeFor();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.background,
        overflow: "hidden",
      }}
    >
      {letters.map((ch, i) => {
        const start = i * 4;
        const p = interpolate(frame, [start, start + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const leftPct = 4 + i * (92 / Math.max(1, letters.length - 1));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${leftPct}%`,
              top: "42%",
              fontSize: size,
              fontWeight: 900,
              color: scene.color,
              opacity: p,
              transform: `translate(-50%, -50%) translateY(${
                (1 - p) * 60
              }px) rotate(${i % 2 ? 5 : -5}deg)`,
            }}
          >
            {ch}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Scene2: FC<CustomSceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const minDim = Math.min(width, height);
  const sizeFor = (w: string) =>
    Math.min(minDim * 0.15, (width * 0.85) / Math.max(1, w.length * 0.6));

  const sharp = scene.words[0] ?? "SHARP.";
  const fearless = scene.words[1] ?? "FEARLESS.";

  const slideX = interpolate(frame, [0, 20], [width, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const slideRotate = interpolate(frame, [0, 20], [-22, -8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const slideOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const spinDeg = interpolate(frame, [8, 34], [180, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const spinOpacity = interpolate(frame, [8, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.background,
        overflow: "hidden",
        perspective: 1200,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "32%",
          fontSize: sizeFor(sharp),
          fontWeight: 900,
          color: scene.color,
          opacity: slideOpacity,
          whiteSpace: "nowrap",
          transform: `translate(-50%, -50%) translateX(${
            slideX - width / 2
          }px) rotate(${slideRotate}deg)`,
        }}
      >
        {sharp}
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          fontSize: sizeFor(fearless),
          fontWeight: 900,
          color: scene.accent,
          opacity: spinOpacity,
          whiteSpace: "nowrap",
          transformStyle: "preserve-3d",
          transform: `translate(-50%, -50%) rotateY(${spinDeg}deg)`,
        }}
      >
        {fearless}
      </div>
    </AbsoluteFill>
  );
};

export const Scene3: FC<CustomSceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const minDim = Math.min(width, height);
  const sizeFor = (w: string) =>
    Math.min(minDim * 0.13, (width * 0.88) / Math.max(1, w.length * 0.6));

  const unmissable = scene.words[0] ?? "UNMISSABLE.";
  const reliable = scene.words[1] ?? "RELIABLE.";

  const pop = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 8, stiffness: 140, mass: 0.6 },
  });
  const popScale = interpolate(pop, [0, 1], [0.2, 1]);
  const popOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ghosts = [0, 1, 2, 3];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.background,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "28%",
          fontSize: sizeFor(unmissable),
          fontWeight: 900,
          color: scene.color,
          opacity: popOpacity,
          whiteSpace: "nowrap",
          transform: `translate(-50%, -50%) scale(${popScale})`,
        }}
      >
        {unmissable}
      </div>

      {ghosts.map((g) => {
        const delay = 20 + g * 3;
        const p = interpolate(frame, [delay, delay + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const cyclePhase = (frame + g * 15) % 60;
        const colorMix = interpolate(cyclePhase, [0, 30, 60], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const color = colorMix > 0.5 ? scene.accent : scene.color;
        return (
          <div
            key={g}
            style={{
              position: "absolute",
              left: "50%",
              top: "62%",
              fontSize: sizeFor(reliable),
              fontWeight: 900,
              color,
              opacity: p * (g === 0 ? 1 : 0.28),
              whiteSpace: "nowrap",
              transform: `translate(-50%, -50%) translate(${g * 3}px, ${
                g * 3
              }px)`,
            }}
          >
            {reliable}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Scene4: FC<CustomSceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const minDim = Math.min(width, height);
  const sizeFor = (w: string) =>
    Math.min(minDim * 0.16, (width * 0.75) / Math.max(1, w.length * 0.6));

  const d2 = scene.words[0] ?? "D2";
  const media = scene.words[1] ?? "MEDIA";
  const tagline = scene.tagline ?? "MAKE YOUR MESSAGE MATTER.";

  const d2Spin = interpolate(frame, [0, 22], [-200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const d2Opacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mediaPop = spring({
    frame: frame - 10,
    fps,
    from: 0,
    to: 1,
    config: { damping: 9, stiffness: 150, mass: 0.6 },
  });
  const mediaScale = interpolate(mediaPop, [0, 1], [0.3, 1]);
  const mediaOpacity = interpolate(frame, [10, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tagY = interpolate(frame, [30, 50], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const tagOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagSize = Math.min(minDim * 0.045, (width * 0.85) / (tagline.length * 0.55));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.background,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          display: "flex",
          gap: minDim * 0.03,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            fontSize: sizeFor(d2),
            fontWeight: 900,
            color: scene.color,
            opacity: d2Opacity,
            transform: `rotate(${d2Spin}deg)`,
          }}
        >
          {d2}
        </div>
        <div
          style={{
            fontSize: sizeFor(media),
            fontWeight: 900,
            color: scene.accent,
            opacity: mediaOpacity,
            transform: `scale(${mediaScale})`,
          }}
        >
          {media}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          fontSize: tagSize,
          fontWeight: 700,
          color: scene.accent,
          opacity: tagOpacity,
          whiteSpace: "nowrap",
          transform: `translate(-50%, -50%) translateY(${tagY}px)`,
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};

export const CustomScenes: FC<CustomSceneProps>[] = [
  Scene0,
  Scene1,
  Scene2,
  Scene3,
  Scene4,
];
