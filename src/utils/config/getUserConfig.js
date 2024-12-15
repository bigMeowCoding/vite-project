const { getAbsolutePath } = require("../getAbsolutePath");
const fs = require("fs");

function getUserConfig(options = {}) {
  const configFile = options.configFile || "";
  if (configFile) {
    const configPath = getAbsolutePath(process.cwd(), configFile);
    if (!fs.existsSync(configPath)) {
      return {};
    } else {
      const config = require(configPath);
      // prettier为true时删除，是为了走默认的配置
      if (config.prettier === true) {
        delete config.prettier;
      }
      config.input = options.input || config.input;
      config.incremental = options.incremental || config.incremental;
      return config;
    }
  } else {
    return {};
  }
}

module.exports = {
  getUserConfig,
};
