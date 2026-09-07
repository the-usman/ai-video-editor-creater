import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TextScene as TextSceneType } from "../../project/types";

export const TextScene: React.FC<{ scene: TextSceneType }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Text scene"
      style={{
        backgroundColor: scene.background,
        color: scene.color,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
        textAlign: "center",
      }}
    >
      <Interactive.Div
        name="Headline"
        style={{
          fontSize: 76,
          fontWeight: 700,
          lineHeight: 1.1,
          opacity: interpolate(frame, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 18], [0.9, 1], {
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [durationInFrames - 20, durationInFrames],
            ["0px 0px", "0px -24px"],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        {scene.prompt}
      </Interactive.Div>
      {scene.subtitle ? (
        <Interactive.Div
          name="Subtitle"
          style={{
            marginTop: 28,
            fontSize: 30,
            opacity: interpolate(frame, [10, 1 * fps], [0, 0.8], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {scene.subtitle}
        </Interactive.Div>
      ) : null}
    </AbsoluteFill>
  );
};
