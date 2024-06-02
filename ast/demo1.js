const parser = require("@babel/parser");
const babel = require("@babel/core");
const fs = require("fs");
const path = require("path");
const sumCode = fs.readFileSync(path.join(process.cwd(), "ast/sum.js"), "utf8");
const esprima = require("esprima");

// const ast = parser.parse(sumCode, { tokens: true });
const token = esprima.tokenize(sumCode);
const ast = esprima.parse(sumCode);
// console.log(token);
// console.log(JSON.stringify(ast, null, 2));
// console.log(ast.program.body);
