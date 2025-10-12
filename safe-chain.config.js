/**
 * Safe Chain CLI 配置文件
 */

export default {
  // 扫描目录配置
  scanDirs: ['src', 'api'],
  
  // 文件匹配模式
  include: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx', '**/*.vue'],
  
  // 排除的文件和目录
  exclude: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '**/*.min.js',
    '**/*.test.js',
    '**/*.spec.js'
  ],
  
  // 全局对象列表（不会被转换）
  globalObjects: [
    'window',
    'document',
    'console',
    'global',
    'process',
    'Math',
    'Date',
    'JSON',
    'Object',
    'Array',
    'String',
    'Number',
    'Boolean',
    'RegExp',
    'Error',
    'Promise',
    'Set',
    'Map',
    'WeakSet',
    'WeakMap'
  ],
  
  // 转换选项
  transform: {
    // 是否转换成员表达式
    memberExpression: true,
    
    // 是否转换调用表达式
    callExpression: true,
    
    // 是否跳过已有可选链
    skipExisting: true,
    
    // 是否跳过数组访问
    skipArrayAccess: true,
    
    // 是否跳过this和super
    skipThisSuper: true
  },
  
  // 输出选项
  output: {
    // 是否创建备份文件
    backup: true,
    
    // 是否显示详细信息
    verbose: false,
    
    // 是否只预览不修改
    preview: false
  }
};