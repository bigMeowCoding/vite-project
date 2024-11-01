const fs = require("fs");
const { parse } = require("@vue/compiler-sfc");
const { generateVueFile } = require("./generateVueFile");
const { replaceChineseInScript } = require("./replaceChineseInScript");
const ejs = require("ejs");
const htmlparser2 = require("htmlparser2");
const { escapeSpecialChar } = require("../utils/escapeSpecialChar");
const mustache = require("mustache");
const { includeChinese } = require("../utils/includeChinese");
const { getReplaceValue } = require("../utils/getReplaceValue");
const COMMENT_TYPE = "!";
const Collector = require("../utils/collector");
const customizeKey = (key) => {
  key = key.replace(/\./g, "_").replace(/ /g, "").replace(/\[|\]/g, "_");

  return `${key}`;
};
function extractAndReplaceChineseInVue(filePath) {
  try {
    const source = fs.readFileSync(filePath, "utf-8");
    const { descriptor } = parse(source);
    let templateCode = "";

    if (descriptor.template) {
      templateCode = generationSource(descriptor.template, templateHandle);
    }

    console.log("templateCode", templateCode);

    // // 处理 script 和 scriptSetup 部分
    // if (descriptor.script) {
    //   descriptor.script.content = replaceChineseInScript(
    //     descriptor.script.content,
    //   );
    // }
    // if (descriptor.scriptSetup) {
    //   descriptor.scriptSetup.content = replaceChineseInScript(
    //     descriptor.scriptSetup.content,
    //   );
    // }
    //
    // // 重新生成 Vue 文件内容
    // const generated = generateVueFile(descriptor);
    // fs.writeFileSync(filePath, generated, "utf-8");
    // console.log(`文件 ${filePath} 已更新`);
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
    throw error;
  }
}

function parseTextNode(text) {
  let str = "";
  let tokens = [];

  try {
    tokens = mustache.parse(text);
    console.log("parse", text, tokens);
  } catch (error) {
    return text;
  }

  for (let token of tokens) {
    const type = token[0];
    const value = token[1];
    if (includeChinese(value)) {
      if (type === "text") {
        const translationKey = Collector.add(value, customizeKey);
        str += `{{${getReplaceValue(translationKey)}}}`;
      } else if (type === "name") {
        str += `{{${value}}`;
      } else if (type === COMMENT_TYPE) {
        str += `{{!${value}}}`;
      }
    } else {
      if (type === "text") {
        str += value;
      } else if (type === "name") {
        str += `{{${value}}`;
      } else if (type === COMMENT_TYPE) {
        str += `{{!${value}}}`;
      }
    }
  }
  return str;
}

function templateHandle(code) {
  let htmlString = "";
  let attrsCache = {};
  let textNodeCache = ""; // 缓存当前文本节点内容
  const parser = new htmlparser2.Parser(
    {
      onopentag(name) {
        console.log("opentag", name);
        let text = parseTextNode(textNodeCache);
        console.log("parseText", text);

        htmlString += text;
        textNodeCache = "";
      },
      onattribute(name, value, quote) {
        console.log("onatrribute", name, value);
        if (value) {
          attrsCache[name] = value;
        } else {
          if (quote === undefined) {
            attrsCache[name] = undefined;
          } else {
            attrsCache[name] = value;
          }
        }
      },
      ontext(text) {
        console.log("text", text);
        text = escapeSpecialChar(text);
        textNodeCache += text;
      },
      onclosetag(name, isImplied) {
        console.log("closetag=====", name, isImplied);
        if (isImplied) {
          return;
        }
      },
      oncomment(text, isImplied) {
        console.log("comment", text, isImplied);
      },
    },
    {
      lowerCaseTags: false,
      recognizeSelfClosing: true,
      lowerCaseAttributeNames: false,
      decodeEntities: false,
    },
  );
  parser.write(code);
  parser.end();
  return htmlString;
}

function getWrapperTemplate(sfc) {
  const { type, lang, attrs } = sfc;
  let template = `<${type}`;
  if (lang) {
    template += ` lang="${lang}"`;
  }
  if (sfc.setup) {
    template += ` setup`;
  }
  if (sfc.scoped) {
    template += ` scoped`;
  }
  for (const attr in attrs) {
    if (!["lang", "scoped", "setup"].includes(attr)) {
      if (attrs[attr] === true) {
        template += attr;
      } else {
        template += ` ${attr}="${attrs[attr]}"`;
      }
    }
  }
  template += `><%- code %></${type}>`;
  return template;
}

function generationSource(sfc, handle) {
  const wrapperTemplate = getWrapperTemplate(sfc);
  let source;
  try {
    source = handle(sfc.content);
  } catch (error) {
    source = sfc.content;
  }
  return ejs.render(wrapperTemplate, {
    code: source,
  });
}

module.exports = { extractAndReplaceChineseInVue };
