// const parser = require("@babel/parser");
// const babel = require("@babel/core");
const babel = require("@babel/core");
const generator = require("@babel/generator").default;
const fs = require("fs");
// import path from "path";
// import t from "@babel/types";
const path = require("path");
const CONSOLE_AST = babel.template.ast('console.log("hello world")');
const sumCode = fs.readFileSync(path.join(process.cwd(), "ast/sum.js"), "utf8");
// const esprima = require("esprima");
const ast = babel.parse(sumCode, {
  sourceType: "module",
});
// const ast = parser.parse(sumCode, { tokens: true });
// const token = esprima.tokenize(sumCode);
// const ast = esprima.parse(sumCode);
// console.log(token);
// console.log(JSON.stringify(ast, null, 2));

function insertConsole(programBody) {
  programBody.forEach((item) => {
    if (item.type === "FunctionDeclaration") {
      const funcBody = item.body.body;
      const index = funcBody.findIndex((bodyItem) => {
        return bodyItem.type === "ReturnStatement";
      });
      if (index !== -1) {
        funcBody.splice(index, 0, CONSOLE_AST);
      }
    }
  });
}
insertConsole(ast.program.body);
console.log(ast.program.body);
// console.log(generator.default(ast.program.body));
fs.writeFileSync(
  "./sum-new.js",
  generator(ast, {
    jsescOption: { minimal: true },
  }).code,
  "utf-8",
);
// console.log(ast.program.body);
