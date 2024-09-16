// vitest.config.js
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

const config = defineConfig({
  plugins: [vue()], // 加载 @vitejs/plugin-vue 插件
  test: {
    setupFiles: "./vitest.setup.js",
    environment: "jsdom", // 确保使用 jsdom 环境
    globals: true, // 如果需要全局对象，如 describe, it
  },
});

module.exports = config;
