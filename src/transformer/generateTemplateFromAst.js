const { NodeTypes } = require("@vue/compiler-core");

function generateTemplateFromAst(node) {
  switch (node.type) {
    case NodeTypes.ROOT:
      return generateRootNode(node);
    case NodeTypes.ELEMENT:
      return generateElementNode(node);
    case NodeTypes.TEXT:
      return generateTextNode(node);
    case NodeTypes.INTERPOLATION:
      return generateInterpolationNode(node);
    case NodeTypes.TEXT_CALL:
      return generateTextCallNode(node);
    case NodeTypes.COMPOUND_EXPRESSION:
      return generateCompoundExpressionNode(node);
    default:
      return "";
  }
}
function generateAttributes(props) {
  return props
    .filter((prop) => prop.type === NodeTypes.ATTRIBUTE)
    .map((prop) => {
      if (prop.value === undefined) {
        return prop.name;
      }
      return `${prop.name}="${prop.value ? prop.value.content : ""}"`;
    })
    .join(" ");
}

function generateDirectives(props) {
  return props
    .filter((prop) => prop.type === NodeTypes.DIRECTIVE)
    .map((prop) => {
      const { name, exp, arg } = prop;
      if (name === "on") {
        // 保留原始的事件处理器表达式
        return `@${arg.content}="${exp ? exp.loc.source : ""}"`;
      }
      if (name === "model") {
        return `v-model${arg ? `:${arg.content}` : ""}="${
          exp ? exp.loc.source : ""
        }"`;
      }
      if (name === "bind") {
        // 保留原始的绑定表达式，并处理可能的 JSON 字符串
        let expContent = exp ? exp.content : "";
        try {
          // 尝试解析 JSON
          const jsonObj = JSON.parse(expContent);
          // 如果成功解析，将对象转换为有效的 Vue 绑定表达式
          expContent = Object.entries(jsonObj)
            .map(
              ([key, value]) =>
                `${key}:${JSON.stringify(value).replace(/"/g, "'")}`
            )
            .join(",");
          // 用花括号包裹，形成有效的对象字面量
          expContent = `{${expContent}}`;
        } catch (e) {
          // 如果解析失败，保持原样，但将双引号替换为单引号
          expContent = exp ? exp.content : "";
        }
        return `:${arg.content}="${expContent}"`;
      }
      // 对于其他指令，保留原始表达式
      return `v-${name}${arg ? `:${arg.content}` : ""}="${
        exp ? exp.content : ""
      }"`;
    })
    .join(" ");
}

function generateTextNode(node) {
  return typeof node.content === "string" ? node.content : node.loc.source;
}

function generateInterpolationNode(node) {
  return `{{ ${node.content.loc.source} }}`;
}

function generateTextCallNode(node) {
  if (Array.isArray(node.content.children)) {
    return node.content.children.map(generateTemplateFromAst).join("");
  }
  if (typeof node.content === "string") {
    return node.content;
  } else {
    return generateTemplateFromAst(node.content);
  }
}

function generateCompoundExpressionNode(node) {
  if (Array.isArray(node.children)) {
    return node.children.map(generateTemplateFromAst).join("");
  }
  return node.content;
}
function generateRootNode(node) {
  return node.children.map(generateTemplateFromAst).join("");
}

function generateElementNode(node) {
  const attrs = generateAttributes(node.props);
  const directives = generateDirectives(node.props);
  const children = node.children.map(generateTemplateFromAst).join("");
  return `<${node.tag}${attrs ? " " + attrs : ""}${
    directives ? " " + directives : ""
  }>${children}</${node.tag}>`;
}

module.exports = { generateTemplateFromAst };
