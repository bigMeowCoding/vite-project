const fs = require("fs");
const path = require("path");
const { parse, compileTemplate } = require("@vue/compiler-sfc");
const { NodeTypes } = require("@vue/compiler-core");

// 全局变量
const textToKeyMap = new Map();

// 在文件顶部定义 translations 对象
const translations = {};

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

// 用于获取或建键的函数
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

      traverseAst(ast, processNode);

      function processNode(node) {
        if (node.type === NodeTypes.ELEMENT) {
          processElementNode(node);
        } else if (node.type === NodeTypes.TEXT) {
          processTextNode(node);
        } else if (node.type === NodeTypes.TEXT_CALL) {
          processTextCallNode(node);
        } else if (node.type === NodeTypes.COMPOUND_EXPRESSION) {
          processCompoundExpressionNode(node);
        }
      }

      function processCompoundExpressionNode(node) {
        if (Array.isArray(node.children)) {
          processNode(node.children);
        }
      }

      function processElementNode(node) {
        if (Array.isArray(node.props)) {
          node.props.forEach(processNodeProp);
        }
      }

      function processNodeProp(prop) {
        if (prop.type === NodeTypes.ATTRIBUTE && prop.value) {
          const value = prop.value.content;
          if (typeof value === "string" && /[\u4e00-\u9fff]/.test(value)) {
            prop.value.content = replaceChineseInText(value);

            if (prop.name !== "v-bind" && prop.name[0] !== ":") {
              prop.name = ":" + prop.name;
            }
          }
        }
      }

      function processTextNode(node) {
        const text = node.content.trim();
        if (text && /[\u4e00-\u9fff]/.test(text)) {
          node.content = `{{ ${replaceChineseInText(text)} }}`;
        }
      }

      function processTextCallNode(node) {
        if (Array.isArray(node.content)) {
          traverseAst(node.content, processNode);
        } else {
          processNode(node.content);
        }
      }

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
  switch (node.type) {
    case NodeTypes.ROOT:
      return generateRootNode(node);
    case NodeTypes.ELEMENT:
      return generateElementNode(node);
    case NodeTypes.TEXT:
      return generateTextNode(node);
    case NodeTypes.INTERPOLATION:
      return generateInterpolationNode(node);
    case NodeTypes.TEXT_CALL:
      return generateTextCallNode(node);
    case NodeTypes.COMPOUND_EXPRESSION:
      return generateCompoundExpressionNode(node);
    default:
      return "";
  }
}

function generateRootNode(node) {
  return node.children.map(generateTemplateFromAst).join("");
}

function generateElementNode(node) {
  const attrs = generateAttributes(node.props);
  const directives = generateDirectives(node.props);
  const children = node.children.map(generateTemplateFromAst).join("");
  return `<${node.tag}${attrs ? " " + attrs : ""}${directives ? " " + directives : ""}>${children}</${node.tag}>`;
}

function generateAttributes(props) {
  return props
    .filter((prop) => prop.type === NodeTypes.ATTRIBUTE)
    .map((prop) => {
      if (prop.value === undefined) {
        return prop.name;
      }
      return `${prop.name}="${prop.value ? prop.value.content : ""}"`;
    })
    .join(" ");
}

function generateDirectives(props) {
  return props
    .filter((prop) => prop.type === NodeTypes.DIRECTIVE)
    .map((prop) => {
      const { name, exp, arg } = prop;
      if (name === "on") {
        // 保留原始的事件处理器表达式
        return `@${arg.content}="${exp ? exp.loc.source : ""}"`;
      }
      if (name === "bind") {
        // 保留原始的绑定表达式
        return `:${arg.content}="${exp ? exp.loc.source : ""}"`;
      }
      // 对于其他指令，保留原始表达式
      return `v-${name}${arg ? `:${arg.content}` : ""}="${exp ? exp.content : ""}"`;
    })
    .join(" ");
}

function generateTextNode(node) {
  return typeof node.content === "string" ? node.content : node.loc.source;
}

function generateInterpolationNode(node) {
  return `{{ ${node.content.loc.source} }}`;
}

function generateTextCallNode(node) {
  if (Array.isArray(node.content.children)) {
    return node.content.children.map(generateTemplateFromAst).join("");
  }
  if (typeof node.content === "string") {
    return node.content;
  } else {
    return generateTemplateFromAst(node.content);
  }
}

function generateCompoundExpressionNode(node) {
  if (Array.isArray(node.children)) {
    return node.children.map(generateTemplateFromAst).join("");
  }
  return node.content;
}

function replaceChineseInScript(scriptContent) {
  const { parse } = require("@babel/parser");
  const traverse = require("@babel/traverse").default;
  const t = require("@babel/types");
  const generate = require("@babel/generator").default;
  const ast = parse(scriptContent, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  traverse(ast, {
    StringLiteral(path) {
      const value = path.node.value;
      if (/[\u4e00-\u9fff]/.test(value)) {
        const key = getOrCreateKey(value);
        path.replaceWith(
          t.callExpression(t.identifier("t"), [t.stringLiteral(key)])
        );
      }
    },
    TemplateLiteral(path) {
      const { quasis, expressions } = path.node;
      const newQuasis = [];
      const newExpressions = [];

      quasis.forEach((quasi, index) => {
        const value = quasi.value.raw;
        if (/[\u4e00-\u9fff]/.test(value)) {
          // 直接使用正则表达式匹配中文字符，无需先分割
          const regex = /([\u4e00-\u9fff]+)|(\s+)|([^\s\u4e00-\u9fff]+)/g;
          let match;
          let lastIndex = 0;
          while ((match = regex.exec(value)) !== null) {
            const [fullMatch, chinese] = match;

            if (chinese) {
              if (lastIndex < match.index) {
                newQuasis.push(
                  t.templateElement(
                    {
                      raw: value.slice(lastIndex, match.index),
                      cooked: value.slice(lastIndex, match.index),
                    },
                    false
                  )
                );
              }
              const key = getOrCreateKey(chinese);
              newExpressions.push(
                t.callExpression(t.identifier("t"), [t.stringLiteral(key)])
              );
            } else {
              // 对于空白和其他字符，直接添加到 quasis
              newQuasis.push(
                t.templateElement({ raw: fullMatch, cooked: fullMatch }, false)
              );
            }

            lastIndex = match.index + fullMatch.length;
            
            // 防止死循环
            if (regex.lastIndex === lastIndex) {
              regex.lastIndex++;
            }
          }

          if (lastIndex < value.length) {
            newQuasis.push(
              t.templateElement(
                { raw: value.slice(lastIndex), cooked: value.slice(lastIndex) },
                index === quasis.length - 1
              )
            );
          }
        } else {
          newQuasis.push(quasi);
        }

        if (index < expressions.length) {
          newExpressions.push(expressions[index]);
        }
      });

      // 确保 quasis 的数量比 expressions 多一个
      if (newQuasis.length === newExpressions.length) {
        newQuasis.push(t.templateElement({ raw: "", cooked: "" }, true));
      }

      // path.replaceWith(t.templateLiteral(newQuasis, newExpressions));
    },
  });

  return generate(ast).code;
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
      .map(([key, value]) => {
        if (key === "setup" && value === true) {
          return "";
        }
        return `${key}${value === true ? "" : `="${value}"`}`;
      })
      .filter(Boolean)
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
  replaceChineseInScript,
  translations,
};
