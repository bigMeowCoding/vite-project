const { getUserConfig } = require("./getUserConfig");
const defaultConfig = require("./default.config");
const { merge } = require("lodash");

function getI18nConfig(options) {
  const userConfig = getUserConfig(options);
  merge(defaultConfig, options, userConfig);
  return userConfig;
}

module.exports = {
  getI18nConfig,
};
