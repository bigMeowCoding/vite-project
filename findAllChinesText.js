const fs = require("fs");
const path = require("path");
const { findTextInJs } = require("./findTextInJs");
const { findTextInVue } = require("./findTextInVue");
const {getTransOriginText} = require("./extract");
/**
 * 判断是文件夹
 * @param path
 */
function isDirectory(path) {
  return fs.statSync(path).isDirectory();
}
function readAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = readAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}
/**
 * 读取文件
 * @param fileName
 */
function readFile(fileName) {
  if (fs.existsSync(fileName)) {
    return fs.readFileSync(fileName, "utf-8");
  }
}
function findChineseText(code, fileName) {
  if (fileName.endsWith(".html")) {
    // return findTextInHtml(code);
  } else if (fileName.endsWith(".vue")) {
    return findTextInVue(code);
  } else if (fileName.endsWith(".js") || fileName.endsWith(".jsx")) {
    return findTextInJs(code);
  } else {
    // return findTextInTs(code, fileName);
  }
}
function findAllChineseText(dir) {
  let files = readAllFiles(dir);

  const allTexts = files.reduce((pre, file) => {
    const code = readFile(file);
    findChineseText(code, file);
    // 调整文案顺序，保证从后面的文案往前替换，避免位置更新导致替换出错
    // const sortTexts = _.sortBy(texts, (obj) => -obj.range.start);
    // if (texts.length > 0) {
    //   console.log(
    //     `${highlightText(file)} 发现 ${highlightText(texts.length)} 处中文文案`,
    //   );
    // }

    // return texts.length > 0 ? pre.concat({ file, texts: sortTexts }) : pre;
  }, []);
// 对当前文件进行文案key生成和替换
  const generateKeyAndReplace = async item => {
    const currentFilename = item.file;
    console.log(`${currentFilename} 替换中...`);
    // 过滤掉模板字符串内的中文，避免替换时出现异常
    const targetStrs = item.texts.reduce((pre, strObj, i) => {
      // 因为文案已经根据位置倒排，所以比较时只需要比较剩下的文案即可
      const afterStrs = item.texts.slice(i + 1);
      if (afterStrs.some(obj => strObj.range.end <= obj.range.end)) {
        return pre;
      }
      return pre.concat(strObj);
    }, []);
    const len = item.texts.length - targetStrs.length;
    if (len > 0) {
      console.log((`存在 ${(len)} 处文案无法替换，请避免在模板字符串的变量中嵌套中文`));
    }

    let translateTexts;

    if (origin !== 'Google') {
      // 翻译中文文案，百度和pinyin将文案进行拼接统一翻译
      const delimiter = origin === 'Baidu' ? '\n' : '$';
      const translateOriginTexts = targetStrs.reduce((prev, curr, i) => {
        const transOriginText = getTransOriginText(curr.text);
        if (i === 0) {
          return transOriginText;
        }
        return `${prev}${delimiter}${transOriginText}`;
      }, []);

      translateTexts = await translateKeyText(translateOriginTexts, origin);
    } else {
      // google并发性较好，且未找到有效的分隔符，故仍然逐个文案进行翻译
      const translatePromises = targetStrs.reduce((prev, curr) => {
        const transOriginText = getTransOriginText(curr.text);
        return prev.concat(translateText(transOriginText, 'en_US'));
      }, []);

      [...translateTexts] = await Promise.all(translatePromises);
    }

    if (translateTexts.length === 0) {
      failInfo(`未得到翻译结果，${currentFilename}替换失败！`);
      return;
    }

    const replaceableStrs = getReplaceableStrs(currentFilename, langsPrefix, translateTexts, targetStrs);

    await replaceableStrs
        .reduce((prev, obj) => {
          return prev.then(() => {
            return replaceAndUpdate(currentFilename, obj.target, `I18N.${obj.key}`, false, obj.needWrite);
          });
        }, Promise.resolve())
        .then(() => {
          // 添加 import I18N
          if (!hasImportI18N(currentFilename)) {
            const code = createImportI18N(currentFilename);

            writeFile(currentFilename, code);
          }
          successInfo(`${currentFilename} 替换完成，共替换 ${targetStrs.length} 处文案！`);
        })
        .catch(e => {
          failInfo(e.message);
        });
  };

  allTexts
      .reduce((prev, current) => {
        return prev.then(() => {
          return generateKeyAndReplace(current);
        });
      }, Promise.resolve())
      .then(() => {
        console.log('okeeeeeee')
        // successInfo('全部替换完成！');
      })
      .catch(() => {
        // failInfo(e.message);
      });
  return allTexts;
}

module.exports = { findAllChineseText };
