#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

// 修复ES模块导入问题
const traverseDefault = traverse.default || traverse;
const generateDefault = generate.default || generate;

// 配置选项
const DEFAULT_CONFIG = {
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  exclude: ['node_modules/**', 'dist/**', 'build/**'],
  backup: true,
  preview: false,
  verbose: false
};

// 扫描结果统计
let scanStats = {
  filesScanned: 0,
  filesModified: 0,
  transformations: 0,
  issues: []
};

/**
 * 解析JavaScript/TypeScript代码
 */
function parseCode(code, filePath) {
  const isTypeScript = /\.(ts|tsx)$/.test(filePath);
  
  try {
    return parse(code, {
      sourceType: 'module',
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      plugins: [
        'jsx',
        'asyncGenerators',
        'bigInt',
        'classProperties',
        'decorators-legacy',
        'doExpressions',
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'functionBind',
        'functionSent',
        'importMeta',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        'throwExpressions',
        'topLevelAwait',
        'trailingFunctionCommas',
        ...(isTypeScript ? ['typescript'] : [])
      ]
    });
  } catch (error) {
    scanStats.issues.push({
      file: filePath,
      type: 'parse_error',
      message: error.message
    });
    return null;
  }
}

/**
 * 获取成员表达式的根对象
 */
function getRootObject(node) {
  let current = node;
  while (t.isMemberExpression(current) && current.object) {
    current = current.object;
  }
  return current;
}

// 判断是否为调用或构造的 callee 位置
function isCalleeOfCallOrNew(path) {
  const parent = path.parentPath;
  if (!parent) return false;
  const n = parent.node;
  return (t.isCallExpression(n) || t.isNewExpression(n)) && n.callee === path.node;
}

/**
 * 检查节点路径中是否已经有可选链
 */
function hasOptionalChainInPath(node) {
  let current = node;
  while (current) {
    if (t.isMemberExpression(current) && current.optional) {
      return true;
    }
    if (t.isCallExpression(current) && t.isMemberExpression(current.callee) && current.callee.optional) {
      return true;
    }
    current = current.object || (current.callee && current.callee.object);
  }
  return false;
}

/**
 * 转换代码，添加可选链
 */
