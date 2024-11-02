const path = require("path");
// const slash = require("slash");

function getAbsolutePath(...paths) {
  return (path.resolve(...paths));
}

module.exports = {
  getAbsolutePath,
};
