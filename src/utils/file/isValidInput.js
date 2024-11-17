const fs = require("fs");
const { getAbsolutePath } = require("../getAbsolutePath");

function isValidInput(input) {
  const inputPath = getAbsolutePath(process.cwd(), input);

  if (!fs.existsSync(inputPath)) {
    console.error(`路径${inputPath}不存在,请重新设置input参数`);
    process.exit(1);
  }
  if (!fs.statSync(inputPath).isDirectory()) {
    console.error(`路径${inputPath}不是一个目录,请重新设置input参数`);
    process.exit(1);
  }
  return true;
}

module.exports = {
  isValidInput,
};
