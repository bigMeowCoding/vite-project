const fs = require("fs");
const path = require("path");
const { cloneDeep } = require("lodash");
const Collector = require("../utils/collector");

const { getOutputPath } = require("../utils/getOutputPath");
const { transform } = require("../transformer/transform");
function changeSourceTarget(filePath, options) {
  const { input, output, rules, adjustKeyMap } = options;

  const source = fs.readFileSync(filePath, "utf-8");
  const ext = path.extname(filePath).replace(".", "");
  Collector.setCurrentCollectorPath(filePath);
  Collector.resetCountOfAdditions();
  const { code } = transform(source, ext, rules, filePath);

  if (Collector.getCountOfAdditions() > 0) {
    const outputPath = getOutputPath(input, output, filePath);
    fs.writeFileSync(outputPath, code, "utf8");
  }
  // 自定义当前文件的keyMap
  if (adjustKeyMap) {
    const newkeyMap = adjustKeyMap(
      cloneDeep(Collector.getKeyMap()),
      Collector.getCurrentFileKeyMap(),
      filePath
    );
    Collector.setKeyMap(newkeyMap);
    Collector.resetCurrentFileKeyMap();
  }
}

module.exports = { changeSourceTarget };
