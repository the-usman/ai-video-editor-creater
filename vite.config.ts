import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const projectRoot = dirname(fileURLToPath(import.meta.url));

// Root is the project root (not app/) so that both app/ and src/ are served
// under "/" — this avoids Vite's "/@fs/" URLs, which break when the project
// path contains a space (e.g. C:\Users\NEXT GEN\...). The editor is at /app/.
export default defineConfig({
  plugins: [react()],
  root: projectRoot,
  publicDir: false,
  resolve: {
    alias: { "@shared": resolve(projectRoot, "src") },
  },
  build: {
    outDir: resolve(projectRoot, "dist-app"),
    emptyOutDir: true,
    rollupOptions: { input: resolve(projectRoot, "app/index.html") },
  },
  server: {
    port: 5173,
    open: "/app/",
    proxy: {
      // timeout 0 so a multi-minute /api/render request isn't cut off
      "/api": { target: "http://localhost:3001", timeout: 0, proxyTimeout: 0 },
      "/uploads": "http://localhost:3001",
    },
  },
});
