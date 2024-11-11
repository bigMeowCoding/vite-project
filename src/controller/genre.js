const { getI18nConfig } = require("../utils/config/getI18nConfig");
const { genreI18n } = require("./genreI18n");

function genreZhToI18(options) {
  const config = getI18nConfig(options);
  // console.log("i18n config", config);

  genreI18n(config);
}

module.exports = {
  genreZhToI18,
};
