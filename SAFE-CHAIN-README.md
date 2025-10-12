# Safe Chain CLI - 前端代码安全转换工具

一个自动将JavaScript/TypeScript代码中的不安全属性访问转换为可选链（Optional Chaining）的命令行工具。

## 功能特性

- 🔍 **智能扫描**: 自动识别需要添加可选链的代码模式
- 🛡️ **安全转换**: 将 `obj.property` 转换为 `obj?.property`
- 🎯 **精确识别**: 智能跳过全局对象、数组访问、this/super等不需要转换的场景
- 📁 **批量处理**: 支持扫描整个目录或处理单个文件
- 🔧 **可配置**: 支持自定义配置文件
- 💾 **安全备份**: 自动创建备份文件，避免数据丢失

## 安装和使用

### 快速开始

```bash
# 扫描 src 目录（预览模式）
npm run safe-chain:check

# 扫描并修复 src 目录
npm run safe-chain:fix

# 处理单个文件
npm run safe-chain:file -- path/to/file.js

# 查看帮助
npm run safe-chain:help
```

### 命令行选项

```bash
# 基本命令
node safe-chain-cli.js <command> [options]

# 扫描命令
node safe-chain-cli.js scan [directory] [options]
node safe-chain-cli.js scan src --preview --verbose
node safe-chain-cli.js scan --no-backup

# 文件命令
node safe-chain-cli.js file <filepath> [options]
node safe-chain-cli.js file src/utils/helper.js --verbose

# 选项说明
--preview, -p     预览模式，不修改文件
--verbose, -v     显示详细信息
--backup, -b      创建备份文件（默认开启）
--no-backup       不创建备份文件
--help, -h        显示帮助信息
```

### NPM Scripts

项目已配置以下便捷脚本：

```json
{
  "scripts": {
    "safe-chain": "node safe-chain-cli.js",
    "safe-chain:scan": "node safe-chain-cli.js scan",
    "safe-chain:preview": "node safe-chain-cli.js scan --preview",
    "safe-chain:src": "node safe-chain-cli.js scan src",
    "safe-chain:file": "node safe-chain-cli.js file",
    "safe-chain:fix": "node safe-chain-cli.js scan --no-backup",
    "safe-chain:check": "node safe-chain-cli.js scan --preview --verbose",
    "safe-chain:help": "node safe-chain-cli.js --help"
  }
}
```

## 转换示例

### 对象属性访问
```javascript
// 转换前
const name = user.profile.name;
const email = user.contact.email;

// 转换后
const name = user?.profile?.name;
const email = user?.contact?.email;
```

### 方法调用
```javascript
// 转换前
const result = user.getData();
const formatted = user.format.toString();

// 转换后
const result = user?.getData();
const formatted = user?.format?.toString();
```

### 函数调用链
```javascript
// 转换前
const data = api.request().then().catch();

// 转换后
const data = api?.request()?.then()?.catch();
```

## 智能跳过场景

工具会智能跳过以下不需要转换的场景：

### 1. 全局对象
```javascript
// 这些不会被转换
console.log('test');
window.location.href = '/';
document.body.style.color = 'red';
Math.max(1, 2);
JSON.stringify(data);
```

### 2. 数组访问
```javascript
// 这些不会被转换
const first = items[0];
const value = arr[index];
```

### 3. this 和 super
```javascript
// 这些不会被转换
class TestClass {
  method() {
    this.property = 'value';
    return this.getValue();
  }
}
```

### 4. 已有可选链
```javascript
// 已有可选链不会重复添加
const existing = user?.profile?.name;
```

## 配置文件

创建 `safe-chain.config.js` 文件来自定义配置：

```javascript
export default {
  // 扫描目录
  scanDirs: ['src', 'api'],
  
  // 包含的文件模式
  include: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx', '**/*.vue'],
  
  // 排除的文件和目录
  exclude: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '**/*.min.js',
    '**/*.test.js'
  ],
  
  // 全局对象列表
  globalObjects: [
    'window', 'document', 'console', 'global',
    'Math', 'Date', 'JSON', 'Object', 'Array'
  ],
  
  // 转换选项
  transform: {
    memberExpression: true,    // 转换成员表达式
    callExpression: true,      // 转换调用表达式
    skipExisting: true,        // 跳过已有可选链
    skipArrayAccess: true,     // 跳过数组访问
    skipThisSuper: true        // 跳过this和super
  },
  
  // 输出选项
  output: {
    backup: true,              // 创建备份文件
    verbose: false,            // 显示详细信息
    preview: false             // 预览模式
  }
};
```

## 工具函数

项目还提供了 `safe-chain-utils.js` 工具函数库，包含：

- `loadConfig()` - 加载配置文件
- `getFilesToScan()` - 获取扫描文件列表
- `isJavaScriptFile()` - 检查文件类型
- `formatFileSize()` - 格式化文件大小
- `formatDuration()` - 格式化时间
- `createProgressBar()` - 创建进度条
- `generateReport()` - 生成统计报告
- `validateConfig()` - 验证配置

## 注意事项

1. **备份重要**: 建议在首次使用时保持备份功能开启
2. **预览先行**: 使用 `--preview` 选项先查看会进行哪些转换
3. **逐步验证**: 对于大型项目，建议先在小范围测试
4. **代码审查**: 转换后建议进行代码审查，确保转换正确

## 技术实现

- 使用 `@babel/parser` 解析JavaScript/TypeScript代码
- 使用 `@babel/traverse` 遍历AST节点
- 使用 `@babel/types` 进行类型检查
- 使用 `commander` 构建命令行界面
- 使用 `chalk` 提供彩色输出
- 使用 `glob` 进行文件匹配

## 许可证

MIT License