import { useEffect, useRef } from "react";
import type { UploadedAsset } from "@shared/project/types";
import type { ChatTurn } from "../api";
import { c, input, primaryBtn } from "../theme";

const EXAMPLES = [
  "Make a 15s slideshow from my photos with a fade between each",
  "Add ‘SUMMER 2026’ over the video, big, top centre",
  "Trim scene 2 to 4s and slow it to 0.5x",
  "Put my music under everything at 40%",
];

export const Chat: React.FC<{
  messages: ChatTurn[];
  busy: boolean;
  draft: string;
  setDraft: (v: string) => void;
  attached: UploadedAsset[];
  onClearAttached: () => void;
  onSend: () => void;
}> = ({ messages, busy, draft, setDraft, attached, onClearAttached, onSend }) => {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, padding: "4px 2px" }}>
        {messages.length === 0 && (
          <div style={{ fontSize: 12.5, color: c.dim, lineHeight: 1.7 }}>
            Add media, then tell me what to build:
            {EXAMPLES.map((e) => (
              <div key={e}>• {e}</div>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "92%",
              background: m.role === "user" ? c.accent : c.panel2,
              color: m.role === "user" ? "#fff" : c.text,
              border: m.role === "user" ? "none" : `1px solid ${c.border}`,
              borderRadius: 10,
              padding: "8px 11px",
              fontSize: 13,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            {m.content}
          </div>
        ))}
        {busy && <div style={{ alignSelf: "flex-start", color: c.dim, fontSize: 12 }}>Claude is editing…</div>}
        <div ref={endRef} />
      </div>

      {attached.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "6px 0" }}>
          {attached.map((a) => (
            <span key={a.src} style={{ fontSize: 11, padding: "2px 6px", borderRadius: 5, background: c.panel2, border: `1px solid ${c.border}` }}>
              📎 {a.name}
            </span>
          ))}
          <button
            onClick={onClearAttached}
            style={{ fontSize: 11, background: "none", border: "none", color: c.dim, cursor: "pointer" }}
          >
            clear
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 6, paddingTop: 8 }}>
        <textarea
          rows={2}
          value={draft}
          disabled={busy}
          placeholder={
            attached.length
              ? `Describe what to do with ${attached.length} selected file(s)…`
              : "Describe the video or an edit…"
          }
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          style={{ ...input, flex: 1, resize: "none", fontFamily: "inherit" }}
        />
        <button style={{ ...primaryBtn, opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={onSend}>
          Send
        </button>
      </div>
    </div>
  );
};
