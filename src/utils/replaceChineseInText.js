// 用于替换中文文本的函数
const { getOrCreateKey } = require("./getOrCreateKey");

function replaceChineseInText(text) {
  const regex = /([\u4e00-\u9fff]+)/g;
  const parts = [];
  let lastIndex = 0;

  text.replace(regex, (match, chinese, offset) => {
    // 添加匹配之前的文本
    if (offset > lastIndex) {
      parts.push(`'${text.slice(lastIndex, offset)}'`);
    }

    // 处理中文
    const key = getOrCreateKey(chinese.trim());
    parts.push(`t('${key}')`);

    lastIndex = offset + match.length;
  });

  // 添加最后剩余的文本
  if (lastIndex < text.length) {
    parts.push(`'${text.slice(lastIndex)}'`);
  }

  // 如果只有一个部分且是中文，直接返回 t 函数调用
  if (parts.length === 1 && parts[0].startsWith("t(")) {
    return parts[0];
  }

  // 否则，使用 + 拼接所有部分
  return parts.join(" + ");
}

module.exports = {
  replaceChineseInText,
};
