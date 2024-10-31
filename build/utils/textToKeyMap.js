let textToKeyMap = new Map();

exports.getTextToKeyMap = function () {
  return textToKeyMap;
};

exports.addToTextToKeyMap = function (key, value) {
  textToKeyMap[key] = value;
};
