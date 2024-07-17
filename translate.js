const { findAllChineseText } = require("./findAllChinesText");
const path = require("node:path");
findAllChineseText(path.join(process.cwd(), "./src"));
