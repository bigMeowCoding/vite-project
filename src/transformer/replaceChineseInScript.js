const { getOrCreateKey } = require("../utils/getOrCreateKey");

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
      let newQuasis = [];
      let newExpressions = [];

      quasis.forEach((quasi, index) => {
        const value = quasi.value.raw;
        const parts = value.split(/([\u4e00-\u9fff]+)/);
        let newQuasiValue = "";

        parts.forEach((part) => {
          if (/[\u4e00-\u9fff]/.test(part)) {
            const key = getOrCreateKey(part);
            newExpressions.push(
              t.callExpression(t.identifier("t"), [t.stringLiteral(key)])
            );
            newQuasis.push(t.templateElement({ raw: "", cooked: "" }));
            newQuasiValue = "";
          } else {
            newQuasiValue += part;
          }
        });

        newQuasis.push(
          t.templateElement(
            { raw: newQuasiValue, cooked: newQuasiValue },
            index === quasis.length - 1
          )
        );

        if (index < expressions.length) {
          newExpressions.push(expressions[index]);
        }
      });

      const newNode = t.templateLiteral(newQuasis, newExpressions);
      newNode.processed = true; // 标记这个节点已经被处理
      path.replaceWith(newNode);
      path.skip(); // 跳过对新节点的遍历
    },
  });

  return generate(ast).code;
}

module.exports = { replaceChineseInScript };
