import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    target: "esnext",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: fileURLToPath(new URL("./src/setupTests.js", import.meta.url)),
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{js,jsx}"],
    },
  },
});
