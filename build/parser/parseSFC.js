const { parse } = require("@vue/compiler-sfc");

exports.parseSFC = function (filePath) {
  const source = fs.readFileSync(filePath, "utf-8");
  return parse(source);
};

// 如果有必要，可以添加处理解析结果的函数，例如生成模板内容
