import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Project site on GitHub Pages: https://<user>.github.io/Azad-Agro-website/
  base: process.env.GITHUB_PAGES === "1" ? "/Azad-Agro-website/" : "/",
  server: {
    host: true,
    port: 5173,
  },
});
