import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    // backend/ and admin/ are separate apps (Django backend, admin React app) living
    // as siblings in this repo — Vite has no reason to watch them, and Python's venv
    // in particular contains locked binaries during creation that crash the watcher.
    watch: {
      ignored: ["**/backend/**", "**/admin/**"],
    },
  },
});
