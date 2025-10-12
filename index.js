import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import generateModule from '@babel/generator';
import fs from 'fs';

// 读取test.js内容

const code = fs.readFileSync('./test.js', 'utf8');

// 解析为AST
const ast = parse(code, {
  sourceType: 'module',
});

// 兼容 CJS/ESM 的默认导出
const traverse = traverseModule.default || traverseModule;
const generate = generateModule.default || generateModule;

// 遍历AST
traverse(ast, {
  VariableDeclaration(path) {
    if (['const', 'let'].includes(path.node.kind)) {
      path.node.kind = 'var';
      console.log(path.type);
    }
  },
  enter(path) {
    console.log(path.type);
    if (path.isMemberExpression()) {
      path.node.computed = true;
    }
  },
});

//重新生成代码
const output = generate(ast, {}, code);
console.log(output.code);
// 写入bundle.js
fs.writeFileSync('./bundle.js', output.code, 'utf8');
