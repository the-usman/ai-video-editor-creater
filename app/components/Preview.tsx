import { Player } from "@remotion/player";
import { useMemo } from "react";
import { GeneratedVideo } from "@shared/GeneratedVideo/GeneratedVideo";
import { totalDurationInFrames } from "@shared/project/timeline";
import type { Project } from "@shared/project/types";
import { toPlayerProject } from "../playerProject";
import { c } from "../theme";

export const Preview: React.FC<{ project: Project }> = ({ project }) => {
  const playerProject = useMemo(() => toPlayerProject(project), [project]);
  const durationInFrames = Math.max(1, totalDurationInFrames(project));

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          aspectRatio: `${project.width} / ${project.height}`,
          background: "#000",
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${c.border}`,
        }}
      >
        <Player
          // Re-mount when structural metadata changes so the Player picks it up.
          key={`${project.width}x${project.height}x${project.fps}x${durationInFrames}`}
          component={GeneratedVideo}
          inputProps={{ project: playerProject }}
          durationInFrames={durationInFrames}
          compositionWidth={project.width}
          compositionHeight={project.height}
          fps={project.fps}
          style={{ width: "100%", height: "100%" }}
          controls
          loop
          acknowledgeRemotionLicense
        />
      </div>
      <div style={{ fontSize: 12, color: c.dim }}>
        {(durationInFrames / project.fps).toFixed(1)}s · {project.width}×{project.height} · {project.fps}fps
      </div>
    </div>
  );
};
