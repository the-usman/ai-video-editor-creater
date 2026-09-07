import type { CSSProperties } from "react";

export const c = {
  bg: "#0b1021",
  panel: "#141a2e",
  panel2: "#1b2340",
  border: "#2a355c",
  text: "#e6e9f5",
  dim: "#93a0c8",
  accent: "#5b8cff",
  good: "#37d39b",
  danger: "#ff8080",
};

export const box: CSSProperties = {
  background: c.panel,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
};

export const btn: CSSProperties = {
  background: c.panel2,
  color: c.text,
  border: `1px solid ${c.border}`,
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 13,
  cursor: "pointer",
};

export const primaryBtn: CSSProperties = {
  ...btn,
  background: c.accent,
  color: "#fff",
  border: "none",
};

export const input: CSSProperties = {
  background: c.bg,
  color: c.text,
  border: `1px solid ${c.border}`,
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 13,
  outline: "none",
};

export const label: CSSProperties = { fontSize: 12, color: c.dim };
