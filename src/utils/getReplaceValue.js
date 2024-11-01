function getReplaceValue(translationKey) {
  // 表达式结构 $t('xx')
  return `t('${translationKey}')`;
}

module.exports = {
  getReplaceValue,
};
