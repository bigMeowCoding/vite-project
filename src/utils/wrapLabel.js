const wrapLabel = (text, maxCharsPerLine) => {
  let result = "";
  for (let i = 0; i < text.length; i += maxCharsPerLine) {
    result += text.slice(i, i + maxCharsPerLine) + "\n";
  }
  return result.trim(); // 去掉最后一行多余的换行符
};
export default wrapLabel;
