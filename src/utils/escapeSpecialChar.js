function escapeSpecialChar(text) {
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&amp;/g, "&");
  return text;
}
module.exports = { escapeSpecialChar };
