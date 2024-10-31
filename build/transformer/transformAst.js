function traverseAst(node, callback) {
  callback(node);
  if (node.children) {
    node.children.forEach((child) => traverseAst(child, callback));
  }
}
module.exports = {
  traverseAst,
};
