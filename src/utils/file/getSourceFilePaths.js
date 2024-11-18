const { isValidInput } = require("./isValidInput");
const glob = require("glob");

const { getOnlyAddIncludes } = require("./getOnlyAddIncludes");
function getSourceFilePaths(input, exclude, includes) {
  if (isValidInput(input)) {
    if (!includes) {
      return glob.sync(`${input}/**/*.{cjs,mjs,js,ts,tsx,jsx,vue}`, {
        ignore: exclude,
      });
    } else {
      return getOnlyAddIncludes(exclude, includes);
    }
  } else {
    return [];
  }
}
module.exports = {
  getSourceFilePaths,
};
