const path = require("path");
// const sl÷ash = require("slash");

function getAbsolutePath(...paths) {
  return path.resolve(...paths);
}

module.exports = {
  getAbsolutePath,
};
