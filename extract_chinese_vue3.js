const fs = require("fs");
const path = require("path");
const { parse, compileTemplate } = require("@vue/compiler-sfc");
const { NodeTypes } = require("@vue/compiler-core");

function extractAndReplaceChineseInVue(filePath) {
  try {
    const source = fs.readFileSync(filePath, "utf-8");
    const { descriptor } = parse(source);
    const textToKeyMap = new Map();

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
                  prop.value.content = replaceChineseInText(
                    value,
                    textToKeyMap
                  );

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
            node.content = `{{ ${replaceChineseInText(text, textToKeyMap)} }}`;
          }
        }
      });

      // 使用修改后的 AST 重新生成模板内容
      descriptor.template.content = generateTemplateFromAst(ast);
    }

    if (descriptor.script) {
      let scriptContent = descriptor.script.content;
      const scriptChineseRegex = /(['"`])([^'"`]*[\u4e00-\u9fff][^'"`]*)['"`]/g;
      scriptContent = scriptContent.replace(
        scriptChineseRegex,
        (match, quote, text) => {
          const key = getOrCreateKey(text.trim(), textToKeyMap);
          return `t(${quote}${key}${quote})`;
        }
      );
      descriptor.script.content = scriptContent;
    }

    // 重新生成 Vue 文件内容
    const generated = generateVueFile(descriptor);
    fs.writeFileSync(filePath, generated, "utf-8");
    console.log(`文件 ${filePath} 已更新`);

    return textToKeyMap;
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
    throw error;
  }
}

function replaceChineseInText(text, textToKeyMap) {
  const regex = /([\u4e00-\u9fff]+|[a-zA-Z0-9]+\s+is|[a-zA-Z0-9.]+)/g;
  return text.replace(regex, (match) => {
    if (/[\u4e00-\u9fff]/.test(match) || match.endsWith(" is")) {
      const key = getOrCreateKey(match.trim(), textToKeyMap);
      return `t('${key}')`;
    }
    return match;
  });
}

function traverseAst(node, callback) {
  callback(node);
  if (node.children) {
    node.children.forEach((child) => traverseAst(child, callback));
  }
}

function getOrCreateKey(text, textToKeyMap) {
  if (!textToKeyMap.has(text)) {
    const key = `key_${textToKeyMap.size}`;
    textToKeyMap.set(text, key);
  }
  return textToKeyMap.get(text);
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

function generateVueFile(descriptor) {
  let content = "";
  if (descriptor.template) {
    content += `<template>\n${descriptor.template.content}\n</template>\n\n`;
  }
  if (descriptor.script) {
    const scriptTag = `<script${descriptor.script.lang ? ` lang="${descriptor.script.lang}"` : ""}${descriptor.script.setup ? " setup" : ""}>`;
    content += `${scriptTag}\n${descriptor.script.content}\n</script>\n\n`;
  }
  if (descriptor.styles.length > 0) {
    descriptor.styles.forEach((style) => {
      content += `<style${style.scoped ? " scoped" : ""}${style.lang ? ` lang="${style.lang}"` : ""}>\n${style.content}\n</style>\n\n`;
    });
  }
  return content.trim();
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

async function main() {
  const vueDir = "./src";
  const allTextToKeyMap = new Map();

  const vueFiles = walkDir(vueDir).filter((file) => file.endsWith(".vue"));
  vueFiles.forEach((file) => {
    const fileTextToKeyMap = extractAndReplaceChineseInVue(file);
    for (const [text, key] of fileTextToKeyMap) {
      if (!allTextToKeyMap.has(text)) {
        allTextToKeyMap.set(text, key);
      }
    }
  });

  // 确保 assets 目录存在
  const assetsDir = path.join(__dirname, "src", "assets");
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 生成正确格式的翻译对象
  const translations = {};
  allTextToKeyMap.forEach((value, key) => {
    translations[value] = key;
  });

  // 写入 zh.json 文件
  const zhJsonPath = path.join(assetsDir, "zh.json");

  try {
    await fs.promises.writeFile(
      zhJsonPath,
      JSON.stringify(translations, null, 2),
      "utf8"
    );
    console.log("成功更新 zh.json 文件");
  } catch (error) {
    console.error("写入 zh.json 文件时出错:", error);
  }
}

// 执行主函数
main().catch((error) => {
  console.error("程序执行出错:", error);
});

// 导出函数以供其他模块使用
module.exports = {
  extractAndReplaceChineseInVue,
  main,
};
