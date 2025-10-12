import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import generateModule from '@babel/generator';
import * as t from '@babel/types';
import fs from 'fs';

function main() {
  // 读取test.js内容
  const code = fs.readFileSync('./test.js', 'utf8');

  // 解析为AST
  const ast = parse(code, {
    sourceType: 'module',
  });

  // 兼容 CJS/ESM 的默认导出
  const traverse = traverseModule.default || traverseModule;
  const generate = generateModule.default || generateModule;

  // 判断是否位于赋值/更新的左侧（可选链不可用于赋值目标或更新表达式）
  function isInvalidLHS(path) {
    const parent = path.parentPath;
    if (!parent) return false;
    if (parent.isAssignmentExpression() && path.key === 'left') return true;
    if (parent.isUpdateExpression() && path.key === 'argument') return true;
    return false;
  }

  // 判断该路径或其祖先是否已包含可选链
  function hasOptionalChain(path) {
    return path.isOptionalMemberExpression() || path.isOptionalCallExpression();
  }

  // 是否是调用/构造表达式的 callee（这些场景不应在 MemberExpression 处加可选链）
  function isCalleeOfCallOrNew(path) {
    const parent = path.parentPath;
    if (!parent) return false;
    return parent.isNewExpression() && path.key === 'callee';
  }

  // 将 MemberExpression 转为 OptionalMemberExpression
  function makeOptionalMember(path) {
    const { object, property, computed } = path.node;
    const ome = t.optionalMemberExpression(object, property, computed, true);
    path.replaceWith(ome);
  }

  // 将 CallExpression 转为 OptionalCallExpression
  function makeOptionalCall(path) {
    const { callee, arguments: args } = path.node;
    // super()/new 调用不处理
    if (t.isSuper(callee) || path.parentPath?.isNewExpression()) return;
    const oce = t.optionalCallExpression(callee, args, true);
    path.replaceWith(oce);
  }

  // 遍历AST并自动补充可选链
  traverse(ast, {
    // 对象字面量中的展开参数兜底：{ ...(arg || {}) }
    ObjectExpression(path) {
      const props = path.node.properties;
      for (const prop of props) {
        if (t.isSpreadElement(prop)) {
          const arg = prop.argument;
          // 已有兜底或条件则跳过
          if (t.isLogicalExpression(arg) || t.isConditionalExpression(arg)) continue;
          const fallback = t.objectExpression([]);
          prop.argument = t.logicalExpression('||', arg, fallback);
        }
      }
    },
    // 数组字面量中的展开参数兜底：[ ...(arg || []) ]
    ArrayExpression(path) {
      const elems = path.node.elements;
      for (const el of elems) {
        if (el && t.isSpreadElement(el)) {
          const arg = el.argument;
          if (t.isLogicalExpression(arg) || t.isConditionalExpression(arg)) continue;
          const fallback = t.arrayExpression([]);
          el.argument = t.logicalExpression('||', arg, fallback);
        }
      }
    },
    // 为对象/数组解构在右侧添加空对象/空数组兜底：init || {} / init || []
    VariableDeclarator(path) {
      const { id, init } = path.node;
      if (!init) return;
      // 对象解构
      if (t.isObjectPattern(id)) {
        // 如果已存在兜底（|| 或 ??）则跳过
        if (t.isLogicalExpression(init) || t.isConditionalExpression(init)) return;
        const fallback = t.objectExpression([]);
        path.node.init = t.logicalExpression('||', init, fallback);
      }
      // 数组解构
      if (t.isArrayPattern(id)) {
        if (t.isLogicalExpression(init) || t.isConditionalExpression(init)) return;
        const fallback = t.arrayExpression([]);
        path.node.init = t.logicalExpression('||', init, fallback);
      }
    },
    // 赋值表达式的解构也加兜底：right || {} / right || []
    AssignmentExpression(path) {
      const { left, right } = path.node;
      if (!right) return;
      if (t.isObjectPattern(left)) {
        if (t.isLogicalExpression(right) || t.isConditionalExpression(right)) return;
        const fallback = t.objectExpression([]);
        path.node.right = t.logicalExpression('||', right, fallback);
      }
      if (t.isArrayPattern(left)) {
        if (t.isLogicalExpression(right) || t.isConditionalExpression(right)) return;
        const fallback = t.arrayExpression([]);
        path.node.right = t.logicalExpression('||', right, fallback);
      }
    },
    MemberExpression(path) {
      if (isInvalidLHS(path)) return;
      if (isCalleeOfCallOrNew(path)) return; // 跳过函数调用与 new 的 callee
      if (hasOptionalChain(path)) return;
      makeOptionalMember(path);
    },
    CallExpression(path) {
      if (hasOptionalChain(path)) return;
      makeOptionalCall(path);
    },
  });

  //重新生成代码
  const output = generate(ast, {}, code);
  console.log(output.code);
  // 写入bundle.js
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
  }
  fs.writeFileSync('./dist/bundle.js', output.code, 'utf8');
}

main();
