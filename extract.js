
const slash = require( 'slash2');
const  _ = require( 'lodash');
/**
 * 将对象拍平
 * @param obj 原始对象
 * @param prefix
 */
function flatten(obj, prefix = '') {
    var propName = prefix ? prefix + '.' : '',
        ret = {};

    for (var attribute in obj) {
        var attr = attribute.replace(/-/g, '_');
        if (_.isArray(obj[attr])) {
            var len = obj[attr].length;
            ret[attr] = obj[attr].join(',');
        } else if (typeof obj[attr] === 'object') {
            _.extend(ret, flatten(obj[attr], propName + attr));
        } else {
            ret[propName + attr] = obj[attr];
        }
    }
    return ret;
}
/**
 * 获取全部语言, 展平
 */
function getSuggestLangObj() {
    const langObj = getI18N();
    const finalLangObj = flatten(langObj);
    return finalLangObj;
}
function findMatchValue(langObj, key) {
    return langObj[key];
}
function findMatchKey(langObj, text) {
    for (const key in langObj) {
        if (langObj[key] === text) {
            return key;
        }
    }

    return null;
}
function getTransOriginText(text) {
    // 避免翻译的字符里包含数字或者特殊字符等情况，只过滤出汉字和字母
    const reg = /[a-zA-Z\u4e00-\u9fa5]+/g;
    const findText = text.match(reg) || [];
    const transOriginText = findText ? findText.join('').slice(0, 5) : '中文符号';

    return transOriginText;
}
/**
 * @param currentFilename 文件路径
 * @returns string[]
 */
function getSuggestion(currentFilename) {
    let suggestion = [];
    const suggestPageRegex = /\/pages\/\w+\/([^\/]+)\/([^\/\.]+)/;

    if (currentFilename.includes('/pages/')) {
        suggestion = currentFilename.match(suggestPageRegex);
    }
    if (suggestion) {
        suggestion.shift();
    }
    /** 如果没有匹配到 Key */
    if (!(suggestion && suggestion.length)) {
        const names = slash(currentFilename).split('/');
        const fileName = _.last(names);
        const fileKey = fileName.split('.')[0].replace(new RegExp('-', 'g'), '_');
        const dir = names[names.length - 2].replace(new RegExp('-', 'g'), '_');
        if (dir === fileKey) {
            suggestion = [dir];
        } else {
            suggestion = [dir, fileKey];
        }
    }

    return suggestion;
}

/**
 * 统一处理key值，已提取过的文案直接替换，翻译后的key若相同，加上出现次数
 * @param currentFilename 文件路径
 * @param langsPrefix 替换后的前缀
 * @param translateTexts 翻译后的key值
 * @param targetStrs 当前文件提取后的文案
 * @returns any[] 最终可用于替换的key值和文案
 */
function getReplaceableStrs(currentFilename, langsPrefix, translateTexts, targetStrs) {
    const finalLangObj = getSuggestLangObj();
    const virtualMemory = {};
    const suggestion = getSuggestion(currentFilename);
    const replaceableStrs = targetStrs.reduce((prev, curr, i) => {
        const _text = curr.text;
        let key = findMatchKey(finalLangObj, _text);
        if (key) {
            key = key.replace(/-/g, '_');
        }
        if (!virtualMemory[_text]) {
            if (key) {
                virtualMemory[_text] = key;
                return prev.concat({
                    target: curr,
                    key,
                    needWrite: false
                });
            }
            const transText = translateTexts[i] && _.camelCase(translateTexts[i]);
            let transKey = `${suggestion.length ? suggestion.join('.') + '.' : ''}${transText}`;
            transKey = transKey.replace(/-/g, '_');
            if (langsPrefix) {
                transKey = `${langsPrefix}.${transText}`;
            }
            let occurTime = 1;
            // 防止出现前四位相同但是整体文案不同的情况
            while (
                findMatchValue(finalLangObj, transKey) !== _text &&
                _.keys(finalLangObj).includes(`${transKey}${occurTime >= 2 ? occurTime : ''}`)
                ) {
                occurTime++;
            }
            if (occurTime >= 2) {
                transKey = `${transKey}${occurTime}`;
            }
            virtualMemory[_text] = transKey;
            finalLangObj[transKey] = _text;
            return prev.concat({
                target: curr,
                key: transKey,
                needWrite: true
            });
        } else {
            return prev.concat({
                target: curr,
                key: virtualMemory[_text],
                needWrite: true
            });
        }
    }, []);

    return replaceableStrs;
}
module.exports = {
    getTransOriginText
}
