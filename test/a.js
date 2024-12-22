const babel = require("@babel/core");
const { default: traverse } = require("@babel/traverse");

const code = "let x=5,y=6;a=1;function f(a,b){let c=a+b;d=4;return c;}";
const stack = [];
function enterScope() {
  stack.push({});
}
function exitScope() {
  stack.pop();
}
function declareVariable(name) {
  const scope = stack[stack.length - 1];
  scope[name] = true;
}
function hasVariable(name) {
  for (let i = stack.length - 1; i >= 0; i--) {
    const scope = stack[i];
    if (scope[name]) {
      return true;
    }
  }
  return false;
}

const ast = babel.parseSync(code, {
  ast: true,
  configFile: false,
});

traverse(ast, {
  enter(path) {
    const node = path.node;
    switch (node.type) {
      case "Program":
        enterScope();
        break;
      case "VariableDeclaration": {
        enterScope();
        const { declarations } = node;
        declarations.forEach((declaration) => {
          if (declaration.id.type === "Identifier") {
            declareVariable(declaration.id.name);
          }
        });
        break;
      }
      case "FunctionDeclaration":
      case "FunctionExpression": {
        enterScope();
        const { params, id } = node;
        if (id?.name) {
          declareVariable(id.name);
        }
        params.forEach((param) => {
          if (param.type === "Identifier") {
            declareVariable(param.name);
          }
        });
        break;
      }
      case "Identifier": {
        if (!hasVariable(node.name)) {
          console.error("发现未声明的变量", node.name);
        }
        break;
      }
      default:
        break;
    }
  },
  exit(path) {
    const node = path.node;
    switch (node.type) {
      case "Program":
        exitScope();
        break;
      case "FunctionDeclaration":
      case "FunctionExpression":
        exitScope();
        break;
    }
  },
});
// console.log(ast);
