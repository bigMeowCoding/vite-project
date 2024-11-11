const { transformJs } = require("./transformJs");
const { transformVue } = require("./transformVue");
const { initParse } = require("../parser/initParse");

function transform(code, ext, rules, filePath) {
  switch (ext) {
    case "cjs":
    case "mjs":
    case "js":
    case "jsx":
      return transformJs(code, {
        rule: rules[ext],
        parse: initParse(),
      });
    case "vue":
      // 规则functionName废弃掉，使用functionNameInScript代替
      rules[ext].functionName = rules[ext].functionNameInScript ?? "";
      return transformVue(code, {
        rule: rules[ext],
        filePath,
      });
    default:
      throw new Error(`不支持对.${ext}后缀的文件进行提取`);
  }
}

module.exports = {
  transform,
};
