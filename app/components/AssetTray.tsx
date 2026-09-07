import { useRef } from "react";
import type { UploadedAsset } from "@shared/project/types";
import { btn, c, label } from "../theme";

const ASSET_HOST = "http://localhost:3001";
const url = (src: string) =>
  src.startsWith("http") ? src : `${ASSET_HOST}/${src.replace(/^\/+/, "")}`;

const fmt = (s?: number) =>
  s === undefined ? "" : s >= 60 ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}` : `${s.toFixed(1)}s`;

export const AssetTray: React.FC<{
  assets: UploadedAsset[];
  selected: string[];
  onToggleSelect: (src: string) => void;
  onPick: (files: File[]) => void;
  onQuickAdd: (asset: UploadedAsset) => void;
  onDelete: (src: string, name: string) => void;
}> = ({ assets, selected, onToggleSelect, onPick, onQuickAdd, onDelete }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={label}>MEDIA ({assets.length})</span>
        <button style={{ ...btn, padding: "4px 10px" }} onClick={() => fileRef.current?.click()}>
          ＋ Add files
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="video/*,image/*,audio/*"
          multiple
          hidden
          onChange={(e) => {
            onPick(Array.from(e.target.files ?? []));
            e.currentTarget.value = "";
          }}
        />
      </div>

      {assets.length === 0 ? (
        <div style={{ fontSize: 12, color: c.dim, padding: "10px 0" }}>
          Drop a video, images or music anywhere in this panel.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))",
            gap: 8,
          }}
        >
          {assets.map((a) => {
            const isSel = selected.includes(a.src);
            return (
              <div
                key={a.src}
                title={a.name}
                onClick={() => onToggleSelect(a.src)}
                style={{
                  position: "relative",
                  borderRadius: 8,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: `2px solid ${isSel ? c.accent : "transparent"}`,
                  background: c.bg,
                }}
              >
                <div style={{ aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {a.kind === "image" && (
                    <img src={url(a.src)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                  {a.kind === "video" && (
                    <video src={url(a.src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                  {a.kind === "audio" && <span style={{ fontSize: 26 }}>🎵</span>}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    fontSize: 10,
                    padding: "2px 4px",
                    background: "rgba(0,0,0,0.6)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {a.name}
                  {a.durationInSeconds ? ` · ${fmt(a.durationInSeconds)}` : ""}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd(a);
                  }}
                  title="Add straight to the video"
                  style={{
                    position: "absolute",
                    top: 3,
                    right: 3,
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: "none",
                    background: c.accent,
                    color: "#fff",
                    fontSize: 13,
                    lineHeight: "20px",
                    cursor: "pointer",
                  }}
                >
                  ＋
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(a.src, a.name);
                  }}
                  title="Delete this file"
                  style={{
                    position: "absolute",
                    top: 3,
                    left: 3,
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: "none",
                    background: "rgba(0,0,0,0.65)",
                    color: "#ff8080",
                    fontSize: 12,
                    lineHeight: "20px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
