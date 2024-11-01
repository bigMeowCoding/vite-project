const { default: babelGenerator } = require("@babel/generator");
const { default: traverse } = require("@babel/traverse");
const { includeChinese } = require("../utils/includeChinese");
const Collector = require("../utils/collector");
const { customizeKey } = require("../config/enums");
const { types: t } = require("@babel/core");
const template = require("@babel/template");

function transformJs(source, option) {
  let hasTransformed = false; // 文件里是否存在中文转换，有的话才有必要导入i18n

  function transformAST(source, option) {
    function getStringLiteral(value) {
      return Object.assign(t.stringLiteral(value), {
        extra: {
          raw: `'${value}'`,
          rawValue: value,
        },
      });
    }
    function getCallExpression(identifier, quote = "'") {
      const expression = `$t(${quote}${identifier}${quote})`;
      return expression;
    }
    function getReplaceValue(translationKey) {
      // 表达式结构 obj.fn('xx',{xx:xx})
      let expression;

      expression = getCallExpression(translationKey);
      return template.expression(expression)();
    }
    function getTraverseOption() {
      return {
        StringLiteral(path) {
          const value = path.node.extra
            ? path.node.extra.raw.slice(1, -1)
            : path.node.value;
          if (includeChinese(value)) {
            hasTransformed = true;
            const translationKey = Collector.add(value, customizeKey);
            path.replaceWith(getReplaceValue(translationKey));
          }
          path.skip();
        },
        TemplateLiteral(path) {},
      };
    }
    const ast = option.parse(source);
    traverse(ast, getTraverseOption());
    return ast;
  }
  const ast = transformAST(source, option);
  const result = babelGenerator(ast, {
    compact: false,
    retainLines: true, // 保持原始行号
    semicolons: false,
  });
  return result;
}

module.exports = {
  transformJs,
};
