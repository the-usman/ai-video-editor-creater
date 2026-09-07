import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { OverlayPosition, TextOverlay } from "../../project/types";

const anchor = (position: OverlayPosition): React.CSSProperties => {
  const vertical: React.CSSProperties = position.startsWith("top")
    ? { top: "6%" }
    : position.startsWith("bottom")
      ? { bottom: "6%" }
      : { top: "50%", translate: "0 -50%" };
  const align: React.CSSProperties["alignItems"] = position.endsWith("-left")
    ? "flex-start"
    : position.endsWith("-right")
      ? "flex-end"
      : "center";
  return {
    position: "absolute",
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: align,
    padding: "0 5%",
    ...vertical,
  };
};

export const Overlays: React.FC<{
  overlays: TextOverlay[];
  sceneDurationInSeconds: number;
}> = ({ overlays, sceneDurationInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {overlays.map((ov) => {
        const start = ov.startSeconds * fps;
        const end = Math.min(ov.endSeconds, sceneDurationInSeconds + 1) * fps;
        const opacity = interpolate(
          frame,
          [start, start + 8, Math.max(start + 9, end - 8), end],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <div key={ov.id} style={anchor(ov.position)}>
            <Interactive.Div
              name="Overlay"
              style={{
                display: "inline-block",
                maxWidth: "100%",
                textAlign: "center",
                fontSize: ov.fontSize,
                fontWeight: 800,
                lineHeight: 1.15,
                color: ov.color,
                opacity,
                padding: ov.background ? "0.15em 0.4em" : 0,
                backgroundColor: ov.background || "transparent",
                borderRadius: ov.background ? 12 : 0,
                textShadow: ov.background ? "none" : "0 2px 12px rgba(0,0,0,0.6)",
              }}
            >
              {ov.text}
            </Interactive.Div>
          </div>
        );
      })}
    </>
  );
};
