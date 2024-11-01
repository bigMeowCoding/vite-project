function escapeQuotes(value) {
  return value.replace(/'/g, "_#_").replace(/"/g, "_##_");
}

module.exports = { escapeQuotes };
