function includeChinese(code) {
  return new RegExp("[\u{4E00}-\u{9FFF}]", "g").test(code);
}

module.exports = {
  includeChinese,
};
