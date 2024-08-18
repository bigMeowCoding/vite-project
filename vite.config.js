// import vue from "@vitejs/plugin-vue";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [vue()];

  return {
    plugins,
    build: {
      minify: false, // 禁用代码压缩
      target: "esnext", // 保持 ES6 语法
    },
  };
});
