const Collector = require("../utils/collector");
const fs = require("fs");
function saveAllLocaleData(localePath, localeFileType, defaultKey) {
  const keyMap = Collector.getKeyMap();
  console.log("keyMap", keyMap);
  const fullFilePath = [
    localePath,
    (defaultKey || "zh-cn") + "." + localeFileType,
  ].join("/");
  fs.writeFileSync(fullFilePath, JSON.stringify(keyMap, null, 2), "utf-8");
}

module.exports = {
  saveAllLocaleData,
};
