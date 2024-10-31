const fs = require("fs");
const path = require("path");
const { getTextToKeyMap } = require("./utils/textToKeyMap");
const { walkDir } = require("./utils/walkDir");
const {
  extractAndReplaceChineseInVue,
} = require("./transformer/extractAndReplaceChineseInVue");

console.log("cwd", process.cwd());
const vueDir = path.join(process.cwd(), "./src");
const vueFiles = walkDir(vueDir).filter((file) => file.endsWith(".vue"));
vueFiles.forEach((file) => {
  extractAndReplaceChineseInVue(file);
});

// 生成翻译文件
const zhJsonPath = path.join(vueDir, "assets", "zh.json");
const textToKeyMap = getTextToKeyMap();
const reversedMap = Object.fromEntries(
  Array.from(textToKeyMap.entries()).map(([key, value]) => [value, key]),
);
fs.writeFileSync(zhJsonPath, JSON.stringify(reversedMap, null, 2), "utf-8");
console.log(`生成的翻译文件：${zhJsonPath}`);
