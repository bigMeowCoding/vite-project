const { parse } = require("@vue/compiler-sfc");
const StateManager = require("../utils/store/stateManger");
const { transformJs } = require("./transformJs");
const { initParse } = require("../parser/initParse");
const prettier = require("prettier");
const mustache = require("mustache");
const Collector = require("../utils/collector");
const ejs = require("ejs");
const htmlparser2 = require("htmlparser2");

const { escapeSpecialChar } = require("../utils/escapeSpecialChar");
const { includeChinese } = require("../utils/includeChinese");
const { getReplaceValue } = require("../utils/getReplaceValue");
const COMMENT_TYPE = "!";

function parseJsSyntax(source) {
  // html属性有可能是{xx:xx}这种对象形式，直接解析会报错，需要特殊处理。
  // 先处理成temp = {xx:xx} 让babel解析，解析完再还原成{xx:xx}
  let isObjectStruct = false;
  if (source.startsWith("{") && source.endsWith("}")) {
    isObjectStruct = true;
    source = `temp=${source}`;
  }
  // console.log(source, "source");

  const { code } = transformJs(source, {
    parse: initParse(),
  });
  let stylizedCode = prettier.format(code, {
    singleQuote: true,
    semi: false,
    parser: "babel",
    sync: true,
  });
  //
  // pretter格式化后有时会多出分号
  if (stylizedCode.startsWith(";")) {
    stylizedCode = stylizedCode.slice(1);
  }

  if (isObjectStruct) {
    stylizedCode = stylizedCode.replace("temp = ", "");
  }
  return stylizedCode.endsWith("\n")
    ? stylizedCode.slice(0, stylizedCode.length - 1)
    : stylizedCode;
}
function parseTextNode(text, rule, getReplaceValue, customizeKey) {
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
        const source = parseJsSyntax(value);

        str += `{{${source}}`;
      } else if (type === COMMENT_TYPE) {
        const source = parseJsSyntax(`!${value}`);
        str += `{{${source}}}`;
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

function templateHandle(code, rule) {
  let htmlString = "";
  let attrsCache = {};
  const { functionNameInTemplate, customizeKey } = rule;

  let textNodeCache = ""; // 缓存当前文本节点内容
  const parser = new htmlparser2.Parser(
    {
      onopentag(name) {
        console.log("opentag", name);
        let text = parseTextNode(
          textNodeCache,
          rule,
          getReplaceValue,
          customizeKey
        );
        // console.log("parseText", text);

        htmlString += text;
        textNodeCache = "";
        htmlString += `<${name} >`;
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
        // console.log("parseText", text);
        let text = parseTextNode(
          textNodeCache,
          rule,
          getReplaceValue,
          customizeKey
        );
        htmlString += text;
        textNodeCache = "";

        // 如果是自闭合标签
        if (isImplied) {
          htmlString = htmlString.slice(0, htmlString.length - 2) + "/>";
          return;
        }
        htmlString += `</${name}>`;
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
    }
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
function mergeCode(tagOrder, tagMap) {
  const sourceCode = tagOrder.reduce((code, tagName) => {
    return code + tagMap[tagName];
  }, "");
  return sourceCode;
}

function generationSource(sfc, handle, rule) {
  const wrapperTemplate = getWrapperTemplate(sfc);
  let source;
  try {
    source = handle(sfc.content, rule);
  } catch (error) {
    source = sfc.content;
  }
  return ejs.render(wrapperTemplate, {
    code: source,
  });
}

function transformVue(code, options) {
  const { rule, filePath } = options;
  const { descriptor, errors } = parse(code);
  if (errors.length > 0) {
    const line = errors[0].loc.start.line;
    console.error(
      `源文件${filePath}第${line}行附近解析出现错误：`,
      errors[0].toString()
    );

    return {
      code,
    };
  }
  const { template, script, scriptSetup } = descriptor;
  let templateCode = "";
  let scriptCode = "";
  let scriptSetupCode = "";
  let stylesCode = "";

  if (template) {
    templateCode = generationSource(template, templateHandle, rule);
  }

  if (script) {
    // scriptCode = generationSource(script, handleScript, rule);
  }

  if (scriptSetup) {
    // scriptSetupCode = generationSource(scriptSetup, handleScript, rule);
  }

  //   if (styles) {
  //     for (const style of styles) {
  //       const wrapperTemplate = getWrapperTemplate(style);
  //       const source = style.content;
  //       stylesCode +=
  //         ejs.render(wrapperTemplate, {
  //           code: source,
  //         }) + "\n";
  //     }
  //   }
  console.log("templateCode", templateCode);
  const tagMap = {
    template: templateCode,
    script: scriptCode,
    scriptSetup: scriptSetupCode,
    style: stylesCode,
  };
  const tagOrder = StateManager.getToolConfig().rules.vue.tagOrder;
  code = mergeCode(tagOrder, tagMap);
  return {
    code,
  };
}

module.exports = {
  transformVue,
};
