const defaultConfig = require("../config/default.config");
class StateManager {
  toolConfig = defaultConfig;
  constructor() {}
  static getInstance() {
    if (!this._instance) {
      this._instance = new StateManager();
    }
    return this._instance;
  }
  setToolConfig(config) {
    this.toolConfig = config;
  }
  getToolConfig() {
    return this.toolConfig;
  }
}

module.exports = StateManager.getInstance();
