const fs = require("fs");
const path = require("path");
const { parse, compileTemplate } = require("@vue/compiler-sfc");

function extractChineseFromVue(filePath) {
  console.log(`正在处理文件: ${filePath}`);
  const source = fs.readFileSync(filePath, "utf-8");

  const { descriptor } = parse(source);

  let chineseTexts = [];

  // 提取模板中的中文
  if (descriptor.template) {
    console.log("模板内容:", descriptor.template.content);
    try {
      const { ast } = compileTemplate({
        source: descriptor.template.content,
        filename: filePath,
        id: path.basename(filePath),
      });
      traverseAst(ast, chineseTexts);
    } catch (error) {
      console.error("编译模板时出错:", error);
    }
  }

  // 直接从模板内容中提取中文
  const templateChineseRegex = /[\u4e00-\u9fff]+/g;
  const templateMatches = descriptor.template.content.match(templateChineseRegex);
  if (templateMatches) {
    chineseTexts = chineseTexts.concat(templateMatches);
  }

  // 提取脚本中的中文
  if (descriptor.script || descriptor.scriptSetup) {
    const scriptContent = (descriptor.script || descriptor.scriptSetup).content;
    console.log("脚本内容:", scriptContent);
    const chineseRegex = /[\u4e00-\u9fff]+/g;
    const matches = scriptContent.match(chineseRegex);
    if (matches) {
      chineseTexts = chineseTexts.concat(matches);
    }
  }

  console.log(`从 ${filePath} 提取的中文文本:`, chineseTexts);
  return chineseTexts;
}

function traverseAst(node, results) {
  if (!node) return;
  
  console.log("正在遍历节点:", node.type);
  
  if (node.type === 1) { // 元素节点
    if (node.props) {
      node.props.forEach((prop) => {
        if (prop.type === 6 && prop.value && prop.value.content) {
          console.log("属性内容:", prop.value.content);
          const chineseRegex = /[\u4e00-\u9fff]+/g;
          const matches = prop.value.content.match(chineseRegex);
          if (matches) {
            results.push(...matches);
          }
        }
      });
    }
    if (node.children) {
      node.children.forEach((child) => traverseAst(child, results));
    }
  } else if (node.type === 2) { // 文本节点
    console.log("文本内容:", node.content);
    const chineseRegex = /[\u4e00-\u9fff]+/g;
    const matches = node.content.match(chineseRegex);
    if (matches) {
      results.push(...matches);
    }
  }
  
  // 遍历其他可能的子节点
  if (node.ifConditions) {
    node.ifConditions.forEach(condition => {
      if (condition.block) {
        traverseAst(condition.block, results);
      }
    });
  }
}

function walkDir(dir) {
  console.log(`正在遍历目录: ${dir}`);
  const files = fs.readdirSync(dir);
  let results = [];

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else if (path.extname(file) === ".vue") {
      const chinese = extractChineseFromVue(filePath);
      results = results.concat(chinese);
    }
  });

  return results;
}

function replaceChineseWithI18n(filePath, chineseTexts) {
  console.log(`正在替换文件中的中文: ${filePath}`);
  let content = fs.readFileSync(filePath, "utf-8");
  chineseTexts.forEach((text, index) => {
    const key = `key_${index}`;
    const regex = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g");
    content = content.replace(regex, `{{ $t('${key}') }}`);
  });
  fs.writeFileSync(filePath, content, "utf-8");
}

function generateI18nJson(chineseTexts) {
  console.log("正在生成 i18n JSON 文件");
  const zhJson = {};
  const enJson = {};

  chineseTexts.forEach((text, index) => {
    const key = `key_${index}`;
    zhJson[key] = text;
    enJson[key] = text;  // 英文暂时使用中文
  });

  const assetsDir = "./src/assets";
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(assetsDir, "zh.json"), JSON.stringify(zhJson, null, 2));
  fs.writeFileSync(path.join(assetsDir, "en.json"), JSON.stringify(enJson, null, 2));
}

// 主函数
function main() {
  try {
    const vueDir = "./src"; // Vue 项目的源代码目录
    if (!fs.existsSync(vueDir)) {
      throw new Error(`目录不存在: ${vueDir}`);
    }

    const chineseTexts = walkDir(vueDir);
    const uniqueChineseTexts = [...new Set(chineseTexts)];
    console.log("提取的中文文本:", uniqueChineseTexts);

    if (uniqueChineseTexts.length === 0) {
      console.log("警告: 没有找到中文文本");
      return;
    }

    // 替换中文为 $t('key') 形式
    const vueFiles = fs.readdirSync(vueDir).filter(file => path.extname(file) === ".vue");
    vueFiles.forEach(file => {
      const filePath = path.join(vueDir, file);
      replaceChineseWithI18n(filePath, uniqueChineseTexts);
    });

    // 生成中英文配置 JSON
    generateI18nJson(uniqueChineseTexts);

    console.log("处理完成！");
  } catch (error) {
    console.error("发生错误:", error);
  }
}

main();
