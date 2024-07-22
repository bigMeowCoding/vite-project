// 以下为i18n.config.js默认的完整配置，所有属性均为可选，可以根据自身需要修改
module.exports = {
  input: 'src',
  output: '', // 没有值时表示完成提取后自动覆盖原始文件
  exclude: ['**/node_modules/**/*'], // 排除不需要提取的文件
  localePath: './locales/zh-CN.json', // 中文语言包的存放位置
  localeFileType: 'json', // 设置语言包的文件类型，支持js、json。默认为json
  // rules每个属性对应的是不同后缀文件的处理方式
  rules: {
    js: {
      caller: '', // 自定义this.$t('xxx')中的this。不填则默认没有调用对象
      functionName: '$t', // 自定义this.$t('xxx')中的$t
      customizeKey: function (key, currentFilePath) {
        return key
      }, // 自定义this.$t('xxx')中的'xxx'部分的生成规则
      importDeclaration: 'import t from "./in8n/index"', // 默认在文件里导入i18n包。不填则默认不导入i18n的包。由于i18n的npm包有很多，用户可根据项目自行修改导入语法
      forceImport: false, // 即使文件没出现中文，也强行插入importDeclaration定义的语句
    },
    // ts,cjs,mjs,jsx,tsx配置方式同上
    ts: {
      caller: '',
      functionName: 't',
      customizeKey: function (key, currentFilePath) {
        return key
      },
      importDeclaration: 'import { t } from "i18n"',
      forceImport: false,
    },
    cjs: {
      caller: '',
      functionName: 't',
      customizeKey: function (key, currentFilePath) {
        return key
      },
      importDeclaration: 'import { t } from "i18n"',
      forceImport: false,
    },
    mjs: {
      caller: '',
      functionName: 't',
      customizeKey: function (key, currentFilePath) {
        return key
      },
      importDeclaration: 'import { t } from "i18n"',
      forceImport: false,
    },
    jsx: {
      caller: '',
      functionName: 't',
      customizeKey: function (key, currentFilePath) {
        return key
      },
      importDeclaration: 'import { t } from "i18n"',
      functionSnippets: '', // react函数组件里，全局加代码片段
      forceImport: false,
    },
    tsx: {
      caller: '',
      functionName: 't',
      customizeKey: function (key, currentFilePath) {
        return key
      },
      importDeclaration: 'import { t } from "i18n"',
      functionSnippets: '',
      forceImport: false,
    },
    vue: {
      caller: '',
      importDeclaration: '',
      functionNameInTemplate: '$t',// vue这里的配置，仅针对vue的template标签里面的内容生效
      functionNameInScript: '$t', // vue这里的配置，仅针对vue的script部分export default里面的内容生效
      customizeKey: function (key, currentFilePath) {
        return key
      },
      importDeclaration: '',
      forceImport: false,
      tagOrder: ['template', 'script', 'style'], // 支持自定义vue文件的标签顺序
    },
  },
  globalRule: {
    ignoreMethods: [] // 忽略指定函数调用的中文提取。例如想忽略sensor.track('中文')的提取。这里就写['sensor.track']
  },
  // prettier配置，参考https://prettier.io/docs/en/options.html
  prettier: {
    semi: false,
    singleQuote: true,
  },
  skipExtract: false, // 跳过提取中文阶段
  // 以下是和翻译相关的配置，注意搭配使用
  skipTranslate: true, // 跳过翻译语言包阶段。默认不翻译
  locales: [], // 需要翻译的语言包。例如['en', 'zh-CHT']，会自动翻译英文和繁体
  excelPath: './locales.xlsx', // excel存放路径
  exportExcel: false, // 是否导出excel
  // 参数：
  // allKeyValue：已遍历的所有文件的key-value
  // currentFileKeyMap: 当前文件提取到的key-value
  // currentFilePath: 当前遍历的文件路径
  adjustKeyMap(allKeyValue, currentFileKeyMap, currentFilePath) {return allKeyValue}, // 对提取结构进行二次处理
}