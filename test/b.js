/**
 * 去除代码里的console
 */
const babel = require("@babel/core");
const { default: traverse } = require("@babel/traverse");
const { default: nodeToCode } = require("@babel/generator");

const code = "console.log(1);function f(a,b){console.error(2);return a+b;}";

const ast = babel.parseSync(code, {
  ast: true,
  configFile: false,
});

traverse(ast, {
  CallExpression(path) {
    const node = path.node;
    const callee = node.callee;
    if (callee.type === "MemberExpression" && callee.object.name === "console") {
      path.remove();
    }
  },
});
console.log(nodeToCode(ast).code);
