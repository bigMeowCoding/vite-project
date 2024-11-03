const fs = require("fs");
const path = require("path");
const { walkDir } = require("../utils/walkDir");
const Collector = require("../utils/collector");
const {
  extractAndReplaceChineseInVue,
} = require("../transformer/extractAndReplaceChineseInVue.js");

function genreI18n(options) {
  console.log("cwd", process.cwd());
  const vueDir = path.join(process.cwd(), "./example/components");
  const vueFiles = walkDir(vueDir).filter((file) => file.endsWith(".vue"));
  const localePath = path.join(process.cwd(), "src", "assets", "zh.json");

  vueFiles.forEach((file) => {
    extractAndReplaceChineseInVue(file);
    saveAllLocaleData(localePath);
  });

  function saveAllLocaleData(localePath) {
    const keyMap = Collector.getKeyMap();
    fs.writeFileSync(localePath, JSON.stringify(keyMap, null, 2), "utf-8");
  }

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
