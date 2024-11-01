const customizeKey = (key) => {
  key = key.replace(/\./g, "_").replace(/ /g, "").replace(/\[|\]/g, "_");
  return `${key}`;
};
module.exports = {
  customizeKey,
};
