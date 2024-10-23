function getMostFrequentOperator(asts) {
  let andCount = 0;
  let orCount = 0;

  function countOperators(node) {
    if (!node) return;
    if (node.type === "operator") {
      if (node.value === "AND") andCount++;
      if (node.value === "OR") orCount++;
      countOperators(node.left);
      countOperators(node.right);
    }
  }
  asts.forEach((ast) => countOperators(ast));
  return andCount >= orCount ? "AND" : "OR";
}

module.exports = { getMostFrequentOperator };
