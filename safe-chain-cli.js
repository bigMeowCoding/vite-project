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

/**
 * 检查是否需要添加可选链
 */
function needsOptionalChaining(node, parent) {
  // 检查成员表达式 (obj.prop)
  if (t.isMemberExpression(node) && !node.optional) {
    // 排除一些不需要可选链的情况
    if (t.isThisExpression(node.object)) return false;
    if (t.isSuper(node.object)) return false;
    
    // 获取根对象并检查是否为全局对象
    const rootObject = getRootObject(node);
    if (t.isIdentifier(rootObject)) {
      const globalObjects = ['console', 'window', 'document', 'process', 'global', 'Math', 'Date', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean'];
      if (globalObjects.includes(rootObject.name)) return false;
    }
    
    // 排除数组索引访问 (obj[index])
    if (node.computed) return false;
    
    // 检查是否已经在可选链中
    if (hasOptionalChainInPath(node)) return false;
    
    return true;
  }
  
  // 检查调用表达式 (obj.method())
  if (t.isCallExpression(node) && t.isMemberExpression(node.callee) && !node.callee.optional) {
    if (t.isThisExpression(node.callee.object)) return false;
    if (t.isSuper(node.callee.object)) return false;
    
    // 获取根对象并检查是否为全局对象
    const rootObject = getRootObject(node.callee);
    if (t.isIdentifier(rootObject)) {
      const globalObjects = ['console', 'window', 'document', 'process', 'global', 'Math', 'Date', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean'];
      if (globalObjects.includes(rootObject.name)) return false;
    }
    
    // 检查是否已经在可选链中
    if (hasOptionalChainInPath(node.callee)) return false;
    
    return true;
  }
  
  return false;
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
function transformCode(code, filePath) {
  const ast = parseCode(code, filePath);
  if (!ast) return { hasChanges: false, transformCount: 0, code };
  
  let hasChanges = false;
  let transformCount = 0;
  const transformations = [];
  
  const processedPositions = new Set();
  
  traverseDefault(ast, {
    MemberExpression(path) {
      if (DEFAULT_CONFIG.verbose) {
        console.log(`检查成员表达式: ${generateDefault(path.node).code}`);
      }
      
      // 跳过作为CallExpression.callee的MemberExpression，它们会在CallExpression中处理
      if (t.isCallExpression(path.parent) && path.parent.callee === path.node) {
        return;
      }
      
      if (needsOptionalChaining(path.node, path.parent)) {
        if (DEFAULT_CONFIG.verbose) {
          console.log(`转换: ${generateDefault(path.node).code} -> ${generateDefault(path.node).code.replace('.', '?.')}`);
        }
        
        // 记录转换位置 - 只转换属性访问的点
        const propertyStart = path.node.property.start - 1; // 点的位置
        
        if (!processedPositions.has(propertyStart)) {
          transformations.push({
            start: propertyStart,
            end: propertyStart + 1,
            type: 'member',
            node: path.node
          });
          processedPositions.add(propertyStart);
          
          hasChanges = true;
          transformCount++;
        }
      }
    },
    
    CallExpression(path) {
      if (t.isMemberExpression(path.node.callee)) {
        if (DEFAULT_CONFIG.verbose) {
          console.log(`检查调用表达式: ${generateDefault(path.node).code}`);
        }
        
        if (needsOptionalChaining(path.node.callee, path.node)) {
          if (DEFAULT_CONFIG.verbose) {
            console.log(`转换调用: ${generateDefault(path.node).code}`);
          }
          
          // 记录转换位置 - 只转换方法调用的点
          const propertyStart = path.node.callee.property.start - 1; // 点的位置
          
          if (!processedPositions.has(propertyStart)) {
            transformations.push({
              start: propertyStart,
              end: propertyStart + 1,
              type: 'call',
              node: path.node.callee
            });
            processedPositions.add(propertyStart);
            
            hasChanges = true;
            transformCount++;
          }
        }
      }
    }
  });
  
  // 应用转换（从后往前，避免位置偏移）
  let transformedCode = code;
  transformations.sort((a, b) => b.start - a.start);
  
  for (const transformation of transformations) {
    const before = transformedCode.substring(0, transformation.start);
    const after = transformedCode.substring(transformation.end);
    
    // 直接将点替换为可选链
    transformedCode = before + '?.' + after;
  }
  
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

// 解析命令行参数
program.parse();