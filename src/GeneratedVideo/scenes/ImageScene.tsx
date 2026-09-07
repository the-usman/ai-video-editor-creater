import {
  AbsoluteFill,
  CanvasImage,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ImageScene as ImageSceneType } from "../../project/types";

const isRemote = (src: string) => src.startsWith("http://") || src.startsWith("https://");

export const ImageScene: React.FC<{ scene: ImageSceneType }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const src = isRemote(scene.src) ? scene.src : staticFile(scene.src);

  return (
    <AbsoluteFill name="Image scene" style={{ backgroundColor: "#000" }}>
      <CanvasImage
        name="Photo"
        src={src}
        width={width}
        height={height}
        fit="cover"
        style={{
          width,
          height,
          scale: scene.kenBurns
            ? interpolate(frame, [0, durationInFrames], [1.05, 1.18], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                output: "perceptual-scale",
              })
            : 1,
        }}
      />
      {scene.caption ? (
        <Interactive.Div
          name="Caption"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "48px 64px",
            fontSize: 40,
            fontWeight: 600,
            color: "#fff",
            background: "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))",
            opacity: interpolate(frame, [6, 24], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {scene.caption}
        </Interactive.Div>
      ) : null}
    </AbsoluteFill>
  );
};
