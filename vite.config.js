// import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// import { defineConfig } from "vite";
// import i18nAuto from "rollup-plugin-i18n-auto";
// import path from "path";
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [

//     i18nAuto({
//       include: ["**.js", "**.vue"], // 针对什么文件进行国际化词条
//       i18nCallee: "i18n.global.t", // 对需要进行国际化的词条进行转换的函数名
//       dependency: {
//         // 对需要进行国际化的词条进行转换的函数的引入依赖
//         name: "i18n",
//         value: "/src/i18n/index.js",
//       },
//       sourceMap: true,
//       transform: true,
//       output: {
//         generate: true // 生成代码词条配置文件，默认为true，不写也可以
//       },
//     }),
//   ],
// });

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import i18nAuto from "rollup-plugin-i18n-auto";
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

  };
  if (command === "serve") {
    i18nAutoConf.mode = command;
  } else if (command === "build") {
    i18nAutoConf.mode = command;
    i18nAutoConf.translate = {
      on: true,
    };
  }
  plugins.push(i18nAuto(i18nAutoConf));
  return {
    plugins,
  };
});
