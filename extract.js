import { readFileSync } from "fs";
import { parse } from "@vue/compiler-sfc";
import { pinyin } from "pinyin-pro";
import path from "node:path";
import { writeFileSync } from "node:fs";

// 读取 Vue 文件内容
const filePath = path.join(process.cwd(), "./App.vue");
const fileContent = readFileSync(filePath, "utf-8");

// 解析 Vue 文件
const { descriptor } = parse(fileContent);

const extractAndConvertChinese = (content) => {
  const chineseTextPattern = /[\u4e00-\u9fa5]+/g;
  let match;
  const convertedContent = content.replace(chineseTextPattern, (match) => {
    // 调用 pinyin 函数将中文字符转换为拼音
    return pinyin(match, { style: pinyin.STYLE_NORMAL });
    // 将结果拼接成一个字符串
  });
  return convertedContent;
};

// 处理 script、template 和 style 部分
if (descriptor.scriptSetup) {
  descriptor.scriptSetup.content = extractAndConvertChinese(
    descriptor.scriptSetup.content,
  );
}

if (descriptor.template) {
  descriptor.template.content = extractAndConvertChinese(
    descriptor.template.content,
  );
}

if (descriptor.styles) {
  descriptor.styles.forEach((style) => {
    style.content = extractAndConvertChinese(style.content);
  });
}

// 输出转换后的内容
console.log("Script Content:", descriptor.script?.content);
console.log("Template Content:", descriptor.template?.content);
descriptor.styles.forEach((style, index) => {
  console.log(`Style Content ${index + 1}:`, style.content);
});

// 生成新的 Vue 文件内容
const newVueFileContent = `
<template>
${descriptor.template ? descriptor.template.content : ""}
</template>

<script setup>
${descriptor.scriptSetup ? descriptor.scriptSetup.content : ""}
</script>

${descriptor.styles
  .map(
    (
      style,
      index,
    ) => `<style${style.lang ? ` lang="${style.lang}"` : ""}${style.scoped ? " scoped" : ""}>
${style.content}
</style>`,
  )
  .join("\n")}
`;

// 将新内容写回文件
writeFileSync(filePath, newVueFileContent, "utf-8");

console.log(`Updated Vue file saved to ${filePath}`);
