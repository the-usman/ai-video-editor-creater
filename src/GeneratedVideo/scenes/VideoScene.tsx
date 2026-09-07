import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { VideoScene as VideoSceneType } from "../../project/types";

const isRemote = (src: string) => src.startsWith("http://") || src.startsWith("https://");

export const VideoScene: React.FC<{ scene: VideoSceneType }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const src = isRemote(scene.src) ? scene.src : staticFile(scene.src);

  return (
    <AbsoluteFill name="Video scene" style={{ backgroundColor: "#000" }}>
      <Video
        name="Uploaded clip"
        src={src}
        trimBefore={Math.round(scene.trimStartSeconds * fps)}
        playbackRate={scene.speed || 1}
        objectFit="cover"
        style={{ width: "100%", height: "100%" }}
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
