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
