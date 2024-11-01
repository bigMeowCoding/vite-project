const { removeLineBreaksInTag } = require("./removeLineBreaksInTag");
const { escapeQuotes } = require("./escapeQuates");

class Collector {
  static _instance = null;
  keyMap = {};
  currentFileKeyMap = {};
  countOfAdditions = 0;

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new Collector();
    return this._instance;
  }
  constructor() {}

  setCurrentCollectorPath(path) {
    this.currentFilePath = path;
  }

  getCurrentCollectorPath() {
    return this.currentFilePath;
  }
  add(text, customeKeyFn) {
    let formatedText = removeLineBreaksInTag(text);
    const translationKey = customeKeyFn(
      escapeQuotes(formatedText),
      this.currentFilePath,
    );
    this.keyMap[translationKey] = formatedText.replace("|", "{'|'}");
    this.countOfAdditions++;
    this.currentFileKeyMap[translationKey] = formatedText;
    return translationKey;
  }

  getCurrentFileKeyMap() {
    return this.currentFileKeyMap;
  }

  resetCurrentFileKeyMap() {
    this.currentFileKeyMap = {};
  }

  getKeyMap() {
    return this.keyMap;
  }

  setKeyMap(value) {
    this.keyMap = value;
  }

  resetCountOfAdditions() {
    this.countOfAdditions = 0;
  }

  getCountOfAdditions() {
    return this.countOfAdditions;
  }
}
module.exports = Collector.getInstance();
