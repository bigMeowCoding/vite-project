// import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import topLevelAwait from "vite-plugin-top-level-await";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import i18nAuto from "./i18n-plugin/index.js";
import path from "node:path";
import { federation } from "@module-federation/vite";
// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [vue(), AutoImport({}), Components({})];
  const i18nAutoConf = {
    server: { hmr: true },
    output: {
      generate: true,
      path: path.resolve("src/assets"),
    },
    include: ["**.js", "**.vue"], // 针对什么文件进行国际化词条
    exclude: ["src/i18n/index.js", "**/node_modules/**"],
    i18nCallee: "i18n.global.t", // 例子
    dependency: {
      // 例子
      name: "i18n",
      value: "/src/i18n/index.js",
    },
    transform: true, // 转译源码
    sourceMap: false, // 生成映射文件
  };
  if (command === "serve") {
    i18nAutoConf.mode = command;
  } else if (command === "build") {
    i18nAutoConf.mode = command;
    i18nAutoConf.translate = {
      on: false, // 开启自动翻译
      lang: ["en", "zh-TW"],
    };
  }
  plugins.push(
    i18nAuto(i18nAutoConf),
    federation({
      name: "vite_project",
      shareStrategy: "loaded-first",
      filename: "remoteEntry.js",

      remotes: {
        // vite_child_1: {
        //   type: "module",
        //   name: "vite_child_1",
        //   entry: "http://localhost:3001/remoteEntry.js?vite_child_1",
        //   entryGlobalName: "remote",
        //   shareScope: "default",
        // },
        vite_child_1: {
          type: "module",
          name: "vite_child_1",
          entry: "http://localhost:3001/remoteEntry.js",
          // entryGlobalName: "remote",
          // shareScope: "default",
        },

        // vite_child_2: {
        //   type: "module",
        //   name: "vite_child_2",
        //   entry: "http://localhost:3002/remoteEntry-[hash].js",
        // },
      },
      manifest: true,

      // shared: ["vue", "element-plus"],
    }),
    false && topLevelAwait()
  );
  return {
    plugins,
    server: {
      hmr: { overlay: false },
    },
    build: {
      minify: false, // 禁用代码压缩
      target: "chrome89",
    },
  };
});
