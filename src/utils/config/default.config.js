// 参数path，在生成配置文件时需要展示在文件里，所以这里去掉eslint校验
function getCustomizeKey(key, path) {
  key = key.replace(/\./g, "_").replace(/ /g, "").replace(/\[|\]/g, "_");
  path = path?.replace("./", "");
  const [type, ...fullPathArr] = (path || "").slice(4, -4).split("/");
  if (type === "views") {
    const [moduleName] = fullPathArr;
    return `${moduleName}.${key}`;
  }
  return `common.${key}`;
}

const importCode = `import i18n from '@locales/'\nconst $t = i18n.global.t`;

function getCommonRule() {
  return {
    caller: "",
    functionName: "$t",
    customizeKey: getCustomizeKey,
    importDeclaration: importCode,
  };
}

const config = {
  input: "src",
  output: "",
  secretId: "",
  secretKey: "",
  exclude: ["**/node_modules/**/*"],
  rules: {
    js: getCommonRule(),
    ts: getCommonRule(),
    cjs: getCommonRule(),
    mjs: getCommonRule(),
    jsx: {
      ...getCommonRule(),
      functionSnippets: "",
    },
    tsx: {
      ...getCommonRule(),
      functionSnippets: "",
    },
    vue: {
      caller: "",
      importDeclaration: importCode,
      functionNameInTemplate: "$t", // vue这里的配置，仅针对vue的template标签里面的内容生效
      functionNameInScript: "$t", // vue这里的配置，仅针对vue的script部分export default里面的内容生效
      customizeKey: getCustomizeKey,
      tagOrder: ["template", "scriptSetup", "script", "style"],
    },
  },
  prettier: {
    semi: false,
    singleQuote: true,
  },
  incremental: false,
  localePath: "./locales/module",
  localeFileType: "json",
  translateJsonPath: "./locales/auto-translate",
  excelPath: "./locales/excel/locals.xlsx",
  transferPath: "./locales/translate",
  locales: ["en", "zh-tw"],
  globalRule: {
    ignoreMethods: ["defineProps"],
  },
  sortData: ["key", "local", "zh"],
  // 参数currentFileKeyMap和currentFilePath，在生成配置文件时需要展示在文件里，所以这里去掉eslint校验
  adjustKeyMap(allKeyValue) {
    return allKeyValue;
  },
};

module.exports = config;
