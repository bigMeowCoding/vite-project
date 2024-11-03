const { getAbsolutePath } = require("./getAbsolutePath");
const fs = require("fs-extra");

function getOutputPath(input, output, sourceFilePath) {
  let outputPath;
  if (output) {
    const filePath = sourceFilePath.replace(input + "/", "");
    outputPath = getAbsolutePath(process.cwd(), output, filePath);
    fs.ensureFileSync(outputPath);
  } else {
    outputPath = getAbsolutePath(process.cwd(), sourceFilePath);
  }
  return outputPath;
}

module.exports = {
  getOutputPath,
};
