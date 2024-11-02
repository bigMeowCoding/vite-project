function genreObjectDeep(obj) {
  const newObj = {};
  const keys = Object.keys(obj);
  for (const key of keys) {
    const keyArr = key.split(".");
    const val = obj[key];
    keyArr.reduce((data, item, index) => {
      if (index >= keyArr.length - 1) {
        data[item] = val;
      } else {
        data[item] = data[item] || {};
        return data[item];
      }
      return data;
    }, newObj);
  }

  return newObj;
}

module.exports = {
  genreObjectDeep,
};
