const fs = require("fs");
const genreLocalExportJs = (localePath, language) => {
  const template = `const data = import.meta.glob('./${language}/**/*.json', { eager: true });
  
  const genreLanguageJson = module => {
    const mapData = {};
    for (const i in module) {
      const [, key] = i.match(/\\.\\/${language}\\/(.*?)\\.json/) || [];
      const keysArr = key.split('/');
      const resultData = module[i].default;
      keysArr.reduce((data, item, index) => {
        if (index === keysArr.length - 1) {
          data[item] = resultData;
        } else {
          data = data[item] = {};
        }
        return data;
      }, mapData);
    }
    return mapData;
  };
  
  export default genreLanguageJson(data);`;
  fs.writeFile([localePath, `${language}.js`].join("/"), template, (e) => {});
};

module.exports = {
  genreLocalExportJs,
};
