const { default: babelGenerator } = require("@babel/generator");
const { default: traverse } = require("@babel/traverse");

function transformJs(source, option) {
  function transformAST(source, option) {
    function getTraverseOption() {
      return {
        StringLiteral(path) {},
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
    retainLines: true,   // 保持原始行号
    semicolons: false
  });
  return result;
}

module.exports = {
  transformJs,
};
