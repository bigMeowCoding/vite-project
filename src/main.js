require('module-alias/register');
const { genreZhToI18 } = require("./controller/genre");

genreZhToI18({
  configFile: "./i18n.config.js",
});
