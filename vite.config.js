// import vue from "@vitejs/plugin-vue";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";
import externalGlobals from "rollup-plugin-external-globals";

const globals = externalGlobals({
  echarts: "echarts",
});

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [
    vue(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
      open: true,
    }),
  ];

  return {
    plugins,
    build: {
      rollupOptions: {
        external: ["echarts"],
        plugins: [globals],
      },
    },
  };
});
