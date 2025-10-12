/**
 * Safe Chain CLI 工具函数
 */

import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

/**
 * 加载配置文件
 */
export async function loadConfig(configPath = './safe-chain.config.js') {
  try {
    if (await fs.pathExists(configPath)) {
      const config = await import(path.resolve(configPath));
      return config.default || config;
    }
  } catch (error) {
    console.warn(`配置文件加载失败: ${error.message}`);
  }
  
  // 返回默认配置
  return {
    scanDirs: ['src'],
    include: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    exclude: ['node_modules/**', 'dist/**', 'build/**'],
    globalObjects: ['window', 'document', 'console', 'global', 'process'],
    transform: {
      memberExpression: true,
      callExpression: true,
      skipExisting: true,
      skipArrayAccess: true,
      skipThisSuper: true
    },
    output: {
      backup: true,
      verbose: false,
      preview: false
    }
  };
}

/**
 * 获取需要扫描的文件列表
 */
export async function getFilesToScan(directories, config) {
  const files = [];
  
  for (const dir of directories) {
    if (!(await fs.pathExists(dir))) {
      console.warn(`目录不存在: ${dir}`);
      continue;
    }
    
    const patterns = config.include.map(pattern => path.join(dir, pattern));
    
    for (const pattern of patterns) {
      const matchedFiles = await glob(pattern, {
        ignore: config.exclude,
        nodir: true
      });
      
      files.push(...matchedFiles);
    }
  }
  
  // 去重并排序
  return [...new Set(files)].sort();
}

/**
 * 检查文件是否为JavaScript/TypeScript文件
 */
export function isJavaScriptFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ['.js', '.ts', '.jsx', '.tsx', '.vue'].includes(ext);
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 格式化持续时间
 */
export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

/**
 * 创建进度条
 */
export function createProgressBar(total, width = 40) {
  return {
    total,
    current: 0,
    update(current) {
      this.current = current;
      const percentage = Math.round((current / total) * 100);
      const filled = Math.round((current / total) * width);
      const empty = width - filled;
      
      const bar = '█'.repeat(filled) + '░'.repeat(empty);
      const progress = `[${bar}] ${percentage}% (${current}/${total})`;
      
      process.stdout.write(`\r${progress}`);
      
      if (current === total) {
        process.stdout.write('\n');
      }
    }
  };
}

/**
 * 生成统计报告
 */
export function generateReport(stats) {
  const report = [];
  
  report.push('📊 转换统计报告');
  report.push('='.repeat(50));
  report.push(`扫描文件数: ${stats.filesScanned}`);
  report.push(`修改文件数: ${stats.filesModified}`);
  report.push(`总转换数: ${stats.transformations}`);
  
  if (stats.errors && stats.errors.length > 0) {
    report.push(`错误数: ${stats.errors.length}`);
    report.push('');
    report.push('❌ 错误详情:');
    stats.errors.forEach((error, index) => {
      report.push(`${index + 1}. ${error.file}: ${error.message}`);
    });
  }
  
  if (stats.duration) {
    report.push('');
    report.push(`⏱️  处理时间: ${formatDuration(stats.duration)}`);
  }
  
  return report.join('\n');
}

/**
 * 验证配置
 */
export function validateConfig(config) {
  const errors = [];
  
  if (!config.scanDirs || !Array.isArray(config.scanDirs)) {
    errors.push('scanDirs 必须是数组');
  }
  
  if (!config.include || !Array.isArray(config.include)) {
    errors.push('include 必须是数组');
  }
  
  if (!config.exclude || !Array.isArray(config.exclude)) {
    errors.push('exclude 必须是数组');
  }
  
  if (errors.length > 0) {
    throw new Error(`配置验证失败:\n${errors.join('\n')}`);
  }
  
  return true;
}