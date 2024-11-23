module.exports = {
  input: "example/utils",
  // input: "example/components",
  output: "",

  exclude: ["**/node_modules/**/*"],
  rules: {
    js: {
      caller: "",
      functionName: "$t",
      customizeKey: function getCustomizeKey(key, path) {
        key = key.replace(/\./g, "_").replace(/ /g, "").replace(/\[|\]/g, "_");
        return `${key}`;
      },
      importDeclaration:
        "import i18n from '@locales/'\nconst $t = i18n.global.t",
    },
    ts: {
      caller: "",
      functionName: "$t",
      customizeKey: function getCustomizeKey(key, path) {
        key = key.replace(/\./g, "_").replace(/ /g, "").replace(/\[|\]/g, "_");
        path =
          path === null || path === void 0 ? void 0 : path.replace("./", "");
        const [type, ...fullPathArr] = (path || "").slice(4, -4).split("/");
        if (type === "views") {
          const [moduleName] = fullPathArr;
          return `${moduleName}.${key}`;
        }
        return `common.${key}`;
      },
      importDeclaration:
        "import i18n from '@locales/'\nconst $t = i18n.global.t",
    },
    cjs: {
      caller: "",
      functionName: "$t",
      customizeKey: function getCustomizeKey(key, path) {
        key = key.replace(/\./g, "_").replace(/ /g, "").replace(/\[|\]/g, "_");
        path =
          path === null || path === void 0 ? void 0 : path.replace("./", "");
        const [type, ...fullPathArr] = (path || "").slice(4, -4).split("/");
        if (type === "views") {
          const [moduleName] = fullPathArr;
          return `${moduleName}.${key}`;
        }
        return `common.${key}`;
      },
      importDeclaration:
        "import i18n from '@locales/'\nconst $t = i18n.global.t",
    },
    mjs: {
      caller: "",
      functionName: "$t",
      customizeKey: function getCustomizeKey(key, path) {
        key = key.replace(/\./g, "_").replace(/ /g, "").replace(/\[|\]/g, "_");
        path =
          path === null || path === void 0 ? void 0 : path.replace("./", "");
        const [type, ...fullPathArr] = (path || "").slice(4, -4).split("/");
        if (type === "views") {
          const [moduleName] = fullPathArr;
          return `${moduleName}.${key}`;
        }
        return `common.${key}`;
      },
      importDeclaration:
        "import i18n from '@locales/'\nconst $t = i18n.global.t",
    },
    jsx: {
      caller: "",
      functionName: "$t",
      customizeKey: function getCustomizeKey(key, path) {
        key = key.replace(/\./g, "_").replace(/ /g, "").replace(/\[|\]/g, "_");
        path =
          path === null || path === void 0 ? void 0 : path.replace("./", "");
        const [type, ...fullPathArr] = (path || "").slice(4, -4).split("/");
        if (type === "views") {
          const [moduleName] = fullPathArr;
          return `${moduleName}.${key}`;
        }
        return `common.${key}`;
      },
      importDeclaration:
        "import i18n from '@locales/'\nconst $t = i18n.global.t",
      functionSnippets: "",
    },
    tsx: {
      caller: "",
      functionName: "$t",
      customizeKey: function getCustomizeKey(key, path) {
        key = key.replace(/\./g, "_").replace(/ /g, "").replace(/\[|\]/g, "_");
        path =
          path === null || path === void 0 ? void 0 : path.replace("./", "");
        const [type, ...fullPathArr] = (path || "").slice(4, -4).split("/");
        if (type === "views") {
          const [moduleName] = fullPathArr;
          return `${moduleName}.${key}`;
        }
        return `common.${key}`;
      },
      importDeclaration:
        "import i18n from '@locales/'\nconst $t = i18n.global.t",
      functionSnippets: "",
    },
    vue: {
      caller: "",
      importDeclaration:
        "import i18n from '@locales/'\nconst $t = i18n.global.t",
      functionNameInTemplate: "$t",
      functionNameInScript: "$t",
      customizeKey: function getCustomizeKey(key, path) {
        key = key.replace(/\./g, "_").replace(/ /g, "").replace(/\[|\]/g, "_");

        return `${key}`;
      },
      tagOrder: ["template", "script", "scriptSetup", "style"],
    },
  },
  prettier: {
    printWidth: 100,
    tabWidth: 2,
    semi: true,
    singleAttributePerLine: false,
    bracketSpacing: true,
    singleQuote: true,
    arrowParens: "avoid",
  },
  incremental: false,
  skipExtract: false,
  localePath: "./example/assets",
  localeFileType: "json",
  translateJsonPath: "./locales/auto-translate",
  excelPath: "./locales/excel/locales.xlsx",
  transferPath: "./locales/translate",
  exportExcel: false,
  skipTranslate: true,
  locales: ["en", "zh-tw"],
  globalRule: {
    ignoreMethods: ["defineProps", "withDefaults", "hkLocaleReplace"],
  },
  adjustKeyMap: function (allKeyValue) {
    return allKeyValue;
  },
};
