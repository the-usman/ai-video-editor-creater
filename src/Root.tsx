import "./index.css";
import { Composition } from "remotion";
import { GeneratedVideo } from "./GeneratedVideo/GeneratedVideo";
import { defaultProject } from "./project/defaultProject";
import { loadProject } from "./project/loadProject";
import { totalDurationInFrames } from "./project/timeline";

// The editing UI lives in the standalone app (`npm run dev` → http://localhost:5173).
// This composition is what that app previews and what `npm run render` exports.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GeneratedVideo"
      component={GeneratedVideo}
      durationInFrames={totalDurationInFrames(defaultProject)}
      fps={defaultProject.fps}
      width={defaultProject.width}
      height={defaultProject.height}
      defaultProps={{ project: defaultProject }}
      calculateMetadata={async () => {
        const project = await loadProject();
        return {
          props: { project },
          durationInFrames: totalDurationInFrames(project),
          fps: project.fps,
          width: project.width,
          height: project.height,
        };
      }}
    />
  );
};
