const fs = require("fs");
const { compileTemplate, parse } = require("@vue/compiler-sfc");
const { NodeTypes } = require("@vue/compiler-core");
const { replaceChineseInText } = require("../utils/replaceChineseInText");
const { traverseAst } = require("./transformAst");
const { generateVueFile } = require("./generateVueFile");
const { replaceChineseInScript } = require("./replaceChineseInScript");
const { generateTemplateFromAst } = require("./generateTemplateFromAst");

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
        descriptor.script.content,
      );
    }
    if (descriptor.scriptSetup) {
      descriptor.scriptSetup.content = replaceChineseInScript(
        descriptor.scriptSetup.content,
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

module.exports = { extractAndReplaceChineseInVue };
