import { useState } from "react";
import { createImage, type ImageProviderChoice } from "../api";
import { box, btn, c, input, label, primaryBtn } from "../theme";

const SIZES = [
  { label: "Wide 16:9", w: 1280, h: 720 },
  { label: "Vertical 9:16", w: 1080, h: 1920 },
  { label: "Square", w: 1024, h: 1024 },
] as const;

export const ImageMaker: React.FC<{
  setStatus: (s: string) => void;
}> = ({ setStatus }) => {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState<"" | ImageProviderChoice>(""); // "" = auto
  const [sizeKey, setSizeKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ src: string; name: string } | null>(null);
  const [error, setError] = useState("");

  const create = async () => {
    if (!prompt.trim() || busy) return;
    setError("");
    setResult(null);
    setBusy(true);
    setStatus("Creating your image…");
    try {
      const size = SIZES[sizeKey];
      const r = await createImage({
        prompt: prompt.trim(),
        provider: provider === "" ? undefined : provider,
        width: size.w,
        height: size.h,
      });
      if (r.error) {
        setError(r.error);
        setStatus("Could not create the image");
      } else if (r.src && r.name) {
        setResult({ src: r.src, name: r.name });
        setStatus("Image created ✓");
      } else {
        setError("The server returned no image.");
        setStatus("Could not create the image");
      }
    } catch {
      setError("Could not reach the server.");
      setStatus("Could not create the image");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = `${result.src}?t=${Date.now()}`;
    a.download = result.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minHeight: 0, overflowY: "auto" }}>
      <div style={{ ...box, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Create an image</div>
        <label style={{ ...label }}>What should the image show?</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. a neon city street at night, cinematic, highly detailed"
          rows={3}
          disabled={busy}
          style={{ ...input, resize: "vertical", minHeight: 64 }}
        />

        <label style={{ ...label }}>Who creates it?</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(
            [
              ["", "Auto"],
              ["fal", "fal.ai"],
              ["pollinations", "Free AI"],
              ["typography", "Text poster"],
            ] as const
          ).map(([value, text]) => (
            <button
              key={value}
              disabled={busy}
              onClick={() => setProvider(value)}
              style={{
                ...btn,
                flex: 1,
                whiteSpace: "nowrap",
                background: provider === value ? c.accent : c.panel,
                color: provider === value ? c.text : c.dim,
                border: `1px solid ${provider === value ? c.accent : c.border}`,
              }}
            >
              {text}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 11, color: c.dim }}>
          {provider === "typography"
            ? "Text poster — a typographic design in a different font. No key, works offline."
            : provider === "fal"
              ? "fal.ai — best quality, needs FAL_KEY in .env."
              : provider === ""
                ? "Auto — fal.ai if a key is set, otherwise the free Pollinations.ai."
                : "Pollinations.ai — free, no API key required."}
        </span>

        <label style={{ ...label }}>Size</label>
        <div style={{ display: "flex", gap: 6 }}>
          {SIZES.map((s, i) => (
            <button
              key={s.label}
              disabled={busy}
              onClick={() => setSizeKey(i)}
              style={{
                ...btn,
                flex: 1,
                whiteSpace: "nowrap",
                background: sizeKey === i ? c.accent : c.panel,
                color: sizeKey === i ? c.text : c.dim,
                border: `1px solid ${sizeKey === i ? c.accent : c.border}`,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          style={{ ...primaryBtn, fontWeight: 700, cursor: busy ? "default" : "pointer" }}
          disabled={busy}
          onClick={() => void create()}
        >
          {busy ? "Creating…" : "🖼 Generate image"}
        </button>
        {error && <span style={{ fontSize: 12, color: "#ff6b6b" }}>{error}</span>}
      </div>

      {result && (
        <div style={{ ...box, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ ...label }}>
            Done — {result.name.endsWith(".svg") ? "a vector text poster" : "your image"}
          </label>
          <img
            src={`${result.src}?t=${Date.now()}`}
            alt="Created image"
            style={{ width: "100%", borderRadius: 8, border: `1px solid ${c.border}`, maxHeight: 420, objectFit: "contain", background: "#000" }}
          />
          <button style={{ ...primaryBtn, background: c.good, color: "#04231a", fontWeight: 700, cursor: "pointer" }} onClick={download}>
            ⬇ Download {result.name.endsWith(".svg") ? ".svg" : ""}
          </button>
        </div>
      )}

      <p style={{ fontSize: 12, color: c.dim, lineHeight: 1.6 }}>
        Describe an image and it is created here, then saved to your computer with
        <b> Download</b>. Use <b>Text poster</b> to make a typographic image from your words with a
        different font — nothing to install, works offline.
      </p>
    </div>
  );
};