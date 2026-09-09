import { Easing, interpolate, useCurrentFrame } from "remotion";

export const Wordpop: React.FC<{
  text: string;
  color: string;
  startFrame: number;
  fontSize: number;
}> = ({ text, color, startFrame, fontSize }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ").filter(Boolean);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.22em",
        maxWidth: "100%",
      }}
    >
      {words.map((word, i) => {
        const start = startFrame + i * 11;
        const opacity = interpolate(frame, [start, start + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const scale = interpolate(frame, [start, start + 12], [1.6, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const rise = interpolate(frame, [start, start + 12], [18, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontSize,
              fontWeight: 800,
              lineHeight: 1.12,
              color,
              opacity,
              transform: `translateY(${rise}px) scale(${scale})`,
              textShadow: "0 4px 26px rgba(0,0,0,0.35)",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};