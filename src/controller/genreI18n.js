const fs = require("fs");
const path = require("path");
const { walkDir } = require("../utils/walkDir");
const { changeSourceTarget } = require("./changeSourceTarget");
const StateManager = require("../utils/store/stateManger");
const { saveAllLocaleData } = require("./saveAllLocaleData");
const { genreLocalExportJs } = require("../utils/generate/genreLocalExportJs");
const { getSourceFilePaths } = require("../utils/file/getSourceFilePaths");
function genreI18n(i18nConfig) {
  console.log("cwd", process.cwd());
  StateManager.setToolConfig(i18nConfig);
  const { input, exclude, includes, localePath, localeFileType, defaultKey } =
    i18nConfig;
  // const vueDir = path.join(process.cwd(), "./example/components");
  // const vueFiles = walkDir(vueDir).filter((file) => file.endsWith(".vue"));
  // const localePath = path.join(process.cwd(), "src", "assets", "zh.json");
  const sourceFilePaths = getSourceFilePaths(input, exclude, includes);

  sourceFilePaths.forEach((file) => {
    changeSourceTarget(file, i18nConfig);
  });
  const extName = path.extname(localePath);
  const savePath = extName
    ? localePath.replace(extName, `.${localeFileType}`)
    : localePath;
  console.log("savePath", savePath);

  saveAllLocaleData(savePath, localeFileType);
  genreLocalExportJs(savePath, localeFileType);
  // // 生成翻译文件
  // const zhJsonPath = path.join(vueDir, "assets", "zh.json");
  // const textToKeyMap = getTextToKeyMap();
  // const reversedMap = Object.fromEntries(
  //   Array.from(textToKeyMap.entries()).map(([key, value]) => [value, key]),
  // );
  // fs.writeFileSync(zhJsonPath, JSON.stringify(reversedMap, null, 2), "utf-8");
  // console.log(`生成的翻译文件：${zhJsonPath}`);
}

module.exports = {
  genreI18n,
};
