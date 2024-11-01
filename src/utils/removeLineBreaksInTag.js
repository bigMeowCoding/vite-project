function removeLineBreaksInTag(str) {
  return str.replace(/([\r\n]+\s*)+/g, "");
}

module.exports = {
  removeLineBreaksInTag,
};
