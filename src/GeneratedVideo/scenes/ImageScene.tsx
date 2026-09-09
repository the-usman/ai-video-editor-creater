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
import { Wordpop } from "./Wordpop";

const isRemote = (src: string) => src.startsWith("http://") || src.startsWith("https://");

export const ImageScene: React.FC<{ scene: ImageSceneType }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const src = isRemote(scene.src) ? scene.src : staticFile(scene.src);
  const hasBg = !!scene.background;

  // When a background color is set the image is shown as a card; otherwise it covers the whole frame.
  const imgW = hasBg ? Math.round(width * 0.72) : width;
  const imgH = hasBg ? Math.round(height * 0.72) : height;

  return (
    <AbsoluteFill
      name="Image scene"
      style={{ backgroundColor: scene.background ?? "#000" }}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CanvasImage
          name="Photo"
          src={src}
          width={imgW}
          height={imgH}
          fit="cover"
          style={{
            width: imgW,
            height: imgH,
            borderRadius: hasBg ? 12 : 0,
            boxShadow: hasBg ? "0 8px 40px rgba(0,0,0,0.45)" : undefined,
            scale: scene.kenBurns
              ? interpolate(frame, [0, durationInFrames], [1.05, 1.18], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  output: "perceptual-scale",
                })
              : 1,
          }}
        />
      </AbsoluteFill>
      {scene.caption ? (
        <Interactive.Div
          name="Caption"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: hasBg ? "32px 64px" : "48px 64px",
            background: hasBg
              ? "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))"
              : scene.variant === "wordpop"
                ? "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))"
                : "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))",
          }}
        >
          {scene.variant === "wordpop" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                opacity: interpolate(frame, [4, 16], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <Wordpop text={scene.caption} color="#fff" startFrame={0} fontSize={38} />
            </div>
          ) : (
            <Interactive.Div
              style={{
                fontSize: 38,
                fontWeight: 600,
                color: "#fff",
                opacity: interpolate(frame, [6, 24], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {scene.caption}
            </Interactive.Div>
          )}
        </Interactive.Div>
      ) : null}
    </AbsoluteFill>
  );
};