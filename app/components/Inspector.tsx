import { applyAction } from "@shared/project/operations";
import type {
  OverlayPosition,
  Project,
  Scene,
  TextOverlay,
  TextScene,
  VideoScene,
} from "@shared/project/types";
import { btn, c, input, label } from "../theme";

const OVERLAY_POSITIONS: OverlayPosition[] = [
  "top",
  "center",
  "bottom",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

let ovc = 0;
const newOverlayId = () => `ov-${Date.now().toString(36)}-${(ovc++).toString(36)}`;

export const Inspector: React.FC<{
  project: Project;
  onChange: (p: Project) => void;
}> = ({ project, onChange }) => {
  const patch = (id: string, p: Partial<Scene>) =>
    onChange({
      ...project,
      scenes: project.scenes.map((s) => (s.id === id ? ({ ...s, ...p } as Scene) : s)),
    });

  const act = (name: string, args: Record<string, unknown>) => {
    try {
      onChange(applyAction(project, name, args).project);
    } catch {
      /* ignore invalid manual op */
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={label}>TIMELINE ({project.scenes.length})</span>
        <label style={{ ...label, display: "flex", gap: 6, alignItems: "center" }}>
          transition
          <select
            value={project.transition}
            style={{ ...input, padding: "4px 6px" }}
            onChange={(e) => onChange({ ...project, transition: e.target.value as Project["transition"] })}
          >
            <option value="none">none</option>
            <option value="fade">fade</option>
            <option value="slide">slide</option>
            <option value="wipe">wipe</option>
          </select>
        </label>
      </div>

      {project.scenes.map((scene, i) => (
        <div key={scene.id} style={{ background: c.panel2, border: `1px solid ${c.border}`, borderRadius: 10, padding: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <b style={{ fontSize: 12 }}>
              {i + 1}. {scene.type.toUpperCase()}
            </b>
            <div style={{ display: "flex", gap: 4 }}>
              <button style={{ ...btn, padding: "1px 7px" }} disabled={i === 0} onClick={() => act("reorder_scene", { from: i + 1, to: i })}>↑</button>
              <button style={{ ...btn, padding: "1px 7px" }} disabled={i === project.scenes.length - 1} onClick={() => act("reorder_scene", { from: i + 1, to: i + 2 })}>↓</button>
              <button style={{ ...btn, padding: "1px 7px" }} title="split in half" onClick={() => act("split_scene", { scene: i + 1, atSeconds: scene.durationInSeconds / 2 })}>⁄</button>
              <button style={{ ...btn, padding: "1px 7px", color: c.danger }} onClick={() => act("delete_scene", { scene: i + 1 })}>✕</button>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <label style={label}>
              dur{" "}
              <input
                type="number"
                min={0.2}
                step={0.5}
                value={scene.durationInSeconds}
                style={{ ...input, width: 58, padding: "3px 5px" }}
                onChange={(e) => patch(scene.id, { durationInSeconds: Number(e.target.value) || 1 })}
              />
              s
            </label>

            {scene.type === "text" && (
              <>
                <input
                  value={scene.prompt}
                  style={{ ...input, width: 150, padding: "3px 6px" }}
                  onChange={(e) => patch(scene.id, { prompt: e.target.value } as Partial<TextScene>)}
                />
                <input
                  type="color"
                  value={scene.background}
                  style={{ width: 28, height: 22, border: "none", background: "none" }}
                  onChange={(e) => patch(scene.id, { background: e.target.value } as Partial<TextScene>)}
                />
              </>
            )}
            {scene.type === "image" && (
              <label style={label}>
                <input type="checkbox" checked={scene.kenBurns} onChange={(e) => patch(scene.id, { kenBurns: e.target.checked })} /> zoom
              </label>
            )}
            {scene.type === "video" && (
              <>
                {(() => {
                  const asset = project.assets.find((x) => x.src === scene.src);
                  if (!asset?.durationInSeconds) return null;
                  const full = Math.max(
                    0.2,
                    (asset.durationInSeconds - scene.trimStartSeconds) / (scene.speed || 1),
                  );
                  return (
                    <button
                      style={{ ...btn, padding: "2px 7px" }}
                      title={`Use the whole clip (${asset.durationInSeconds.toFixed(1)}s)`}
                      onClick={() => patch(scene.id, { durationInSeconds: Math.round(full * 10) / 10 })}
                    >
                      full clip
                    </button>
                  );
                })()}
                <label style={label}>
                  trim{" "}
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={scene.trimStartSeconds}
                    style={{ ...input, width: 52, padding: "3px 5px" }}
                    onChange={(e) => patch(scene.id, { trimStartSeconds: Math.max(0, Number(e.target.value) || 0) } as Partial<VideoScene>)}
                  />
                  s
                </label>
                <label style={label}>
                  speed{" "}
                  <input
                    type="number"
                    min={0.25}
                    max={4}
                    step={0.25}
                    value={scene.speed}
                    style={{ ...input, width: 52, padding: "3px 5px" }}
                    onChange={(e) => patch(scene.id, { speed: Math.min(4, Math.max(0.25, Number(e.target.value) || 1)) } as Partial<VideoScene>)}
                  />
                  x
                </label>
              </>
            )}
            {(scene.type === "image" || scene.type === "video") && (
              <input
                placeholder="caption"
                value={scene.caption}
                style={{ ...input, width: 140, padding: "3px 6px" }}
                onChange={(e) => patch(scene.id, { caption: e.target.value } as Partial<Scene>)}
              />
            )}
          </div>

          <OverlayEditor
            overlays={scene.overlays}
            sceneDuration={scene.durationInSeconds}
            onChange={(overlays) => patch(scene.id, { overlays })}
          />
        </div>
      ))}
    </div>
  );
};

const OverlayEditor: React.FC<{
  overlays: TextOverlay[];
  sceneDuration: number;
  onChange: (o: TextOverlay[]) => void;
}> = ({ overlays, sceneDuration, onChange }) => (
  <div style={{ marginTop: 8, borderTop: `1px dashed ${c.border}`, paddingTop: 6 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
      <span style={label}>OVERLAYS ({overlays.length})</span>
      <button
        style={{ ...btn, padding: "1px 7px" }}
        onClick={() =>
          onChange([
            ...overlays,
            {
              id: newOverlayId(),
              text: "New text",
              position: "bottom",
              startSeconds: 0,
              endSeconds: sceneDuration,
              fontSize: 48,
              color: "#ffffff",
              background: "",
            },
          ])
        }
      >
        ＋ text on top
      </button>
    </div>
    {overlays.map((ov, i) => (
      <div key={ov.id} style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", marginBottom: 3 }}>
        <input
          value={ov.text}
          style={{ ...input, width: 130, padding: "2px 5px" }}
          onChange={(e) => onChange(overlays.map((o, j) => (j === i ? { ...o, text: e.target.value } : o)))}
        />
        <select
          value={ov.position}
          style={{ ...input, padding: "2px 5px" }}
          onChange={(e) => onChange(overlays.map((o, j) => (j === i ? { ...o, position: e.target.value as OverlayPosition } : o)))}
        >
          {OVERLAY_POSITIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={ov.fontSize}
          style={{ ...input, width: 48, padding: "2px 5px" }}
          onChange={(e) => onChange(overlays.map((o, j) => (j === i ? { ...o, fontSize: Number(e.target.value) || 48 } : o)))}
        />
        <input
          type="color"
          value={ov.color}
          style={{ width: 24, height: 20, border: "none", background: "none" }}
          onChange={(e) => onChange(overlays.map((o, j) => (j === i ? { ...o, color: e.target.value } : o)))}
        />
        <button style={{ ...btn, padding: "0 6px", color: c.danger }} onClick={() => onChange(overlays.filter((_, j) => j !== i))}>
          ✕
        </button>
      </div>
    ))}
  </div>
);
