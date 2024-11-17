const glob = require("glob");

function getOnlyAddIncludes(exclude, includes) {
  return includes.reduce((data, item) => {
    const result = glob.sync(item, {
      ignore: exclude,
    });
    return [...data, ...result];
  }, []);
}

module.exports = {
  getOnlyAddIncludes,
};
