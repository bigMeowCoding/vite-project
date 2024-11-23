const { default: babelGenerator } = require("@babel/generator");
const { default: traverse } = require("@babel/traverse");
const { includeChinese } = require("@/utils/includeChinese");
const Collector = require("@/utils/collector");
const { types: t } = require("@babel/core");
const template = require("@babel/template");
const stateManger = require("@/utils/store/stateManger");
const isEmpty = require("lodash/isEmpty");
const isObject = require("lodash/isObject");
function nodeToCode(node) {
  return babelGenerator(node).code;
}
function transformJs(source, option) {
  function transformAST(source, option) {
    let hasTransformed = false;
    const { rule } = option;
    const { caller, functionName, customizeKey } = rule;
    function getStringLiteral(value) {
      return Object.assign(t.stringLiteral(value), {
        extra: {
          raw: `'${value}'`,
          rawValue: value,
        },
      });
    }
    function getCallExpression(identifier, quote = "'") {
      const callerName = caller ? caller + "." : "";
      const expression = `${callerName}${functionName}(${quote}${identifier}${quote})`;
      return expression;
    }
    function getObjectExpression(param) {
      const arr = [];
      Object.keys(param).forEach((key) => {
        const temp = param[key];
        let newValue;
        if (isObject(temp)) {
          newValue = temp.value;
        } else {
          newValue = t.identifier(temp);
        }
        arr.push(t.objectProperty(t.identifier(key), newValue));
      });
      const ast = t.objectExpression(arr);
      return ast;
    }
    function getReplaceValue(translationKey, param) {
      if (!functionName) {
        return new Error("functionName is required");
      }

      // 表达式结构 obj.fn('xx',{xx:xx})
      let expression;
      if (param) {
        const keyLiteral = getStringLiteral(translationKey);
        if (caller) {
          return t.callExpression(
            t.memberExpressiont(
              t.identifier(caller),
              t.identifier(functionName)
            ),
            [keyLiteral, getObjectExpression(param)]
          );
        } else {
          return t.callExpression(t.identifier(functionName), [
            keyLiteral,
            getObjectExpression(param),
          ]);
        }
      } else {
        expression = getCallExpression(translationKey);
        return template.expression(expression)();
      }
    }
    function getTraverseOption() {
      return {
        StringLiteral(path) {
          console.log("StringLiteral", path.node);
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
        ExpressionStatement(path) {
          console.log("ExpressionStatement", path.node);
        },
        TemplateLiteral(path) {
          const node = path.node;
          const templateMembers = [...node.quasis, ...node.expressions];
          templateMembers.sort((a, b) => {
            return a.start - b.start;
          });
          const shouldReplace = templateMembers.some((member) => {
            return includeChinese(member.value.raw);
          });
          if (shouldReplace) {
            let value = "";
            let slotIndex = 1;
            const param = {};
            templateMembers.forEach((node) => {
              if (node.type === "Identifier") {
                value += `{${node.name}}`;
                param[node.name] = node.name;
              } else if (node.type === "TemplateLiteral") {
                value += node.value.raw.replace(/[\r\n]/g, "");
              } else if (node.type === "MemberExpression") {
                const key = `slot${slotIndex++}`;
                value += key;
                param[key] = {
                  isAstNode: true,
                  value: node,
                };
              } else {
                const key = `slot${slotIndex++}`;
                value += key;
                const expression = babelGenerator(node).code;
                const tempAst = transformAST(expression, option);
                const expressAst = tempAst.program.body[0].expression;

                param[key] = {
                  isAstNode: true,
                  value: expressAst,
                };
              }
            });
            hasTransformed = true;
            const translationKey = Collector.add(value, customizeKey);
            const slotParam = isEmpty(param) ? undefined : param;
            path.replaceWith(getReplaceValue(translationKey, slotParam));
          }
        },
        CallExpression(path) {
          const node = path.node;
          const code = nodeToCode(node);
          const callee = node.callee;
          const globalRule = stateManger.getToolConfig().globalRule;
          globalRule.forEach((ignoreRule) => {
            if (code.startsWith(ignoreRule)) {
              path.skip();
            }
          });
          // 跳过console.log的提取
          if (
            callee.type === "MemberExpression" &&
            callee.object.type === "Identifier" &&
            callee.object.name === "console"
          ) {
            path.skip();
            return;
          }

          // 无调用对象的情况，例如$t('xx')
          if (callee.type === "Identifier" && callee.name === functionName) {
            path.skip();
            return;
          }

          // 有调用对象的情况，例如this.$t('xx')、i18n.$t('xx)
          if (callee.type === "MemberExpression") {
            if (callee.property && callee.property.type === "Identifier") {
              if (callee.property.name === functionName) {
                // 处理形如i18n.$t('xx)的情况
                if (
                  callee.object.type === "Identifier" &&
                  callee.object.name === caller
                ) {
                  path.skip();
                  return;
                }
                // 处理形如this.$t('xx')的情况
                if (
                  callee.object.type === "ThisExpression" &&
                  caller === "this"
                ) {
                  path.skip();
                  return;
                }
              }
            }
          }
        },
        ArrowFunctionExpression(path) {
          console.log("ArrowFunctionExpression", path.node);
        },
        FunctionDeclaration(path) {
          console.log("FunctionDeclaration", path.node);
        },
        ObjectProperty(path) {
          console.log("ObjectProperty", path.node);
        },
        ObjectExpression(path) {
          console.log("ObjectExpression", path.node);
        },
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
