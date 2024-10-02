const fs = require("fs");
const path = require("path");
const { parse, compileTemplate } = require("@vue/compiler-sfc");
const { NodeTypes } = require("@vue/compiler-core");

// 全局变量
const textToKeyMap = new Map();

// 用于替换中文文本的函数
function replaceChineseInText(text) {
  const regex = /([\u4e00-\u9fff]+)/g;
  const parts = [];
  let lastIndex = 0;

  text.replace(regex, (match, chinese, offset) => {
    // 添加匹配之前的文本
    if (offset > lastIndex) {
      parts.push(`'${text.slice(lastIndex, offset)}'`);
    }

    // 处理中文
    const key = getOrCreateKey(chinese.trim());
    parts.push(`t('${key}')`);

    lastIndex = offset + match.length;
  });

  // 添加最后剩余的文本
  if (lastIndex < text.length) {
    parts.push(`'${text.slice(lastIndex)}'`);
  }

  // 如果只有一个部分且是中文，直接返回 t 函数调用
  if (parts.length === 1 && parts[0].startsWith("t(")) {
    return parts[0];
  }

  // 否则，使用 + 拼接所有部分
  return parts.join(" + ");
}

// 用于获取或创建键的函数
function getOrCreateKey(text) {
  if (!textToKeyMap.has(text)) {
    const key = `key_${textToKeyMap.size}`;
    textToKeyMap.set(text, key);
  }
  return textToKeyMap.get(text);
}

function extractAndReplaceChineseInVue(filePath) {
  try {
    const source = fs.readFileSync(filePath, "utf-8");
    const { descriptor } = parse(source);

    if (descriptor.template) {
      const { ast } = compileTemplate({
        source: descriptor.template.content,
        filename: filePath,
        id: "template",
      });

      traverseAst(ast, (node) => {
        if (node.type === NodeTypes.ELEMENT) {
          if (Array.isArray(node.props)) {
            node.props.forEach((prop) => {
              if (prop.type === NodeTypes.ATTRIBUTE && prop.value) {
                const value = prop.value.content;
                if (
                  typeof value === "string" &&
                  /[\u4e00-\u9fff]/.test(value)
                ) {
                  prop.value.content = replaceChineseInText(value);

                  // 如果属性不是 v-bind 或以 : 开头，添加绑定
                  if (prop.name !== "v-bind" && prop.name[0] !== ":") {
                    prop.name = ":" + prop.name;
                  }
                }
              }
            });
          }
        } else if (node.type === NodeTypes.TEXT) {
          const text = node.content;
          if (typeof text === "string" && /[\u4e00-\u9fff]/.test(text)) {
            const replaced = replaceChineseInText(text);
            node.content = `{{ ${replaced} }}`;
          }
        }
      });

      descriptor.template.content = generateTemplateFromAst(ast);
    }

    // 处理 script 和 scriptSetup 部分
    if (descriptor.script) {
      descriptor.script.content = replaceChineseInScript(
        descriptor.script.content
      );
    }
    if (descriptor.scriptSetup) {
      descriptor.scriptSetup.content = replaceChineseInScript(
        descriptor.scriptSetup.content
      );
    }

    // 重新生成 Vue 文件内容
    const generated = generateVueFile(descriptor);
    fs.writeFileSync(filePath, generated, "utf-8");
    console.log(`文件 ${filePath} 已更新`);
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
    throw error;
  }
}

function traverseAst(node, callback) {
  callback(node);
  if (node.children) {
    node.children.forEach((child) => traverseAst(child, callback));
  }
}

function generateTemplateFromAst(node) {
  if (node.type === NodeTypes.ROOT) {
    return node.children.map(generateTemplateFromAst).join("");
  } else if (node.type === NodeTypes.ELEMENT) {
    const attrs = node.props
      .map((prop) => {
        if (prop.type === NodeTypes.ATTRIBUTE) {
          return `${prop.name}="${prop.value.content}"`;
        }
        return "";
      })
      .filter(Boolean)
      .join(" ");

    const children = node.children.map(generateTemplateFromAst).join("");
    return `<${node.tag}${attrs ? " " + attrs : ""}>${children}</${node.tag}>`;
  } else if (node.type === NodeTypes.TEXT) {
    return node.content;
  } else if (node.type === NodeTypes.INTERPOLATION) {
    return `{{ ${node.content.content} }}`;
  }
  return "";
}

function replaceChineseInScript(scriptContent) {
  const scriptChineseRegex = /(['"`])([^'"`]*[\u4e00-\u9fff][^'"`]*)['"`]/g;
  return scriptContent.replace(scriptChineseRegex, (match, quote, text) => {
    return `t(${quote}${getOrCreateKey(text.trim())}${quote})`;
  });
}

function generateVueFile(descriptor) {
  let content = "";

  // 处理 template 部分
  if (descriptor.template) {
    const templateAttrs = Object.entries(descriptor.template.attrs || {})
      .map(([key, value]) => `${key}${value === true ? "" : `="${value}"`}`)
      .join(" ");
    content += `<template${templateAttrs ? " " + templateAttrs : ""}>\n${descriptor.template.content}\n</template>\n\n`;
  }

  // 处理 script 部分
  if (descriptor.script) {
    const scriptAttrs = Object.entries(descriptor.script.attrs || {})
      .map(([key, value]) => {
        if (key === "setup" && value === true) {
          return "setup";
        }
        return `${key}${value === true ? "" : `="${value}"`}`;
      })
      .join(" ");
    content += `<script${scriptAttrs ? " " + scriptAttrs : ""}>\n${descriptor.script.content}\n</script>\n\n`;
  }

  // 处理 script setup 部分（如果存在）
  if (descriptor.scriptSetup) {
    const scriptSetupAttrs = Object.entries(descriptor.scriptSetup.attrs || {})
      .map(([key, value]) => `${key}${value === true ? "" : `="${value}"`}`)
      .join(" ");
    content += `<script setup${scriptSetupAttrs ? " " + scriptSetupAttrs : ""}>\n${descriptor.scriptSetup.content}\n</script>\n\n`;
  }

  // 处理 style 部分
  if (descriptor.styles.length > 0) {
    descriptor.styles.forEach((style) => {
      const styleAttrs = Object.entries(style.attrs || {})
        .map(([key, value]) => `${key}${value === true ? "" : `="${value}"`}`)
        .join(" ");
      content += `<style${styleAttrs ? " " + styleAttrs : ""}>\n${style.content}\n</style>\n\n`;
    });
  }

  return content.trim();
}

// 主函数
function main() {
  const vueDir = "./src";
  const vueFiles = walkDir(vueDir).filter((file) => file.endsWith(".vue"));
  vueFiles.forEach((file) => {
    extractAndReplaceChineseInVue(file);
  });

  // 生成翻译文件
  const translations = Object.fromEntries(textToKeyMap);
  const zhJsonPath = path.join(vueDir, "assets", "zh.json");
  fs.writeFileSync(zhJsonPath, JSON.stringify(translations, null, 2), "utf-8");
  console.log(`生成的翻译文件：${zhJsonPath}`);
}

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

main();

// 导出函数以供其他模块使用
module.exports = {
  extractAndReplaceChineseInVue,
  main,
};
