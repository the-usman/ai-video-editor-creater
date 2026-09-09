import {
  linearTiming,
  TransitionSeries,
  type TransitionPresentation,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile } from "remotion";
import { defaultProject } from "../project/defaultProject";
import {
  sceneDurationInFrames,
  transitionDurationInFrames,
} from "../project/timeline";
import type { Project, Scene, TextScene as TextSceneType } from "../project/types";
import { ImageScene } from "./scenes/ImageScene";
import { Overlays } from "./scenes/Overlays";
import { TextScene } from "./scenes/TextScene";
import { VideoScene } from "./scenes/VideoScene";
import { CustomScenes, type CustomSceneProps } from "../generated/CustomScenes";

export type GeneratedVideoProps = {
  project: Project;
};

const isRemote = (src: string) => src.startsWith("http://") || src.startsWith("https://");

/** Renders an LLM-written / hand-edited custom scene from src/generated/CustomScenes.tsx. */
const CustomView: React.FC<{ scene: TextSceneType; comp: React.FC<CustomSceneProps> }> = ({
  scene,
  comp: Comp,
}) => {
  const words =
    scene.kineticWords && scene.kineticWords.length > 0
      ? scene.kineticWords.map((w) => w.text)
      : (scene.prompt || scene.subtitle || "").split(/\s+/).filter(Boolean);
  const secondaryColor =
    scene.kineticWords && scene.kineticWords.length > 1 ? scene.kineticWords[1].color : undefined;
  const accent = secondaryColor ?? (scene.color === "#ffffff" ? "#FF0063" : scene.color);
  const props: CustomSceneProps = {
    scene: {
      caption: scene.prompt || scene.subtitle || "",
      narration: scene.subtitle || "",
      background: scene.background,
      color: scene.color,
      accent,
      tagline: scene.tagline,
      design: scene.design ?? scene.prompt,
      words,
    },
  };
  return <Comp scene={props.scene} />;
};

const SceneRenderer: React.FC<{ scene: Scene }> = ({ scene }) => {
  const custom =
    scene.type === "text" &&
    scene.variant === "custom" &&
    scene.customIndex != null &&
    CustomScenes[scene.customIndex]
      ? { comp: CustomScenes[scene.customIndex]!, scene: scene as TextSceneType }
      : null;
  return (
    <AbsoluteFill>
      {custom ? (
        <CustomView scene={custom.scene} comp={custom.comp} />
      ) : scene.type === "text" ? (
        <TextScene scene={scene} />
      ) : scene.type === "image" ? (
        <ImageScene scene={scene} />
      ) : (
        <VideoScene scene={scene} />
      )}
      {scene.audioSrc ? (
        <Audio
          name="Scene voiceover"
          src={isRemote(scene.audioSrc) ? scene.audioSrc : staticFile(scene.audioSrc)}
        />
      ) : null}
      <Overlays
        overlays={scene.overlays}
        sceneDurationInSeconds={scene.durationInSeconds}
      />
    </AbsoluteFill>
  );
};

type AnyPresentation = TransitionPresentation<Record<string, unknown>>;

const presentationFor = (project: Project): AnyPresentation | null => {
  switch (project.transition) {
    case "fade":
      return fade() as unknown as AnyPresentation;
    case "slide":
      return slide() as unknown as AnyPresentation;
    case "wipe":
      return wipe() as unknown as AnyPresentation;
    default:
      return null;
  }
};

// NOTE: scenes are generated from `project.json` (built in the Builder panel),
// so the timeline is rendered from data rather than hand-authored clips. Edit
// scenes in the Builder chat UI, not the Studio timeline.
export const GeneratedVideo: React.FC<GeneratedVideoProps> = ({
  project = defaultProject,
}) => {
  const { scenes, fps } = project;
  const presentation = presentationFor(project);
  const transitionFrames = transitionDurationInFrames(project);

  const audio = project.audio;
  const audioSrc = audio
    ? isRemote(audio.src)
      ? audio.src
      : staticFile(audio.src)
    : null;

  if (scenes.length === 0) {
    return <AbsoluteFill style={{ backgroundColor: "#0b1021" }} />;
  }

  const children: React.ReactNode[] = [];
  scenes.forEach((scene, index) => {
    if (index > 0 && presentation) {
      children.push(
        <TransitionSeries.Transition
          key={`transition-${scene.id}`}
          presentation={presentation}
          timing={linearTiming({ durationInFrames: transitionFrames })}
        />,
      );
    }
    children.push(
      <TransitionSeries.Sequence
        key={scene.id}
        name={scene.type}
        durationInFrames={sceneDurationInFrames(scene, fps)}
      >
        <SceneRenderer scene={scene} />
      </TransitionSeries.Sequence>,
    );
  });

  return (
    <AbsoluteFill>
      {audioSrc && audio ? (
        <Audio name="Background audio" src={audioSrc} volume={() => audio.volume} />
      ) : null}
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