export function transformCode(code, filePath) {
  const ast = parseCode(code, filePath);
  if (!ast) return { hasChanges: false, transformCount: 0, code };
  
  let hasChanges = false;
  let transformCount = 0;
  
  traverseDefault(ast, {
    // 对象字面量中的展开参数兜底：{ ...(arg || {}) }
    ObjectExpression(path) {
      const props = path.node.properties;
      for (const prop of props) {
        if (t.isSpreadElement(prop)) {
          const arg = prop.argument;
          if (t.isLogicalExpression(arg) || t.isConditionalExpression(arg)) continue;
          const fallback = t.objectExpression([]);
          prop.argument = t.logicalExpression('||', arg, fallback);
          hasChanges = true;
          transformCount++;
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
          hasChanges = true;
          transformCount++;
        }
      }
    },
    // 为对象/数组解构在右侧添加空对象/空数组兜底：init || {} / init || []
    VariableDeclarator(path) {
      const { id, init } = path.node;
      if (!init) return;
      if (t.isLogicalExpression(init) || t.isConditionalExpression(init)) return;
      if (t.isObjectPattern(id)) {
        path.node.init = t.logicalExpression('||', init, t.objectExpression([]));
        hasChanges = true;
        transformCount++;
      } else if (t.isArrayPattern(id)) {
        path.node.init = t.logicalExpression('||', init, t.arrayExpression([]));
        hasChanges = true;
        transformCount++;
      }
    },
    // 赋值解构右侧兜底：right || {} / right || []
    AssignmentExpression(path) {
      const { left, right } = path.node;
      if (t.isLogicalExpression(right) || t.isConditionalExpression(right)) return;
      if (t.isObjectPattern(left)) {
        path.node.right = t.logicalExpression('||', right, t.objectExpression([]));
        hasChanges = true;
        transformCount++;
      } else if (t.isArrayPattern(left)) {
        path.node.right = t.logicalExpression('||', right, t.arrayExpression([]));
        hasChanges = true;
        transformCount++;
      }
    },
    // 成员访问可选链
    MemberExpression(path) {
      // 跳过作为调用/构造的 callee，在调用里处理或跳过
      if (isCalleeOfCallOrNew(path)) {
        // 对 NewExpression 的 callee 必须跳过，避免 new obj?.Ctor()
        if (t.isNewExpression(path.parent)) return;
        // CallExpression 的 callee 在 CallExpression 处理中统一加可选链
        return;
      }
      const { object, property, computed } = path.node;
      // 写上下文跳过：赋值目标、更新表达式
      const parent = path.parent;
      if (t.isAssignmentExpression(parent) && parent.left === path.node) return;
      if (t.isUpdateExpression(parent) && parent.argument === path.node) return;
      // 跳过 this/super
      if (t.isThisExpression(object) || t.isSuper(object)) return;
      // 跳过全局对象
      const rootObject = getRootObject(path.node);
      if (t.isIdentifier(rootObject)) {
        const globalObjects = ['console', 'window', 'document', 'process', 'global', 'Math', 'Date', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean'];
        if (globalObjects.includes(rootObject.name)) return;
      }
      // 根据配置跳过数组访问（括号访问）
      if (path.node.computed && DEFAULT_CONFIG.skipArrayAccess) return;
      // 已存在可选链则跳过
      if (path.node.optional || hasOptionalChainInPath(path.node)) return;
      // 转换为可选成员访问
      const opt = t.optionalMemberExpression(object, property, computed, true);
      path.replaceWith(opt);
      hasChanges = true;
      transformCount++;
    },
    // 调用可选链
    CallExpression(path) {
      const { callee } = path.node;
      if (!t.isMemberExpression(callee)) return;
      // 跳过 this/super
      if (t.isThisExpression(callee.object) || t.isSuper(callee.object)) return;
      // 跳过 NewExpression（不适用）
      if (t.isNewExpression(path.parent) && path.parent.callee === path.node) return;
      // 跳过全局对象
      const rootObject = getRootObject(callee);
      if (t.isIdentifier(rootObject)) {
        const globalObjects = ['console', 'window', 'document', 'process', 'global', 'Math', 'Date', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean'];
        if (globalObjects.includes(rootObject.name)) return;
      }
      // 根据配置跳过数组访问（括号访问）
      if (callee.computed && DEFAULT_CONFIG.skipArrayAccess) return;
      // 已存在可选链则跳过
      if ((t.isMemberExpression(callee) && callee.optional) || hasOptionalChainInPath(callee)) return;
      // 先对成员访问加可选链（保证取到方法）
      const newCallee = t.optionalMemberExpression(callee.object, callee.property, callee.computed, true);
      // 再将调用改为可选调用（避免对 undefined 调用）
      const newCall = t.optionalCallExpression(newCallee, path.node.arguments, true);
      path.replaceWith(newCall);
      hasChanges = true;
      transformCount++;
    }
  });
  
  const transformedCode = generateDefault(ast, { retainLines: false }).code;
  
  if (hasChanges) {
    scanStats.filesModified++;
    scanStats.transformations += transformCount;
    
    if (DEFAULT_CONFIG.verbose) {
      console.log(chalk.green(`✓ ${filePath}: ${transformCount} transformations`));
    }
  }
  
  return { hasChanges, transformCount, code: transformedCode };
}

/**
 * 处理单个文件
 */
async function processFile(filePath, options = {}) {
  try {
    if (options.verbose) {
      console.log(`读取文件: ${filePath}`);
    }
    
    const code = await fs.readFile(filePath, 'utf8');
    
    if (options.verbose) {
      console.log(`文件内容长度: ${code.length} 字符`);
    }
    
    scanStats.filesScanned++;
    
    const { hasChanges, transformCount, code: transformedCode } = transformCode(code, filePath);
    
    if (hasChanges && !options.preview) {
      // 创建备份
      if (options.backup) {
        await fs.copy(filePath, `${filePath}.backup`);
      }
      
      if (options.verbose) {
        console.log(`转换后代码长度: ${transformedCode.length} 字符`);
        console.log(`转换后代码前100字符: ${transformedCode.substring(0, 100)}`);
      }
      
      await fs.writeFile(filePath, transformedCode);
    }
    
    return { hasChanges, transformCount };
  } catch (error) {
    if (options.verbose) {
      console.log(`处理文件出错: ${filePath}, 错误: ${error.message}`);
    }
    scanStats.issues.push({
      file: filePath,
      type: 'process_error',
      message: error.message
    });
    return false;
  }
}

/**
 * 扫描目录中的文件
 */
async function scanDirectory(directory, options = {}) {
  const config = { ...DEFAULT_CONFIG, ...options };
  
  // 构建glob模式
  const patterns = config.extensions.map(ext => `**/*${ext}`);
  const files = await glob(patterns, {
    cwd: directory,
    ignore: config.exclude,
    absolute: true
  });
  
  console.log(chalk.blue(`Found ${files.length} files to process...`));
  
  // 处理文件
  for (const file of files) {
    await processFile(file, config);
  }
  
  // 输出统计信息
  console.log(chalk.cyan('\n=== 转换统计 ==='));
  console.log(`扫描文件: ${scanStats.filesScanned}`);
  console.log(`修改文件: ${scanStats.filesModified}`);
  console.log(`总转换数: ${scanStats.transformations}`);
  
  if (scanStats.issues.length > 0) {
    console.log(chalk.yellow(`\n⚠️  发现 ${scanStats.issues.length} 个问题:`));
    scanStats.issues.forEach(issue => {
      console.log(chalk.red(`  ${issue.file}: ${issue.message}`));
    });
  }
  
  if (config.preview) {
    console.log(chalk.yellow('\n📋 预览模式：未实际修改文件'));
  } else if (scanStats.filesModified > 0) {
    console.log(chalk.green('\n✅ 转换完成！'));
    if (config.backup) {
      console.log(chalk.gray('💾 已创建备份文件（.backup后缀）'));
    }
  }
}

// 命令行程序配置
program
  .name('safe-chain-cli')
  .description('自动为JavaScript/TypeScript代码添加可选链操作符')
  .version('1.0.0');

program
  .command('scan [directory]')
  .description('扫描并转换指定目录中的代码文件')
  .option('-p, --preview', '预览模式，不实际修改文件')
  .option('-b, --no-backup', '不创建备份文件')
  .option('-v, --verbose', '显示详细输出')
  .option('-e, --extensions <exts>', '指定文件扩展名，用逗号分隔', '.js,.jsx,.ts,.tsx')
  .option('--exclude <patterns>', '排除的文件模式，用逗号分隔', 'node_modules/**,dist/**,build/**')
  .action(async (directory = '.', options) => {
    const config = {
      preview: options.preview,
      backup: options.backup,
      verbose: options.verbose,
      extensions: options.extensions.split(','),
      exclude: options.exclude.split(',')
    };
    
    Object.assign(DEFAULT_CONFIG, config);
    
    console.log(chalk.blue('🔍 Safe Chain CLI - 代码安全转换工具'));
    console.log(chalk.gray(`扫描目录: ${path.resolve(directory)}`));
    
    await scanDirectory(directory, config);
  });

program
  .command('file <filepath>')
  .description('处理单个文件')
  .option('-p, --preview', '预览模式，不实际修改文件')
  .option('-b, --no-backup', '不创建备份文件')
  .option('-v, --verbose', '显示详细输出')
  .action(async (filepath, options) => {
    console.log(chalk.blue('🔍 Safe Chain CLI - 处理单个文件'));
    
    // 设置全局配置
    DEFAULT_CONFIG.verbose = options.verbose;
    
    const result = await processFile(filepath, {
      preview: options.preview,
      backup: options.backup,
      verbose: options.verbose
    });
    
    if (result && result.hasChanges) {
      console.log(chalk.green(`✅ 文件已处理: ${result.transformCount} 个转换`));
    } else {
      console.log(chalk.yellow('ℹ️  文件无需修改'));
    }
  });

// 仅在作为 CLI 直接执行时解析命令行
const isDirectRun = (() => {
  try {
    const invoked = process.argv[1] ? path.resolve(process.argv[1]) : '';
    const current = new URL(import.meta.url).pathname;
    return current === invoked;
  } catch {
    return true;
  }
})();

if (isDirectRun) {
  program.parse();
}