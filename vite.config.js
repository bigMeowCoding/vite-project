// import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import i18nAuto from "./i18n-plugin/index.js";
import path from "node:path";

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
  const i18nAutoConf = {
    output: {
      path: path.resolve("src/assets"),
    },
    include: ["**.js", "**.vue"], // 针对什么文件进行国际化词条
    exclude: ["src/i18n/index.js"],
    i18nCallee: "i18n.global.t", // 例子
    dependency: {
      // 例子
      name: "i18n",
      value: "/src/i18n/index.js",
    },
    sourceMap: true, // 生成映射文件
    transform: {},
  };
  if (command === "serve") {
    i18nAutoConf.mode = command;
  } else if (command === "build") {
    i18nAutoConf.mode = command;
    i18nAutoConf.translate = {
      on: true,
      secretId: "AKIDgFwacZMwOccTBwmS7phWUK0c4Reknlw7", // 请输入你的腾讯翻译api的用户secretId
      secretKey: "S0XvNlAXsBc9Ow7ZAkuDZIMVvPE0xv1k", // 请输
    };
  }
  plugins.push(i18nAuto(i18nAutoConf));
  return {
    plugins,
  };
});
