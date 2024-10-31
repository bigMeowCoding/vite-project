// 用于获取或建键的函数
const { getTextToKeyMap } = require("./textToKeyMap");

function getOrCreateKey(text) {
  const textToKeyMap = getTextToKeyMap();
  if (!textToKeyMap.has(text)) {
    const key = `key_${textToKeyMap.size}`;
    textToKeyMap.set(text, key);
  }
  return textToKeyMap.get(text);
}

module.exports = {
  getOrCreateKey,
};
