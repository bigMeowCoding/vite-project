
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse");
const DOUBLE_BYTE_REGEX = /[\u4E00-\u9FFF]/g;
const babelTypes = require("@babel/types");

/**
 * 查找 JS 文件中的中文
 * @Param code
 */
function findTextInJs(code) {
  const matches = [];
  const ast = babelParser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "decorators-legacy"],
  });

  babelTraverse.default(ast, {
    StringLiteral({ node }) {
      const { start, end, value } = node;
      if (value && value.match(DOUBLE_BYTE_REGEX)) {
        const range = { start, end };
        matches.push({
          range,
          text: value,
          isString: true,
        });
      }
    },
    TemplateLiteral({ node }) {
      const { start, end } = node;
      const templateContent = code.slice(start, end);
      if (templateContent.match(DOUBLE_BYTE_REGEX)) {
        const range = { start, end };
        matches.push({
          range,
          text: code.slice(start + 1, end - 1),
          isString: true,
        });
      }
    },
    JSXElement({ node }) {
      const { children } = node;
      children.forEach((child) => {
        if (babelTypes.isJSXText(child)) {
          const { value, start, end } = child;
          const range = { start, end };
          if (value.match(DOUBLE_BYTE_REGEX)) {
            matches.push({
              range,
              text: value.trim(),
              isString: false,
            });
          }
        }
      });
    },
  });
  return matches;
}
export default findTextInJs ;
