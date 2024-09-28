// import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ];

  // plugins.push(i18nAuto(i18nAutoConf));
  return {
    plugins,
    build: {
      minify: false, // 禁用代码压缩
      target: "esnext", // 保持 ES6 语法
    },
  };
});
