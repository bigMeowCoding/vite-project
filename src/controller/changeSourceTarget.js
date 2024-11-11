const fs = require("fs");
const path = require("path");

const Collector = require("../utils/collector");

const { getOutputPath } = require("../utils/getOutputPath");
const { transform } = require("../transformer/transform");
function changeSourceTarget(filePath, options) {
  console.log("changeSourceTarget", options);
  let templateCode = "";
  const { input, output, rules, adjustKeyMap } = options;

  const source = fs.readFileSync(filePath, "utf-8");
  const ext = path.extname(filePath).replace(".", "");
  Collector.setCurrentCollectorPath(filePath);
  Collector.resetCountOfAdditions();
  const { code } = transform(source, ext, rules, filePath);

  console.log("templateCode", code);

  if (Collector.getCountOfAdditions() > 0) {
    const outputPath = getOutputPath("", "", filePath);
    fs.writeFileSync(outputPath, templateCode, "utf8");
  }
  Collector.resetCurrentFileKeyMap();
}

module.exports = { changeSourceTarget };
