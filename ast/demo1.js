const babel = require("@babel/core");
const fs = require("fs");
const path = require("path");
const sumCode = fs.readFileSync(path.join(process.cwd(), "ast/sum.js"), "utf8");

const ast = babel.parse(sumCode, { sourceType: "module" });
console.log(ast.program.body);
